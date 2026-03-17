import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SwapDto } from './dto/swap.dto';
import axios from 'axios';

@Injectable()
export class SwapService {
  constructor(private prisma: PrismaService) {}

  async swap(userId: string, data: SwapDto) {
    if (data.fromToken === data.toToken) {
      throw new BadRequestException('Tokens must be different');
    }

    const amount = Number(data.amount);

    return this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({
        where: { userId },
      });

      if (!wallet) {
        throw new BadRequestException('Wallet not found');
      }

      const fromBalance = await tx.balance.findUnique({
        where: {
          walletId_token: {
            walletId: wallet.id,
            token: data.fromToken,
          },
        },
      });

      if (!fromBalance || Number(fromBalance.amount) < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      const oldBalance = Number(fromBalance.amount);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const rate = await this.getRate(data.fromToken, data.toToken);

      const fee = amount * 0.015;
      const amountAfterFee = amount - fee;
      const receivedAmount = amountAfterFee * rate;
      await tx.balance.update({
        where: {
          walletId_token: {
            walletId: wallet.id,
            token: data.fromToken,
          },
        },
        data: {
          amount: {
            decrement: amount,
          },
        },
      });

      // Ledger saída
      await tx.ledger.create({
        data: {
          userId,
          token: data.fromToken,
          type: 'SWAP_OUT',
          amount,
          previousBalance: oldBalance,
          newBalance: oldBalance - amount,
        },
      });

      // Ledger taxa
      const balanceAfterSwap = oldBalance - amount;

      await tx.ledger.create({
        data: {
          userId,
          token: data.fromToken,
          type: 'SWAP_FEE',
          amount: fee,
          previousBalance: balanceAfterSwap,
          newBalance: balanceAfterSwap - fee,
        },
      });

      // CREDITO

      const toBalance = await tx.balance.upsert({
        where: {
          walletId_token: {
            walletId: wallet.id,
            token: data.toToken,
          },
        },
        update: {
          amount: {
            increment: receivedAmount,
          },
        },
        create: {
          walletId: wallet.id,
          token: data.toToken,
          amount: receivedAmount,
        },
      });

      // Ledger entrada
      await tx.ledger.create({
        data: {
          userId,
          token: data.toToken,
          type: 'SWAP_IN',
          amount: receivedAmount,
          previousBalance: Number(toBalance.amount) - receivedAmount,
          newBalance: toBalance.amount,
        },
      });

      return {
        from: data.fromToken,
        to: data.toToken,
        sent: amount,
        fee,
        received: receivedAmount,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        rate,
      };
    });
  }

  // QUOTE
  async getQuote(data: SwapDto) {
    const amount = Number(data.amount);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const rate = await this.getRate(data.fromToken, data.toToken);

    const fee = amount * 0.015;
    const amountAfterFee = amount - fee;

    const amountOut = amountAfterFee * rate;

    return {
      fromToken: data.fromToken,
      toToken: data.toToken,
      amountIn: amount,
      fee,
      amountOut,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      rate,
    };
  }
  // COINGECKO

  private async getRate(from: string, to: string) {
    const map = {
      BTC: 'bitcoin',
      ETH: 'ethereum',
    };

    // BRL → CRYPTO
    if (from === 'BRL') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const coinId = map[to];
      if (!coinId) {
        throw new BadRequestException('Unsupported token');
      }
      const res = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            ids: coinId,
            vs_currencies: 'brl',
          },
        },
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const priceInBRL = res.data[coinId].brl;

      return 1 / priceInBRL;
    }

    // CRYPTO → BRL
    if (to === 'BRL') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const coinId = map[from];
      if (!coinId) {
        throw new BadRequestException('Unsupported token');
      }

      const res = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            ids: coinId,
            vs_currencies: 'brl',
          },
        },
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return res.data[coinId].brl;
    }

    throw new BadRequestException('Unsupported pair');
  }
}
