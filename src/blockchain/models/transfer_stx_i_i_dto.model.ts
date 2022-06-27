import { ApiProperty } from '@nestjs/swagger';

export class TrasnferSTXItoIDTO {
  @ApiProperty({
    example: 2,
    description: 'id user database epioneer to send stx',
  })
  indexTo: string;
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
