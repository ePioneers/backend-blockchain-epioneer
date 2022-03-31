import { Injectable } from '@nestjs/common';
import * as algosdk from 'algosdk';
import AlgodClient from 'algosdk/dist/types/src/client/v2/algod/algod';
import { AppService } from 'src/app.service';
import { ErrorResponse } from 'src/models/error_response.model';
import { AddressByIdResponse } from './models/address_by_id_response.model';
import { Balance } from './models/balance.model';
import { BalanceAsset } from './models/balance_asset.model';
import { BalanceResponse } from './models/balance_response.model';
import { TransferAlgoResponse } from './models/transfer_algo_response.model';

@Injectable()
export class BlockchainService {
  constructor(private readonly appService: AppService) {}

  async getAlgorandBalanceA(dataQuery: Record<string, unknown>, response) {
    let respPro: BalanceResponse;
    if (!dataQuery) {
      respPro = new BalanceResponse({
        success: false,
        error: true,
        errorData: new ErrorResponse({
          errorCode: 0,
          errorMsg:
            'No se envió cuenta para verificar el balance, por favor enviar cuenta.',
          errorData: 'Missing query: account',
        }),
      });
      return response.status(200).json(respPro);
    } else if (!dataQuery['account']) {
      respPro = new BalanceResponse({
        success: false,
        error: true,
        errorData: new ErrorResponse({
          errorCode: 0,
          errorMsg:
            'No se envió cuenta para verificar el balance, por favor enviar cuenta.',
          errorData: 'Missing query: account',
        }),
      });
      return response.status(200).json(respPro);
    }

    try {
      const clientAlgorand: AlgodClient = this.getClientAlgorand();
      const accountUser: string = dataQuery['account'].toString();
      const accountInfo: Record<string, any> = await clientAlgorand
        .accountInformation(accountUser)
        .do();
      const balanceAssetsResp: BalanceAsset[] = [];
      for (const itemBalanceAsset of accountInfo.assets) {
        balanceAssetsResp.push(
          new BalanceAsset({
            assetId: itemBalanceAsset['asset-id'],
            balance: itemBalanceAsset['amount'],
            creator: itemBalanceAsset['creator'],
            isFrozen: itemBalanceAsset['is-frozen'],
          }),
        );
      }
      respPro = new BalanceResponse({
        success: true,
        error: false,
        responseData: new Balance({
          account: accountInfo.address,
          balanceAlgos: algosdk.microalgosToAlgos(accountInfo.amount),
          balanceMicroAlgos: accountInfo.amount,
          listBalanceAssets: balanceAssetsResp,
        }),
      });
      return response.status(200).json(respPro);
    } catch (e) {
      respPro = new BalanceResponse({
        success: false,
        error: true,
        errorData: new ErrorResponse({
          errorCode: 9,
          errorMsg: 'Ocurrió un error en el servidor, comuniquese con soporte.',
          errorData: e,
        }),
      });
      console.log(e);
      return response.status(500).json(respPro);
    }
  }

  async getAlgorandBalanceI(dataQuery: Record<string, unknown>, response) {
    let respPro: BalanceResponse;
    if (!dataQuery) {
      respPro = new BalanceResponse({
        success: false,
        error: true,
        errorData: new ErrorResponse({
          errorCode: 0,
          errorMsg:
            'No se envió cuenta para verificar el balance, por favor enviar cuenta.',
          errorData: 'Missing query: id',
        }),
      });
      return response.status(200).json(respPro);
    } else if (!dataQuery['id']) {
      respPro = new BalanceResponse({
        success: false,
        error: true,
        errorData: new ErrorResponse({
          errorCode: 0,
          errorMsg:
            'No se envió cuenta para verificar el balance, por favor enviar cuenta.',
          errorData: 'Missing query: id',
        }),
      });
      return response.status(200).json(respPro);
    }

    try {
      const clientAlgorand: AlgodClient = this.getClientAlgorand();
      const indexIdUser = +dataQuery['id'];
      const accountRaw: Record<string, unknown> =
        await this.appService.getAccountByIndexDB(indexIdUser);
      if (accountRaw === {}) {
        throw new Error('Account not recupered');
      }
      const accountUser: string = accountRaw['address'].toString();

      const accountInfo: Record<string, any> = await clientAlgorand
        .accountInformation(accountUser)
        .do();
      const balanceAssetsResp: BalanceAsset[] = [];
      for (const itemBalanceAsset of accountInfo.assets) {
        balanceAssetsResp.push(
          new BalanceAsset({
            assetId: itemBalanceAsset['asset-id'],
            balance: itemBalanceAsset['amount'],
            creator: itemBalanceAsset['creator'],
            isFrozen: itemBalanceAsset['is-frozen'],
          }),
        );
      }
      respPro = new BalanceResponse({
        success: true,
        error: false,
        responseData: new Balance({
          account: accountInfo.address,
          balanceAlgos: algosdk.microalgosToAlgos(accountInfo.amount),
          balanceMicroAlgos: accountInfo.amount,
          listBalanceAssets: balanceAssetsResp,
        }),
      });
      return response.status(200).json(respPro);
    } catch (e) {
      respPro = new BalanceResponse({
        success: false,
        error: true,
        errorData: new ErrorResponse({
          errorCode: 9,
          errorMsg: 'Ocurrió un error en el servidor, comuniquese con soporte.',
          errorData: e,
        }),
      });
      console.log(e);
      return response.status(500).json(respPro);
    }
  }

