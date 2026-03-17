import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DepositDto } from './dto/deposit.dto';

@Injectable()
export class WebhookService {
  constructor(private prisma: PrismaService) {}

  async deposit(data: DepositDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 🔹 evita duplicidade (idempotência)
      const existing = await tx.deposit.findUnique({
        where: { idempotencyKey: data.idempotencyKey },
      });

      if (existing) {
        return existing;
      }

      //  busca wallet do usuário
      const wallet = await tx.wallet.findUnique({
        where: { userId },
      });

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      //  cria depósito
      const deposit = await tx.deposit.create({
        data: {
          userId,
          token: data.token,
          amount: data.amount,
          idempotencyKey: data.idempotencyKey,
        },
      });

      //  atualiza saldo
      const balance = await tx.balance.upsert({
        where: {
          walletId_token: {
            walletId: wallet.id,
            token: data.token,
          },
        },
        update: {
          amount: {
            increment: data.amount,
          },
        },
        create: {
          walletId: wallet.id,
          token: data.token,
          amount: data.amount,
        },
      });

      //  registra no ledger
      await tx.ledger.create({
        data: {
          userId,
          token: data.token,
          type: 'DEPOSIT',
          amount: data.amount,
          previousBalance: Number(balance.amount) - data.amount,
          newBalance: balance.amount,
        },
      });

      return deposit;
    });
  }
}
