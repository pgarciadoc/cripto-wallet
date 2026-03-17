import { Body, Controller, Post, Get, Query, Req } from '@nestjs/common';
import { SwapService } from './swap.service';
import { SwapDto } from './dto/swap.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

interface RequestWithUser extends Request {
  user: {
    userId: string;
  };
}

@Controller('swap')
export class SwapController {
  constructor(private readonly swapService: SwapService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async swap(@Req() req: RequestWithUser, @Body() data: SwapDto) {
    return this.swapService.swap(req.user.userId, data);
  }

  @Get('quote')
  getQuote(@Query() data: SwapDto) {
    return this.swapService.getQuote(data);
  }
}