  async addressAlgoById(index: number, response) {
    try {
      if (index < 0) {
        return response.status(500).json(this.errorgetAddressAlgo({}));
      }
      const account: Record<string, unknown> =
        await this.appService.getAccountByIndexDB(index);
      if (account === {}) {
        return response.status(500).json(this.errorgetAddressAlgo({}));
      } else {
        const respPro = new AddressByIdResponse();
        respPro.success = true;
        respPro.title = 'Address Get OK';
        respPro.successMessage = 'Account has ben recupered';
        respPro.responseData = {
          address: account['address'],
          index: account['index'],
        };
        return response.status(200).json(respPro);
      }
    } catch (e) {
      return response.status(500).json(this.errorgetAddressAlgo(e));
    }
  }

  async getRandomAccountAlgo(response) {
    try {
      const account: Record<string, unknown> =
        await this.appService.getRandomAccount();
      if (account === {}) {
        return response.status(500).json(this.errorgetAddressAlgo({}));
      } else {
        const respPro = new AddressByIdResponse();
        respPro.success = true;
        respPro.title = 'Account Get OK';
        respPro.successMessage = 'Account has created';
        respPro.responseData = account;
        return response.status(200).json(respPro);
      }
    } catch (e) {
      return response.status(500).json(this.errorgetAddressAlgo(e));
    }
  }

  async transferAlgosAtoA(body, response) {
    try {
      if (
        body === null ||
        body['addressTo'] === undefined ||
        body['secretFrom'] === undefined ||
        body['amount'] === undefined
      ) {
        return response
          .status(400)
          .json(this.errorTransferAlgo({ error: 'body data not completed' }));
      }
      //client algorand
      const clientAlgorand: AlgodClient = this.getClientAlgorand();
      //get account
      const myAccount: algosdk.Account =
        await this.appService.getAccountbyMnemonic(body['secretFrom']);
      //Check balance to tranfer
      const accountInfo = await clientAlgorand
        .accountInformation(myAccount.addr)
        .do();
      if (
        algosdk.microalgosToAlgos(accountInfo.amount) < 0.001 ||
        algosdk.microalgosToAlgos(accountInfo.amount) <
          +(body['amount'] + 0.001)
      ) {
        return response.status(400).json(
          this.errorTransferAlgo({
            error: 'you do not have sufficient balance for this transaction',
          }),
        );
      }

      //transfer
      // Construct the transaction
      const params = await clientAlgorand.getTransactionParams().do();
      const receiver = body['addressTo'];
      const enc = new TextEncoder();
      const note = enc.encode(body['msg'] || '');
      const amount = algosdk.algosToMicroalgos(+body['amount']);
      const sender = myAccount.addr;
      const txn = algosdk.makePaymentTxnWithSuggestedParams(
        sender,
        receiver,
        amount,
        undefined,
        note,
        params,
      );

      // Sign the transaction
      const signedTxn = txn.signTxn(myAccount.sk);
      const txId = txn.txID().toString();

      // Submit the transaction
      await clientAlgorand.sendRawTransaction(signedTxn).do();

      // Wait for confirmation
      const confirmedTxn = await this.waitForConfirmation(
        clientAlgorand,
        txId,
        4,
      );
      //Get the completed Transaction
      const mytxinfo = confirmedTxn.txn.txn;
      const respOk = new TransferAlgoResponse();
      respOk.success = true;
      respOk.title = 'Transfer completed';
      respOk.successMessage = 'The transfer is complete';
      respOk.responseData = { txId: txId, txDetail: mytxinfo };
      return response.status(200).json(respOk);
    } catch (e) {
      return response.status(500).json(this.errorTransferAlgo(e));
    }
  }

