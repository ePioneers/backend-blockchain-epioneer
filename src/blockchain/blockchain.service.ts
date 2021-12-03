import { Injectable } from '@nestjs/common';
import * as algosdk from 'algosdk';
import AlgodClient from 'algosdk/dist/types/src/client/v2/algod/algod';
import { ErrorResponse } from 'src/models/error_response.model';
import { Balance } from './models/balance.model';
import { BalanceAsset } from './models/balance_asset.model';
import { BalanceResponse } from './models/balance_response.model';

@Injectable()
export class BlockchainService {

    async getAlgorandBalance(dataQuery:{}, response){
        let respPro: BalanceResponse;
        if(!dataQuery){
            respPro= new BalanceResponse(
                {
                    success:false, 
                    error: true, 
                    errorData: new ErrorResponse({
                        errorCode:0, 
                        errorMsg:"No se envió cuenta para verificar el balance, por favor enviar cuenta.", 
                        errorData:"Missing query: account"
                    }
                )});
            return response.status(200).json(respPro);
        }else if(!dataQuery['account']){
            respPro= new BalanceResponse(
                {
                    success:false,
                    error: true, 
                    errorData: new ErrorResponse({
                        errorCode:0, 
                        errorMsg:"No se envió cuenta para verificar el balance, por favor enviar cuenta.", 
                        errorData:"Missing query: account"
                    }
                )});
            return response.status(200).json(respPro);
        }

        try{
            const clientAlgorand: AlgodClient = this.getClientAlgorand();
            let accountUser:string = dataQuery["account"];
            let accountInfo:Record<string,any> = (await clientAlgorand.accountInformation(accountUser).do());
            let balanceAssetsResp: BalanceAsset[] = [];
            for (var itemBalanceAsset of accountInfo.assets) {
                balanceAssetsResp.push(new BalanceAsset({
                    assetId:itemBalanceAsset["asset-id"],
                    balance:itemBalanceAsset["amount"], 
                    creator:itemBalanceAsset["creator"], 
                    isFrozen:itemBalanceAsset["is-frozen"]
                }));
            }
            respPro= new BalanceResponse(
                {
                    success:true,
                    error: false, 
                    responseData: new Balance({
                        account: accountInfo.address,
                        balanceAlgos: algosdk.microalgosToAlgos(accountInfo.amount),
                        balanceMicroAlgos: accountInfo.amount,
                        listBalanceAssets: balanceAssetsResp
                    })
                });
            return response.status(200).json(respPro);
        }catch(e){
            respPro= new BalanceResponse(
                {
                    success:false,
                    error: true, 
                    errorData: new ErrorResponse({
                        errorCode:9, 
                        errorMsg:"Ocurrió un error en el servidor, comuniquese con soporte.", 
                        errorData:e
                    }
                )});
            console.log(e);
            return response.status(500).json(respPro);
        }
    }

    getClientAlgorand(): AlgodClient{
        const port:string = '';
        const token = {
            'x-api-Key': process.env.X_API_KEY_ALGO
        }
        const algodclient:AlgodClient = new algosdk.Algodv2(
            token, 
            process.env.TESTNET_ALGO==='true'? process.env.TESTNET_NODE_ALGO:process.env.MAINNET_NODE_ALGO, 
            port);
        return algodclient;
    }
}
