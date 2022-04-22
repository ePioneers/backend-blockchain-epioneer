import { ApiProperty } from '@nestjs/swagger';

export class TrasnferTokenAtoADTO {
  @ApiProperty({
    example: 'your secret mnemonic phrase',
    description: 'Secret mnemonic phrase to owner of token to be send',
  })
  secretFrom: string;
  @ApiProperty({
    example: '3HIN5IMODLPQ5V3STFWNYB6AFM6YYENGLTZKFQEFMJXDW7ZLXSARHXMNUZ',
    description: 'Address to send Token',
  })
  secretTo: string;
  @ApiProperty({ example: 1.5, description: 'Amount of token to be sended' })
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
