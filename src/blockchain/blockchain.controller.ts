import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  Request,
  Body,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlockchainService } from './blockchain.service';
import { AddressByIdResponse } from './models/address_by_id_response.model';
import { BalanceResponse } from './models/balance_response.model';
import { TrasnferAlgoAtoADTO } from './models/transfer_algo_a_a_dto.model';
import { TrasnferAlgoAtoIDTO } from './models/transfer_algo_a_i_dto.model';
import { TransferAlgoItoADTO } from './models/transfer_algo_i_a_dto.model';
import { TrasnferAlgoItoIDTO } from './models/transfer_algo_i_i_dto.model';
import { TransferAlgoResponse } from './models/transfer_algo_response.model';
import { createNFTByIdDTO } from './models/nft_creation_dto.model';
import { NftCreationResponse } from './models/nft_creation_response.model';

@ApiTags('Blockchain')
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('algorand/randomAccount')
  @ApiOperation({ summary: 'Get algorand random account' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getRandomAccount(@Res() response) {
    return await this.blockchainService.getRandomAccountAlgo(response);
  }

  @Get('algorand/balanceByAddress')
  @ApiOperation({
    summary: 'Get balance of an account in the Algorand blockchain',
  })
  @ApiQuery({
    name: 'account',
    required: true,
    description: 'address of the account to be consulted',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: BalanceResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAlgorandBalanceA(@Query() dataQuery: any, @Res() response) {
    return await this.blockchainService.getAlgorandBalanceA(
      dataQuery,
      response,
    );
  }

  @Get('algorand/balanceById')
  @ApiOperation({
    summary: 'Get balance of an account in the Algorand blockchain',
  })
  @ApiQuery({ name: 'id', required: true, description: 'id of user data base' })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: BalanceResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAlgorandBalanceI(@Query() dataQuery: any, @Res() response) {
    return await this.blockchainService.getAlgorandBalanceI(
      dataQuery,
      response,
    );
  }

  @Get('algorand/addressById')
  @ApiOperation({ summary: 'Get address algorand by id DB - HD Wallet' })
  @ApiQuery({ name: 'id', required: true, description: 'Id of user DB' })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: AddressByIdResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async addressAlgoById(@Query() dataQuery: any, @Res() response) {
    let index: number;
    if (!dataQuery['id']) {
      index = -1;
    } else {
      index = +dataQuery['id'];
    }
    return await this.blockchainService.addressAlgoById(index, response);
  }

  @Post('algorand/transferAlgoAtoA')
  @ApiOperation({
    summary: 'Send transfer transaction algo with mnemonic to address',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: TransferAlgoResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async transferAlgoAtoA(@Body() body: TrasnferAlgoAtoADTO, @Res() response) {
    return await this.blockchainService.transferAlgosAtoA(body, response);
  }

  @Post('algorand/transferAlgoItoI')
  @ApiOperation({
    summary: 'Send transfer transaction algo index to index user data base',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: TransferAlgoResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async transferAlgoItoI(@Body() body: TrasnferAlgoItoIDTO, @Res() response) {
    return await this.blockchainService.transferAlgosItoI(body, response);
  }

  @Post('algorand/transferAlgoAtoI')
  @ApiOperation({
    summary: 'Send transfer transaction algo with mnemonic to index',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: TransferAlgoResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async transferAlgoAtoI(@Body() body: TrasnferAlgoAtoIDTO, @Res() response) {
    return await this.blockchainService.transferAlgosAtoI(body, response);
  }

  @Post('algorand/transferAlgoItoA')
  @ApiOperation({
    summary:
      'Send transfer transaction algo with inde usar data base to address receiver',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: TransferAlgoResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async transferAlgoItoA(@Body() body: TransferAlgoItoADTO, @Res() response) {
    return await this.blockchainService.transferAlgosItoA(body, response);
  }

  //NFTs
  @Post('algorand/createNftById')
  @ApiOperation({
    summary: 'Create a nft in algorand',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: NftCreationResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createNFTById(@Body() body: createNFTByIdDTO, @Res() response) {
    return await this.blockchainService.createNFTById(body, response);
  }

  /*@Post('algorand/transferNFTAtoA')
  @ApiOperation({
    summary: 'Send transfer transaction NFT with mnemonic to address',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: TransferNFTResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async transferNFTAtoA(@Body() body: TrasnferNFTAtoADTO, @Res() response) {
    return await this.blockchainService.transferNFTAtoA(body, response);
  }

  @Post('algorand/transferNFTItoI')
  @ApiOperation({
    summary: 'Send transfer transaction NFT index to index user data base',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: TransferNFTResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async transferNFTItoI(@Body() body: TrasnferNFTItoIDTO, @Res() response) {
    return await this.blockchainService.transferNFTItoI(body, response);
  }

  @Post('algorand/transferNFToAtoI')
  @ApiOperation({
    summary: 'Send transfer transaction NFT with mnemonic to index',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: TransferNFTResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async transferNFTAtoI(@Body() body: TrasnferNFTAtoIDTO, @Res() response) {
    return await this.blockchainService.transferNFTAtoI(body, response);
  }

  @Post('algorand/transferNFTItoA')
  @ApiOperation({
    summary:
      'Send transfer transaction NFT with inde usar data base to address receiver',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: TransferNFTResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async transferNFTItoA(@Body() body: TransferNFTItoADTO, @Res() response) {
    return await this.blockchainService.transferNFTItoA(body, response);
  }

  //USDT
  @Post('algorand/transferUSDTAtoA')
  @ApiOperation({
    summary: 'Send transfer transaction USDT with mnemonic to address',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: TransferUSDTResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async transferUSDTAtoA(@Body() body: TrasnferUSDTAtoADTO, @Res() response) {
    return await this.blockchainService.transferUSDTAtoA(body, response);
  }

  @Post('algorand/transferUSDTItoI')
  @ApiOperation({
    summary: 'Send transfer transaction USDT index to index user data base',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: TransferUSDTResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async transferUSDTItoI(@Body() body: TrasnferUSDTItoIDTO, @Res() response) {
    return await this.blockchainService.transferUSDTItoI(body, response);
  }

  @Post('algorand/transferUSDToAtoI')
  @ApiOperation({
    summary: 'Send transfer transaction USDT with mnemonic to index',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: TransferUSDTResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async transferUSDTAtoI(@Body() body: TrasnferUSDTAtoIDTO, @Res() response) {
    return await this.blockchainService.transferUSDTAtoI(body, response);
  }

  @Post('algorand/transferUSDTItoA')
  @ApiOperation({
    summary:
      'Send transfer transaction USDT with inde usar data base to address receiver',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: TransferUSDTResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async transferUSDTItoA(@Body() body: TransferUSDTItoADTO, @Res() response) {
    return await this.blockchainService.transferUSDTItoA(body, response);
  }

  //SLVA
  @Post('algorand/transferSLVAAtoA')
  @ApiOperation({
    summary: 'Send transfer transaction SLVA with mnemonic to address',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: TransferSLVAResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async transferSLVAAtoA(@Body() body: TrasnferSLVAAtoADTO, @Res() response) {
    return await this.blockchainService.transferSLVAAtoA(body, response);
  }

  @Post('algorand/transferSLVAItoI')
  @ApiOperation({
    summary: 'Send transfer transaction SLVA index to index user data base',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: TransferSLVAResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async transferSLVAItoI(@Body() body: TrasnferSLVAItoIDTO, @Res() response) {
    return await this.blockchainService.transferSLVAItoI(body, response);
  }

  @Post('algorand/transferSLVAoAtoI')
  @ApiOperation({
    summary: 'Send transfer transaction SLVA with mnemonic to index',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: TransferSLVAResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async transferSLVAAtoI(@Body() body: TrasnferSLVAAtoIDTO, @Res() response) {
    return await this.blockchainService.transferSLVAAtoI(body, response);
  }

  @Post('algorand/transferSLVAItoA')
  @ApiOperation({
    summary:
      'Send transfer transaction SLVA with inde usar data base to address receiver',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: TransferSLVAResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async transferSLVAItoA(@Body() body: TransferSLVAItoADTO, @Res() response) {
    return await this.blockchainService.transferSLVAItoA(body, response);
  }*/
}
