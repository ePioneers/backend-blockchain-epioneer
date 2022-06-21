import { ApiProperty } from '@nestjs/swagger';

export class TrasnferSTXItoADTO {
  @ApiProperty({
    example: 'STNNB1ZWQN2EBYPNS6JFQ3MBM01DXAH33DGJYWN1',
    description: 'Address to send Stacks',
  })
  addressTo: string;
  @ApiProperty({
    example: 1,
    description: 'id user database epioneer',
  })
  indexFrom: string;
  @ApiProperty({ example: 1.5, description: 'Amount of STX to be sended' })
  amount: number;
  @ApiProperty({
    example: 'hi',
    description: 'Optional message to transaction',
  })
  msg?: string;
}
