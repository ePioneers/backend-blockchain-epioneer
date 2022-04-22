import { ApiProperty } from '@nestjs/swagger';

export class TransferTokenItoADTO {
  @ApiProperty({
    example: 4,
    description: 'id data base from send token',
  })
  indexFrom: number;
  @ApiProperty({
    example: 'efefm eetet tete tetet...',
    description: 'Secret mnemonic phrase to receiver tokens to be send',
  })
  secretTo: string;
  @ApiProperty({ example: 1.5, description: 'Amount of Algo to be sended' })
  amount: number;
  @ApiProperty({
    example: 'hi',
    description: 'Optional message to transaction',
  })
  msg?: string;
  @ApiProperty({
    example: 85278567,
    description: 'ASSET ID of token',
  })
  assetID: number;
}
