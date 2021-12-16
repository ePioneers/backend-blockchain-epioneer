import { Controller, Get, Post, Query, Res, Request, Body} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlockchainService } from './blockchain.service';
import { AddressByIdResponse } from './models/address_by_id_response.model';
import { BalanceResponse } from './models/balance_response.model';
import { TrasnferAlgoAtoADTO } from './models/transfer_algo_a_a_dto.model';
import { TrasnferAlgoAtoIDTO } from './models/transfer_algo_a_i_dto.model';
import { TransferAlgoItoADTO } from './models/transfer_algo_i_a_dto.model';
import { TrasnferAlgoItoIDTO } from './models/transfer_algo_i_i_dto.model';
import { TransferAlgoResponse } from './models/transfer_algo_response.model';

@ApiTags('Blockchain')
@Controller('blockchain')
export class BlockchainController {
    constructor(private readonly blockchainService: BlockchainService) {}

    @Get('algorand/randomAccount')
    @ApiOperation({ summary: 'Get algorand random account' })
    @ApiResponse({ status: 200, description: 'Successful'})
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getRandomAccount(@Res() response) {
        return await this.blockchainService.getRandomAccountAlgo(response);
    }

    @Get('algorand/balanceByAddress')
    @ApiOperation({ summary: 'Get balance of an account in the Algorand blockchain' })
    @ApiQuery({name: 'account', required: true, description: 'address of the account to be consulted'})
    @ApiResponse({ status: 200, description: 'Successful', type: BalanceResponse })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getAlgorandBalanceA(@Query() dataQuery: any,@Res() response) {
        return await this.blockchainService.getAlgorandBalanceA(dataQuery, response);
    }

    @Get('algorand/balanceById')
    @ApiOperation({ summary: 'Get balance of an account in the Algorand blockchain' })
    @ApiQuery({name: 'id', required: true, description: 'id of user data base'})
    @ApiResponse({ status: 200, description: 'Successful', type: BalanceResponse })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getAlgorandBalanceI(@Query() dataQuery: any,@Res() response) {
        return await this.blockchainService.getAlgorandBalanceI(dataQuery, response);
    }

    @Get('algorand/addressById')
    @ApiOperation({ summary: 'Get address algorand by id DB - HD Wallet' })
    @ApiQuery({name: 'id', required: true, description: 'Id of user DB'})
    @ApiResponse({ status: 200, description: 'Successful', type: AddressByIdResponse })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async addressAlgoById(@Query() dataQuery: any, @Res() response) {
        let index:number;
        if(!dataQuery['id']){
            index=-1;
        }else{
            index=+dataQuery['id'];
        }
        return await this.blockchainService.addressAlgoById(index, response);
    }

    @Post('algorand/transferAlgoAtoA')
    @ApiOperation({ summary: 'Send transfer transaction algo with mnemonic to address' })
    @ApiResponse({ status: 200, description: 'Successful', type: TransferAlgoResponse })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async transferAlgoAtoA(@Body() body: TrasnferAlgoAtoADTO, @Res() response) {
        return await this.blockchainService.transferAlgosAtoA(body, response);
    }

    @Post('algorand/transferAlgoItoI')
    @ApiOperation({ summary: 'Send transfer transaction algo index to index user data base' })
    @ApiResponse({ status: 200, description: 'Successful', type: TransferAlgoResponse })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async transferAlgoItoI(@Body() body: TrasnferAlgoItoIDTO, @Res() response) {
        return await this.blockchainService.transferAlgosItoI(body, response);
    }

    @Post('algorand/transferAlgoAtoI')
    @ApiOperation({ summary: 'Send transfer transaction algo with mnemonic to index' })
    @ApiResponse({ status: 200, description: 'Successful', type: TransferAlgoResponse })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async transferAlgoAtoI(@Body() body: TrasnferAlgoAtoIDTO, @Res() response) {
        return await this.blockchainService.transferAlgosAtoI(body, response);
    }

    @Post('algorand/transferAlgoItoA')
    @ApiOperation({ summary: 'Send transfer transaction algo with inde usar data base to address receiver' })
    @ApiResponse({ status: 200, description: 'Successful', type: TransferAlgoResponse })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async transferAlgoItoA(@Body() body: TransferAlgoItoADTO, @Res() response) {
        return await this.blockchainService.transferAlgosItoA(body, response);
    } 

    @Post('algorand/createNftById')
    @ApiOperation({ summary: 'Send transfer transaction algo with inde usar data base to address receiver' })
    @ApiResponse({ status: 200, description: 'Successful', type: TransferAlgoResponse })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async transferAlgo(@Body() body: TransferAlgoItoADTO, @Res() response) {
        return await this.blockchainService.transferAlgosItoA(body, response);
    } 

}
