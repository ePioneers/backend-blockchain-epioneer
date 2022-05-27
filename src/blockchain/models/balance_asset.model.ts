import { ApiProperty } from '@nestjs/swagger';

export class BalanceAsset {
  constructor({
    assetId,
    balance,
    creator,
    isFrozen,
    balanceCompact,
  }: {
    assetId?: number;
    balance?: number;
    creator?: string;
    isFrozen?: boolean;
    balanceCompact?: number;
  } = {}) {
    this.assetId = assetId;
    this.balance = balance;
    this.creator = creator;
    this.isFrozen = isFrozen;
    this.balanceCompact = balanceCompact;
  }

  @ApiProperty({
    example: 41739149,
    description: 'Id of asset in algorand blockchain',
  })
  assetId: number;

  @ApiProperty({
    example: 2.974,
    description: 'Balance of Asset - Micro Token',
  })
  balance: number;

  @ApiProperty({ example: 2.974, description: 'Balance of Asset' })
  balanceCompact: number;

  @ApiProperty({
    example: '5SR4B6HJKRQ7RVZYXLXQEWZX3SCXEAKPZSYXLWVQUB2S6HJNDCVF7XAJWP',
    description: 'Balance of Algos in microalgos',
  })
  creator: string;

  @ApiProperty({ example: false, description: 'Validate if asset is frozen' })
  isFrozen: boolean;
}
