import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getWallet(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        balances: true,
      },
    });

    if (!wallet) {
      throw new Error('Wallet Not Found');
    }
    return wallet;
  }
}
