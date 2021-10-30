import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponse } from 'src/models/error_response.model';
import { BlockchainService } from './blockchain.service';
import { BalanceResponse } from './models/balance_response.model';

@ApiTags('Blockchain')
@Controller('blockchain')
export class BlockchainController {
    constructor(private readonly blockchainService: BlockchainService) {}

    @Get('es/algorand/balance')
    @ApiOperation({ summary: 'Get balance of an account in the Algorand blockchain' })
    @ApiQuery({name: 'account', required: true, description: 'address of the account to be consulted'})
    @ApiResponse({ status: 200, description: 'Successful', type: BalanceResponse })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getAlgorandBalance(@Query() dataQuery: any,@Res() response) {
        return await this.blockchainService.getAlgorandBalance(dataQuery, response);
    }

}
