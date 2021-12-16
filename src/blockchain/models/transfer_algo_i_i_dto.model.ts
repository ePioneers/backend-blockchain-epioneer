import { ApiProperty } from "@nestjs/swagger";

export class TrasnferAlgoItoIDTO {
  @ApiProperty({example: 11, description: 'Index data base to receiver algos'})
  indexTo: number;
  @ApiProperty({example: 5, description: 'Index data base to send algos'})
  indexFrom: number;
  @ApiProperty({example: 1.5, description: 'Amount of Algo to be sended'})
  amount: number;
  @ApiProperty({example: 'hi', description: 'Optional message to transaction'})
  msg?: string;
}