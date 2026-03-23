import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WithdrawDto } from './dto/withdraw.dto';
import { Token } from '@prisma/client';

@Injectable()
export class WithdrawService {
  constructor(private prisma: PrismaService) {}

  async withdraw(userId: string, data: WithdrawDto) {
    const amount = Number(data.amount);

    return this.prisma.$transaction(async (tx) => {
      // Wallet
      const wallet = await tx.wallet.findUnique({
        where: { userId },
      });

      if (!wallet) {
        throw new BadRequestException('Wallet not found');
      }

      // Balance
      const balance = await tx.balance.findUnique({
        where: {
          walletId_token: {
            walletId: wallet.id,
            token: data.token as Token,
          },
        },
      });

      if (!balance || Number(balance.amount) < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      const oldBalance = Number(balance.amount);
      const newBalance = oldBalance - amount;

      // Débito
      await tx.balance.update({
        where: {
          walletId_token: {
            walletId: wallet.id,
            token: data.token as Token,
          },
        },
        data: {
          amount: {
            decrement: amount,
          },
        },
      });

      // Ledger
      await tx.ledger.create({
        data: {
          userId,
          token: data.token as Token,
          type: 'WITHDRAWAL',
          amount,
          previousBalance: oldBalance,
          newBalance,
        },
      });

      return {
        token: data.token as Token,
        withdrawn: amount,
        remainingBalance: newBalance,
      };
    });
  }
}
