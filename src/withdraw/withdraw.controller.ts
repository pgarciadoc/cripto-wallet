import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { WithdrawService } from './withdraw.service';
import { WithdrawDto } from './dto/withdraw.dto';
import { AuthGuard } from '@nestjs/passport';

interface RequestWithUser extends Request {
  user: {
    userId: string;
  };
}

@Controller('withdraw')
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  withdraw(@Req() req: RequestWithUser, @Body() data: WithdrawDto) {
    return this.withdrawService.withdraw(req.user.userId, data);
  }
}
