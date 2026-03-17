/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @UseGuards(JwtGuard)
  @Get('balance')
  getWallet(@Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.walletService.getWallet(req.user.userId);
  }
}
