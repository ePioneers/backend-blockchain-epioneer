import { ApiProperty } from '@nestjs/swagger';

export class TrasnferTokenAtoIDTO {
  @ApiProperty({
    example: 'your secret mnemonic phrase',
    description: 'Secret mnemonic phrase to owner of token to be send',
  })
  secretFrom: string;
  @ApiProperty({ example: 6, description: 'Address to send algos' })
  indexTo: number;
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
