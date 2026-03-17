import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { WebhookService } from './webhooks.service';
import { DepositDto } from './dto/deposit.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    userId: string;
  };
}

@Controller('webhooks')
export class WebhooksController {
  constructor(private webhooksService: WebhookService) {}

  @Post('deposit')
  @UseGuards(JwtGuard)
  deposit(@Body() data: DepositDto, @Req() req: RequestWithUser) {
    return this.webhooksService.deposit(data, req.user.userId);
  }
}
