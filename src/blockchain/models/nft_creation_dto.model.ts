import { ApiProperty } from '@nestjs/swagger';

export class createNFTByIdDTO {
  @ApiProperty({
    example: 1,
    description: 'ID of user to create NFT',
  })
  idOwner: number;
  @ApiProperty({
    example: 5,
    description: 'ID of NFT in Database',
  })
  idNFTDB: number;
  @ApiProperty({
    example: 'Leopard',
    description: 'The name or title of NFT',
  })
  nameNFT: string;
  @ApiProperty({
    example: 'This NFT is the best option to conserv the forest',
    description: 'Description of NFT',
  })
  description?: string;
  @ApiProperty({
    example: 'https://s3.aws.com/files?nft=dsv31dv3d1',
    description: 'url of asset image',
  })
  ulrAssetPreview: string;
  @ApiProperty({
    example: 'image/png',
    description: 'The mime-type of the asset preview',
  })
  mimeAssetPreview: string;
  @ApiProperty({
    example: 'https://s3.aws.com/files?nft=dsv31dv3d1',
    description: 'url of asset animated (gif, video, sound)',
  })
  ulrAssetAnimated?: string;
  @ApiProperty({
    example: 'image/gif',
    description: 'The mime-type of the asset animated',
  })
  mimeAssetAnimated?: string;
}
