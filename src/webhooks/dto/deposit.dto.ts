import { IsEnum, IsNumber, IsString } from 'class-validator';

export class DepositDto {
  @IsString()
  userId: string;

  @IsEnum(['BRL', 'BTC', 'ETH'])
  token: 'BRL' | 'BTC' | 'ETH';

  @IsNumber()
  amount: number;

  @IsString()
  idempotencyKey: string;
}
