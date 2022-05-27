import { ApiProperty } from '@nestjs/swagger';

export class TransferTokenItoA2DTO {
  @ApiProperty({
    example: 4,
    description: 'id data base from send token',
  })
  indexFrom: number;
  @ApiProperty({
    example: 'ID7EM5J3BCCTXMFEQYXY5KI3AATEMYGYJQUUFRHTUPWCC3SX2M7WNJUNY4',
    description: 'address of reciever',
  })
  addressTo: string;
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
