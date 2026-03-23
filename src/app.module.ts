import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
//import { PrismaModule } from './prisma/prisma.module';
import { SwapModule } from './swap/swap.module';
import { WalletModule } from './wallet/wallet.module';
import { LedgerModule } from './ledger/ledger.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { WithdrawModule } from './withdraw/withdraw.module';

@Module({
  imports: [
    AuthModule,
    WalletModule,
    SwapModule,
    LedgerModule,
    WebhooksModule,
    WithdrawModule,
    //PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
