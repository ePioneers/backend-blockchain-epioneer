import { ApiProperty } from '@nestjs/swagger';
import { BalanceAsset } from './balance_asset.model';

export class Balance {
  constructor({
    account,
    balanceAlgos,
    balanceMicroAlgos,
    listBalanceAssets,
  }: {
    account?: string;
    balanceAlgos?: number;
    balanceMicroAlgos?: number;
    listBalanceAssets?: BalanceAsset[];
  } = {}) {
    this.account = account;
    this.balanceAlgos = balanceAlgos;
    this.balanceMicroAlgos = balanceMicroAlgos;
    this.listBalanceAssets = listBalanceAssets;
  }

  @ApiProperty({
    example: 'XFYAYSEGQIY2J3DCGGXCPXY5FGHSVKM3V4WCNYCLKDLHB7RYDBU233QB5L',
    description: 'Consulted account',
  })
  account: string;

  @ApiProperty({ example: 2.974, description: 'Balance of Algos' })
  balanceAlgos: number;

  @ApiProperty({
    example: 2974000,
    description: 'Balance of Algos in microalgos',
  })
  balanceMicroAlgos: number;

  @ApiProperty({
    example: 'List<BalanceAsset>',
    description: 'List of balances tokens(assets) including NFT and FT',
    type: [BalanceAsset],
  })
  listBalanceAssets: BalanceAsset[];
}
