import { ApiProperty } from '@nestjs/swagger';

export class StacksBalance {
  constructor({
    account,
    balanceStacks,
  }: {
    account?: string;
    balanceStacks?;
  } = {}) {
    this.account = account;
    this.balanceStacks = balanceStacks;
  }

  @ApiProperty({
    example: 'ST13NV2355DQ04ZP3DBYN8QD87BP5M37KBE9DTCDX',
    description: 'Consulted account',
  })
  account: string;

  @ApiProperty({
    example: 'Data balance Stacks',
    description: 'Balance of Stacks',
  })
  balanceStacks;
}