  async transferAlgosItoI(body, response) {
    try {
      if (
        body === null ||
        body['indexTo'] === undefined ||
        body['indexFrom'] === undefined ||
        body['amount'] === undefined
      ) {
        return response
          .status(400)
          .json(this.errorTransferAlgo({ error: 'body data not completed' }));
      }
      //client algorand
      const clientAlgorand: AlgodClient = this.getClientAlgorand();
      //get account
      const account: Record<string, unknown> =
        await this.appService.getAccountByIndexDB(body['indexFrom']);
      const myAccount: algosdk.Account =
        await this.appService.getAccountbyMnemonic(
          account['mnemonic'].toString(),
        );
      //Check balance to tranfer
      const accountInfo = await clientAlgorand
        .accountInformation(myAccount.addr)
        .do();
      if (
        algosdk.microalgosToAlgos(accountInfo.amount) < 0.001 ||
        algosdk.microalgosToAlgos(accountInfo.amount) <
          +(body['amount'] + 0.001)
      ) {
        return response.status(400).json(
          this.errorTransferAlgo({
            error: 'you do not have sufficient balance for this transaction',
          }),
        );
      }

      //transfer
      // Construct the transaction
      const params = await clientAlgorand.getTransactionParams().do();
      const accountReceiver: Record<string, unknown> =
        await this.appService.getAccountByIndexDB(body['indexTo']);
      const receiver: string = accountReceiver['address'].toString();
      const enc = new TextEncoder();
      const note = enc.encode(body['msg'] || '');
      const amount = algosdk.algosToMicroalgos(+body['amount']);
      const sender = myAccount.addr;
      const txn = algosdk.makePaymentTxnWithSuggestedParams(
        sender,
        receiver,
        amount,
        undefined,
        note,
        params,
      );

      // Sign the transaction
      const signedTxn = txn.signTxn(myAccount.sk);
      const txId = txn.txID().toString();

      // Submit the transaction
      await clientAlgorand.sendRawTransaction(signedTxn).do();

      // Wait for confirmation
      const confirmedTxn = await this.waitForConfirmation(
        clientAlgorand,
        txId,
        4,
      );
      //Get the completed Transaction
      const mytxinfo = confirmedTxn.txn.txn;
      const respOk = new TransferAlgoResponse();
      respOk.success = true;
      respOk.title = 'Transfer completed';
      respOk.successMessage = 'The transfer is complete';
      respOk.responseData = { txId: txId, txDetail: mytxinfo };
      return response.status(200).json(respOk);
    } catch (e) {
      return response.status(500).json(this.errorTransferAlgo(e));
    }
  }

  async transferAlgosAtoI(body, response) {
    try {
      if (
        body === null ||
        body['indexTo'] === undefined ||
        body['secretFrom'] === undefined ||
        body['amount'] === undefined
      ) {
        return response
          .status(400)
          .json(this.errorTransferAlgo({ error: 'body data not completed' }));
      }
      //client algorand
      const clientAlgorand: AlgodClient = this.getClientAlgorand();
      //get account
      const myAccount: algosdk.Account =
        await this.appService.getAccountbyMnemonic(body['secretFrom']);
      //Check balance to tranfer
      const accountInfo = await clientAlgorand
        .accountInformation(myAccount.addr)
        .do();
      if (
        algosdk.microalgosToAlgos(accountInfo.amount) < 0.001 ||
        algosdk.microalgosToAlgos(accountInfo.amount) <
          +(body['amount'] + 0.001)
      ) {
        return response.status(400).json(
          this.errorTransferAlgo({
            error: 'you do not have sufficient balance for this transaction',
          }),
        );
      }

      //transfer
      // Construct the transaction
      const params = await clientAlgorand.getTransactionParams().do();
      const accountReceiver: Record<string, unknown> =
        await this.appService.getAccountByIndexDB(body['indexTo']);
      const receiver: string = accountReceiver['address'].toString();
      const enc = new TextEncoder();
      const note = enc.encode(body['msg'] || '');
      const amount = algosdk.algosToMicroalgos(+body['amount']);
      const sender = myAccount.addr;
      const txn = algosdk.makePaymentTxnWithSuggestedParams(
        sender,
        receiver,
        amount,
        undefined,
        note,
        params,
      );

      // Sign the transaction
      const signedTxn = txn.signTxn(myAccount.sk);
      const txId = txn.txID().toString();

      // Submit the transaction
      await clientAlgorand.sendRawTransaction(signedTxn).do();

      // Wait for confirmation
      const confirmedTxn = await this.waitForConfirmation(
        clientAlgorand,
        txId,
        4,
      );
      //Get the completed Transaction
      const mytxinfo = confirmedTxn.txn.txn;
      const respOk = new TransferAlgoResponse();
      respOk.success = true;
      respOk.title = 'Transfer completed';
      respOk.successMessage = 'The transfer is complete';
      respOk.responseData = { txId: txId, txDetail: mytxinfo };
      return response.status(200).json(respOk);
    } catch (e) {
      return response.status(500).json(this.errorTransferAlgo(e));
    }
  }

