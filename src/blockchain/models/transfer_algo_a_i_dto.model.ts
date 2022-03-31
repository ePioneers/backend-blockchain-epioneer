import { ApiProperty } from '@nestjs/swagger';

export class TrasnferAlgoAtoIDTO {
  @ApiProperty({ example: 6, description: 'Address to send algos' })
  indexTo: number;
  @ApiProperty({
    example: 'your secret mnemonic phrase',
    description: 'Secret mnemonic phrase to owner of algos to be send',
  })
  secretFrom: string;
  @ApiProperty({ example: 1.5, description: 'Amount of Algo to be sended' })
  amount: number;
  @ApiProperty({
    example: 'hi',
    description: 'Optional message to transaction',
  })
  msg?: string;
}
