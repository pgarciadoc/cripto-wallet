import { IsEnum, IsNumber } from 'class-validator';

export class SwapDto {
  @IsEnum(['BRL', 'BTC', 'ETH'])
  fromToken: 'BRL' | 'BTC' | 'ETH';

  @IsEnum(['BRL', 'BTC', 'ETH'])
  toToken: 'BRL' | 'BTC' | 'ETH';

  @IsNumber()
  amount: number;
}
