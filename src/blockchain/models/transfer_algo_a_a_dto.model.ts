import { ApiProperty } from "@nestjs/swagger";

export class TrasnferAlgoAtoADTO {
  @ApiProperty({example: '3HIN5IMODLPQ5V3STFWNYB6AFM6YYENGLTZKFQEFMJXDW7ZLXSARHXMNUZ', description: 'Address to send algos'})
  addressTo: string;
  @ApiProperty({example: "your secret mnemonic phrase", description: 'Secret mnemonic phrase to owner of algos to be send'})
  secretFrom: string;
  @ApiProperty({example: 1.5, description: 'Amount of Algo to be sended'})
  amount: number;
  @ApiProperty({example: 'hi', description: 'Optional message to transaction'})
  msg?: string;
}