  async transferAlgosItoA(body, response) {
    try {
      if (
        body === null ||
        body['addressTo'] === undefined ||
        body['indexFrom'] === undefined ||
        body['amount'] === undefined
      ) {
        return response
          .status(400)
          .json(this.errorTransferAlgo({ error: 'body data not completed' }));
      }
      //client algorand
      const clientAlgorand: AlgodClient = this.getClientAlgorand();
      //get account
      const account: Record<string, unknown> =
        await this.appService.getAccountByIndexDB(body['indexFrom']);
      const myAccount: algosdk.Account =
        await this.appService.getAccountbyMnemonic(
          account['mnemonic'].toString(),
        );
      //Check balance to tranfer
      const accountInfo = await clientAlgorand
        .accountInformation(myAccount.addr)
        .do();
      if (
        algosdk.microalgosToAlgos(accountInfo.amount) < 0.001 ||
        algosdk.microalgosToAlgos(accountInfo.amount) <
          +(body['amount'] + 0.001)
      ) {
        return response.status(400).json(
          this.errorTransferAlgo({
            error: 'you do not have sufficient balance for this transaction',
          }),
        );
      }

      //transfer
      // Construct the transaction
      const params = await clientAlgorand.getTransactionParams().do();

      const receiver = body['addressTo'];
      const enc = new TextEncoder();
      const note = enc.encode(body['msg'] || '');
      const amount = algosdk.algosToMicroalgos(+body['amount']);
      const sender = myAccount.addr;
      const txn = algosdk.makePaymentTxnWithSuggestedParams(
        sender,
        receiver,
        amount,
        undefined,
        note,
        params,
      );

      // Sign the transaction
      const signedTxn = txn.signTxn(myAccount.sk);
      const txId = txn.txID().toString();

      // Submit the transaction
      await clientAlgorand.sendRawTransaction(signedTxn).do();

      // Wait for confirmation
      const confirmedTxn = await this.waitForConfirmation(
        clientAlgorand,
        txId,
        4,
      );
      //Get the completed Transaction
      const mytxinfo = confirmedTxn.txn.txn;
      const respOk = new TransferAlgoResponse();
      respOk.success = true;
      respOk.title = 'Transfer completed';
      respOk.successMessage = 'The transfer is complete';
      respOk.responseData = { txId: txId, txDetail: mytxinfo };
      return response.status(200).json(respOk);
    } catch (e) {
      return response.status(500).json(this.errorTransferAlgo(e));
    }
  }

  async waitForConfirmation(algodClient, txId, timeout): Promise<any> {
    if (algodClient == null || txId == null || timeout < 0) {
      throw new Error('Bad arguments');
    }

    const status = await algodClient.status().do();
    if (status === undefined) {
      throw new Error('Unable to get node status');
    }

    const startround = status['last-round'] + 1;
    let currentround = startround;

    while (currentround < startround + timeout) {
      const pendingInfo = await algodClient
        .pendingTransactionInformation(txId)
        .do();
      if (pendingInfo !== undefined) {
        if (
          pendingInfo['confirmed-round'] !== null &&
          pendingInfo['confirmed-round'] > 0
        ) {
          //Got the completed Transaction
          return pendingInfo;
        } else {
          if (
            pendingInfo['pool-error'] != null &&
            pendingInfo['pool-error'].length > 0
          ) {
            // If there was a pool error, then the transaction has been rejected!
            throw new Error(
              'Transaction ' +
                txId +
                ' rejected - pool error: ' +
                pendingInfo['pool-error'],
            );
          }
        }
      }
      await algodClient.statusAfterBlock(currentround).do();
      currentround++;
    }
    throw new Error(
      'Transaction ' + txId + ' not confirmed after ' + timeout + ' rounds!',
    );
  }

  errorgetAddressAlgo(err) {
    const respPro = new TransferAlgoResponse();
    respPro.success = false;
    respPro.title = 'Ups address not recupered';
    respPro.errorData = new ErrorResponse({
      errorCode: 1,
      errorMsg: 'Error in load address by id',
      errorData: err,
    });
    return respPro;
  }

  errorTransferAlgo(err) {
    const respPro = new TransferAlgoResponse();
    respPro.success = false;
    respPro.title = 'Ups transfer not completed';
    respPro.errorData = new ErrorResponse({
      errorCode: 1,
      errorMsg: 'Error in transfer',
      errorData: err,
    });
    return respPro;
  }

  getClientAlgorand(): AlgodClient {
    const port = '';
    const token = {
      'x-api-Key': process.env.X_API_KEY_ALGO,
    };
    const algodclient: AlgodClient = new algosdk.Algodv2(
      token,
      process.env.TESTNET_ALGO === 'true'
        ? process.env.TESTNET_NODE_ALGO
        : process.env.MAINNET_NODE_ALGO,
      port,
    );
    return algodclient;
  }
}
