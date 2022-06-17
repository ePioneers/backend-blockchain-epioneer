import { ApiProperty } from '@nestjs/swagger';

export class TrasnferSTXPKtoADTO {
  @ApiProperty({
    example: 'STNNB1ZWQN2EBYPNS6JFQ3MBM01DXAH33DGJYWN1',
    description: 'Address to send Stacks',
  })
  addressTo: string;
  @ApiProperty({
    example: 'your private key',
    description: 'Private key to owner of STX to be send',
  })
  secretFrom: string;
  @ApiProperty({ example: 1.5, description: 'Amount of STX to be sended' })
  amount: number;
  @ApiProperty({
    example: 'hi',
    description: 'Optional message to transaction',
  })
  msg?: string;
}
