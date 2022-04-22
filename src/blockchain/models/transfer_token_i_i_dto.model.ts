import { ApiProperty } from '@nestjs/swagger';

export class TrasnferTokenItoIDTO {
  @ApiProperty({
    example: 11,
    description: 'Index data base to receiver token',
  })
  indexTo: number;
  @ApiProperty({ example: 5, description: 'Index data base to send token' })
  indexFrom: number;
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
