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
import { createHash } from 'crypto';
import { NftCreationResponse } from './models/nft_creation_response.model';
import { TransferTokenResponse } from './models/transfer_token_response.model';
import { PrincipalTokensIdsResponse } from './models/principal_tokens_ids_response.model';
import {
  Configuration,
  AccountsApi,
  FaucetsApi,
  TransactionsApi,
} from '@stacks/blockchain-api-client';
import { fetch } from 'cross-fetch';
import {
  makeRandomPrivKey,
  privateKeyToString,
  getAddressFromPrivateKey,
  TransactionVersion,
  createStacksPrivateKey,
  makeSTXTokenTransfer,
  broadcastTransaction,
  AnchorMode,
  SignedTokenTransferOptions,
} from '@stacks/transactions';
import { StacksBalanceResponse } from './models/stacks_balance_response.model';
import { StacksBalance } from './models/stacks_balance.model';
import * as bip39 from 'bip39';
import * as bitcoin from 'bitcoinjs-lib';
import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { TransferSTXResponse } from './models/transfer_stx_response.model';
import { StacksStatusTransactionResponse } from './models/stacks_status_transaction_response.model';

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
            balanceCompact: await this.microAmountToCompactAmountLocal(
              itemBalanceAsset['amount'],
              itemBalanceAsset['asset-id'],
            ),
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

  async getAlgorandInfoToken(dataQuery: Record<string, unknown>, response) {
    let respPro: BalanceResponse;
    if (!dataQuery) {
      respPro = new BalanceResponse({
        success: false,
        error: true,
        errorData: new ErrorResponse({
          errorCode: 0,
          errorMsg:
            'No se envió id para verificar el token, por favor enviar id token.',
          errorData: 'Missing query: id',
        }),
      });
      return response.status(400).json(respPro);
    } else if (!dataQuery['id']) {
      respPro = new BalanceResponse({
        success: false,
        error: true,
        errorData: new ErrorResponse({
          errorCode: 0,
          errorMsg:
            'No se envió id para verificar el token, por favor enviar id token.',
          errorData: 'Missing query: id',
        }),
      });
      return response.status(400).json(respPro);
    }

    try {
      const resultAsset = await this.getAssetInfo(+dataQuery['id']);
      return response.status(200).json({ data: resultAsset });
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

  async getPrincipalTokensIds(response) {
    try {
      const respPro = new PrincipalTokensIdsResponse();
      respPro.success = true;
      respPro.title = 'Tokens ID Get OK';
      respPro.successMessage = 'Tokens ok';
      respPro.responseData = {
        usdt:
          process.env.TESTNET_ALGO === 'true'
            ? process.env.TEST_ID_USDT
            : process.env.ID_USDT,
        slva:
          process.env.TESTNET_ALGO === 'true'
            ? process.env.TEST_ID_SLVA
            : process.env.ID_SLVA,
      };
      return response.status(200).json(respPro);
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
      if (algosdk.microalgosToAlgos(accountInfo.amount) < +body['amount']) {
        return response.status(400).json(
          this.errorTransferAlgo({
            error: 'you do not have sufficient balance for this transaction',
          }),
        );
      }

      //Load algos to transfer
      if ((await this.loadAlgosToTransfer(myAccount.addr)) === 'error') {
        return response
          .status(400)
          .json(
            this.errorTransferToken({ error: 'Fail load algos to transfer' }),
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

  //NFT
  async createNFTById(body, response) {
    try {
      if (
        body === null ||
        body['idOwner'] === undefined ||
        body['nameNFT'] === undefined ||
        body['ulrAssetPreview'] === undefined ||
        body['mimeAssetPreview'] === undefined ||
        body['idNFTDB'] === undefined
      ) {
        return response
          .status(400)
          .json(this.errorNFTAlgo({ error: 'body data not completed' }));
      }
      //client algorand
      const clientAlgorand: AlgodClient = this.getClientAlgorand();
      //get account
      const account: Record<string, unknown> =
        await this.appService.getAccountByIndexDB(body['idOwner']);
      const myAccount: algosdk.Account =
        await this.appService.getAccountbyMnemonic(
          account['mnemonic'].toString(),
        );
      //Check balance to tranfer
      const accountInfo = await clientAlgorand
        .accountInformation(myAccount.addr)
        .do();
      const resultLoadAlgo: string = await this.loadAlgosToCreateNFT(
        accountInfo,
      );
      if (resultLoadAlgo === 'error') {
        return response.status(400).json(
          this.errorNFTAlgo({
            error: 'error loading algos from hotwallet',
          }),
        );
      }
      //Create file JSON to metadata NFT
      const jsonMetadata = {
        name: body['nameNFT'],
        description: body['description'],
        image: body['ulrAssetPreview'],
        image_mimetype: body['mimeAssetPreview'],
        external_url: process.env.HOST_EPIONEER,
        animation_url: body['ulrAssetAnimated'],
        animation_url_mimetype: body['mimeAssetAnimated'],
      };
      //Upload the json metadata to AWS S3
      const urlMetadata: string = await this.appService.createFileJsonNFT(
        jsonMetadata,
        body['idNFTDB'],
      );
      if (urlMetadata == 'error') {
        return response.status(400).json(
          this.errorNFTAlgo({
            error: 'The Json metadata of NFT not have upload to AWS S3',
          }),
        );
      }
      //Sha256 of metadata NFT
      const md5Metadata = createHash('md5')
        .update(JSON.stringify(jsonMetadata))
        .digest('hex');
      //Create NFT
      const params = await clientAlgorand.getTransactionParams().do();
      const note = undefined;
      const addr = myAccount.addr;
      const defaultFrozen = false;
      const decimals = 0;
      const totalIssuance = 1;
      const unitName = 'EPIO' + body['idNFTDB'];
      const assetName = body['nameNFT'];
      const assetURL = urlMetadata;
      const assetMetadataHash = md5Metadata;
      const manager = undefined;
      const reserve = undefined;
      const freeze = undefined;
      const clawback = undefined;

      // signing and sending "txn" allows "addr" to create an asset
      const txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
        addr,
        note,
        totalIssuance,
        decimals,
        defaultFrozen,
        manager,
        reserve,
        freeze,
        clawback,
        unitName,
        assetName,
        assetURL,
        assetMetadataHash,
        params,
      );
      // Sign the transaction
      const rawSignedTxn = txn.signTxn(myAccount.sk);
      const txId = txn.txID().toString();
      await clientAlgorand.sendRawTransaction(rawSignedTxn).do();
      let assetID = null;
      // wait for transaction to be confirmed
      const ptx = await this.waitForConfirmation(clientAlgorand, txId, 4);
      // Get the new asset's information from the creator account
      assetID = ptx['asset-index'];
      //Get the completed Transaction
      const respOk = new NftCreationResponse();
      respOk.success = true;
      respOk.title = 'NFT creation completed';
      respOk.successMessage = 'The NFT is succesfull complete';
      respOk.responseData = { txId: txId, assetIDAlgorand: assetID };
      return response.status(200).json(respOk);
    } catch (e) {
      return response.status(400).json(
        this.errorNFTAlgo({
          error: 'Creation NFT not completed: \n' + e,
        }),
      );
    }
  }

  //Transfer tokens and opt-in
  async transferTokenAtoA(body, response) {
    try {
      if (
        body === null ||
        body['secretTo'] === undefined ||
        body['secretFrom'] === undefined ||
        body['assetID'] === undefined ||
        body['amount'] === undefined
      ) {
        return response
          .status(400)
          .json(this.errorTransferToken({ error: 'body data not completed' }));
      }
      //client algorand
      const clientAlgorand: AlgodClient = this.getClientAlgorand();
      //get account
      const myAccount: algosdk.Account =
        await this.appService.getAccountbyMnemonic(body['secretFrom']);
      const accountInfo = await clientAlgorand
        .accountInformation(myAccount.addr)
        .do();
      const accountTo: algosdk.Account =
        await this.appService.getAccountbyMnemonic(body['secretTo']);
      const accountInfoReceiver = await clientAlgorand
        .accountInformation(accountTo.addr)
        .do();
      //Load algos to optin and transfer
      if (
        (await this.loadAlgosToOptIn(accountInfoReceiver, body['assetID'])) ===
        'error'
      ) {
        return response
          .status(400)
          .json(this.errorTransferToken({ error: 'Fail opt-in load algos' }));
      }
      if ((await this.optIn(body['secretTo'], body['assetID'])) === 'error') {
        return response
          .status(400)
          .json(this.errorTransferToken({ error: 'Fail opt-in tx' }));
      }
      if ((await this.loadAlgosToTransfer(myAccount.addr)) === 'error') {
        return response
          .status(400)
          .json(
            this.errorTransferToken({ error: 'Fail load algos to transfer' }),
          );
      }

      // Transfer
      // Construct the transaction
      const params = await clientAlgorand.getTransactionParams().do();
      const receiver = accountTo.addr;
      const enc = new TextEncoder();
      const note = enc.encode(body['msg'] || '');
      //load decimals of asset
      const decimalAmount = await this.compactAmountToMicroAmount(
        body['amount'],
        body['assetID'],
      );
      const amount = decimalAmount;
      const sender = myAccount.addr;
      const revocationTarget = undefined;
      const closeRemainderTo = undefined;
      const xtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender,
        receiver,
        closeRemainderTo,
        revocationTarget,
        amount,
        note,
        body['assetID'],
        params,
      );
      // Sign the transaction
      const rawSignedTxn = xtxn.signTxn(myAccount.sk);
      const txId = xtxn.txID().toString();
      // Submit the transaction
      await clientAlgorand.sendRawTransaction(rawSignedTxn).do();
      // Wait for confirmation
      const confirmedTxn = await this.waitForConfirmation(
        clientAlgorand,
        txId,
        4,
      );
      //Get the completed Transaction
      const mytxinfo = confirmedTxn.txn.txn;
      const respOk = new TransferTokenResponse();
      respOk.success = true;
      respOk.title = 'Transfer token completed';
      respOk.successMessage = 'The transfer token is complete';
      respOk.responseData = { txId: txId, txDetail: mytxinfo };
      return response.status(200).json(respOk);
    } catch (e) {
      return response.status(500).json(this.errorTransferAlgo(e.code));
    }
  }

  async transferTokenItoI(body, response) {
    try {
      if (
        body === null ||
        body['indexTo'] === undefined ||
        body['indexFrom'] === undefined ||
        body['assetID'] === undefined ||
        body['amount'] === undefined
      ) {
        return response
          .status(400)
          .json(this.errorTransferToken({ error: 'body data not completed' }));
      }
      //client algorand
      const clientAlgorand: AlgodClient = this.getClientAlgorand();
      //get account From
      const account: Record<string, unknown> =
        await this.appService.getAccountByIndexDB(body['indexFrom']);
      const myAccount: algosdk.Account =
        await this.appService.getAccountbyMnemonic(
          account['mnemonic'].toString(),
        );
      //get account To
      const account2: Record<string, unknown> =
        await this.appService.getAccountByIndexDB(body['indexTo']);
      const myAccountTo: algosdk.Account =
        await this.appService.getAccountbyMnemonic(
          account2['mnemonic'].toString(),
        );
      const accountInfoFrom = await clientAlgorand
        .accountInformation(myAccount.addr)
        .do();
      const accountInfoTo = await clientAlgorand
        .accountInformation(myAccountTo.addr)
        .do();

      //Load algos to optin and transfer
      if (
        (await this.loadAlgosToOptIn(accountInfoTo, body['assetID'])) ===
        'error'
      ) {
        return response
          .status(400)
          .json(this.errorTransferToken({ error: 'Fail opt-in load algos' }));
      }
      if (
        (await this.optIn(account2['mnemonic'].toString(), body['assetID'])) ===
        'error'
      ) {
        return response
          .status(400)
          .json(this.errorTransferToken({ error: 'Fail opt-in tx' }));
      }
      if ((await this.loadAlgosToTransfer(myAccount.addr)) === 'error') {
        return response
          .status(400)
          .json(
            this.errorTransferToken({ error: 'Fail load algos to transfer' }),
          );
      }

      // Transfer
      // Construct the transaction
      const params = await clientAlgorand.getTransactionParams().do();
      const receiver = myAccountTo.addr;
      const enc = new TextEncoder();
      const note = enc.encode(body['msg'] || '');
      //load decimals of asset
      const decimalAmount = await this.compactAmountToMicroAmount(
        body['amount'],
        body['assetID'],
      );
      const amount = decimalAmount;
      const sender = myAccount.addr;
      const revocationTarget = undefined;
      const closeRemainderTo = undefined;
      const xtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender,
        receiver,
        closeRemainderTo,
        revocationTarget,
        amount,
        note,
        body['assetID'],
        params,
      );
      // Sign the transaction
      const rawSignedTxn = xtxn.signTxn(myAccount.sk);
      const txId = xtxn.txID().toString();
      // Submit the transaction
      await clientAlgorand.sendRawTransaction(rawSignedTxn).do();
      // Wait for confirmation
      const confirmedTxn = await this.waitForConfirmation(
        clientAlgorand,
        txId,
        4,
      );
      //Get the completed Transaction
      const mytxinfo = confirmedTxn.txn.txn;
      const respOk = new TransferTokenResponse();
      respOk.success = true;
      respOk.title = 'Transfer token completed';
      respOk.successMessage = 'The transfer token is complete';
      respOk.responseData = { txId: txId, txDetail: mytxinfo };
      return response.status(200).json(respOk);
    } catch (e) {
      console.log(e);
      return response.status(500).json(this.errorTransferAlgo(e.code));
    }
  }

  async transferTokenAtoI(body, response) {
    try {
      if (
        body === null ||
        body['indexTo'] === undefined ||
        body['secretFrom'] === undefined ||
        body['assetID'] === undefined ||
        body['amount'] === undefined
      ) {
        return response
          .status(400)
          .json(this.errorTransferToken({ error: 'body data not completed' }));
      }
      //client algorand
      const clientAlgorand: AlgodClient = this.getClientAlgorand();
      //get account
      const myAccount: algosdk.Account =
        await this.appService.getAccountbyMnemonic(body['secretFrom']);
      const accountInfo = await clientAlgorand
        .accountInformation(myAccount.addr)
        .do();
      //get account To
      const account2: Record<string, unknown> =
        await this.appService.getAccountByIndexDB(body['indexTo']);
      const accountTo: algosdk.Account =
        await this.appService.getAccountbyMnemonic(
          account2['mnemonic'].toString(),
        );
      const accountInfoReceiver = await clientAlgorand
        .accountInformation(accountTo.addr)
        .do();
      //Load algos to optin and transfer
      if (
        (await this.loadAlgosToOptIn(accountInfoReceiver, body['assetID'])) ===
        'error'
      ) {
        return response
          .status(400)
          .json(this.errorTransferToken({ error: 'Fail opt-in load algos' }));
      }
      if (
        (await this.optIn(account2['mnemonic'].toString(), body['assetID'])) ===
        'error'
      ) {
        return response
          .status(400)
          .json(this.errorTransferToken({ error: 'Fail opt-in tx' }));
      }
      if ((await this.loadAlgosToTransfer(myAccount.addr)) === 'error') {
        return response
          .status(400)
          .json(
            this.errorTransferToken({ error: 'Fail load algos to transfer' }),
          );
      }

      // Transfer
      // Construct the transaction
      const params = await clientAlgorand.getTransactionParams().do();
      const receiver = accountTo.addr;
      const enc = new TextEncoder();
      const note = enc.encode(body['msg'] || '');
      //load decimals of asset
      const decimalAmount = await this.compactAmountToMicroAmount(
        body['amount'],
        body['assetID'],
      );
      const amount = decimalAmount;
      const sender = myAccount.addr;
      const revocationTarget = undefined;
      const closeRemainderTo = undefined;
      const xtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender,
        receiver,
        closeRemainderTo,
        revocationTarget,
        amount,
        note,
        body['assetID'],
        params,
      );
      // Sign the transaction
      const rawSignedTxn = xtxn.signTxn(myAccount.sk);
      const txId = xtxn.txID().toString();
      // Submit the transaction
      await clientAlgorand.sendRawTransaction(rawSignedTxn).do();
      // Wait for confirmation
      const confirmedTxn = await this.waitForConfirmation(
        clientAlgorand,
        txId,
        4,
      );
      //Get the completed Transaction
      const mytxinfo = confirmedTxn.txn.txn;
      const respOk = new TransferTokenResponse();
      respOk.success = true;
      respOk.title = 'Transfer token completed';
      respOk.successMessage = 'The transfer token is complete';
      respOk.responseData = { txId: txId, txDetail: mytxinfo };
      return response.status(200).json(respOk);
    } catch (e) {
      return response.status(500).json(this.errorTransferAlgo(e.code));
    }
  }

  async transferTokenItoA(body, response) {
    try {
      if (
        body === null ||
        body['indexFrom'] === undefined ||
        body['secretTo'] === undefined ||
        body['assetID'] === undefined ||
        body['amount'] === undefined
      ) {
        return response
          .status(400)
          .json(this.errorTransferToken({ error: 'body data not completed' }));
      }
      //client algorand
      const clientAlgorand: AlgodClient = this.getClientAlgorand();
      //get account From
      const account: Record<string, unknown> =
        await this.appService.getAccountByIndexDB(body['indexFrom']);
      const myAccount: algosdk.Account =
        await this.appService.getAccountbyMnemonic(
          account['mnemonic'].toString(),
        );
      //get account To
      const accountTo: algosdk.Account =
        await this.appService.getAccountbyMnemonic(body['secretTo']);
      const accountInfoReceiver = await clientAlgorand
        .accountInformation(accountTo.addr)
        .do();

      //Load algos to optin and transfer
      if (
        (await this.loadAlgosToOptIn(accountInfoReceiver, body['assetID'])) ===
        'error'
      ) {
        return response
          .status(400)
          .json(this.errorTransferToken({ error: 'Fail opt-in load algos' }));
      }
      if ((await this.optIn(body['secretTo'], body['assetID'])) === 'error') {
        return response
          .status(400)
          .json(this.errorTransferToken({ error: 'Fail opt-in tx' }));
      }
      if ((await this.loadAlgosToTransfer(myAccount.addr)) === 'error') {
        return response
          .status(400)
          .json(
            this.errorTransferToken({ error: 'Fail load algos to transfer' }),
          );
      }

      // Transfer
      // Construct the transaction
      const params = await clientAlgorand.getTransactionParams().do();
      const receiver = accountTo.addr;
      const enc = new TextEncoder();
      const note = enc.encode(body['msg'] || '');
      //load decimals of asset
      const decimalAmount = await this.compactAmountToMicroAmount(
        body['amount'],
        body['assetID'],
      );
      const amount = decimalAmount;
      const sender = myAccount.addr;
      const revocationTarget = undefined;
      const closeRemainderTo = undefined;
      const xtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender,
        receiver,
        closeRemainderTo,
        revocationTarget,
        amount,
        note,
        body['assetID'],
        params,
      );
      // Sign the transaction
      const rawSignedTxn = xtxn.signTxn(myAccount.sk);
      const txId = xtxn.txID().toString();
      // Submit the transaction
      await clientAlgorand.sendRawTransaction(rawSignedTxn).do();
      // Wait for confirmation
      const confirmedTxn = await this.waitForConfirmation(
        clientAlgorand,
        txId,
        4,
      );
      //Get the completed Transaction
      const mytxinfo = confirmedTxn.txn.txn;
      const respOk = new TransferTokenResponse();
      respOk.success = true;
      respOk.title = 'Transfer token completed';
      respOk.successMessage = 'The transfer token is complete';
      respOk.responseData = { txId: txId, txDetail: mytxinfo };
      return response.status(200).json(respOk);
    } catch (e) {
      console.log(e);
      return response.status(500).json(this.errorTransferAlgo(e.code));
    }
  }

  async transferTokenItoA2(body, response) {
    try {
      if (
        body === null ||
        body['indexFrom'] === undefined ||
        body['addressTo'] === undefined ||
        body['assetID'] === undefined ||
        body['amount'] === undefined
      ) {
        return response
          .status(400)
          .json(this.errorTransferToken({ error: 'body data not completed' }));
      }
      //client algorand
      const clientAlgorand: AlgodClient = this.getClientAlgorand();
      //get account From
      const account: Record<string, unknown> =
        await this.appService.getAccountByIndexDB(body['indexFrom']);
      const myAccount: algosdk.Account =
        await this.appService.getAccountbyMnemonic(
          account['mnemonic'].toString(),
        );
      //get account To
      const receiver = body['addressTo'];
      if ((await this.loadAlgosToTransfer(receiver)) === 'error') {
        return response
          .status(400)
          .json(
            this.errorTransferToken({ error: 'Fail load algos to transfer' }),
          );
      }

      // Transfer
      // Construct the transaction
      const params = await clientAlgorand.getTransactionParams().do();
      const enc = new TextEncoder();
      const note = enc.encode(body['msg'] || '');
      //load decimals of asset
      const decimalAmount = await this.compactAmountToMicroAmount(
        body['amount'],
        body['assetID'],
      );
      const amount = decimalAmount;
      const sender = myAccount.addr;
      const revocationTarget = undefined;
      const closeRemainderTo = undefined;
      const xtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender,
        receiver,
        closeRemainderTo,
        revocationTarget,
        amount,
        note,
        body['assetID'],
        params,
      );
      // Sign the transaction
      const rawSignedTxn = xtxn.signTxn(myAccount.sk);
      const txId = xtxn.txID().toString();
      // Submit the transaction
      await clientAlgorand.sendRawTransaction(rawSignedTxn).do();
      // Wait for confirmation
      const confirmedTxn = await this.waitForConfirmation(
        clientAlgorand,
        txId,
        4,
      );
      //Get the completed Transaction
      const mytxinfo = confirmedTxn.txn.txn;
      const respOk = new TransferTokenResponse();
      respOk.success = true;
      respOk.title = 'Transfer token completed';
      respOk.successMessage = 'The transfer token is complete';
      respOk.responseData = { txId: txId, txDetail: mytxinfo };
      return response.status(200).json(respOk);
    } catch (e) {
      console.log(e);
      return response.status(500).json(this.errorTransferAlgo(e.code));
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

  errorTransferToken(err) {
    const respPro = new TransferAlgoResponse();
    respPro.success = false;
    respPro.title = 'Ups transfer not completed';
    respPro.errorData = new ErrorResponse({
      errorCode: 1,
      errorMsg: 'Error in transfer token',
      errorData: err,
    });
    return respPro;
  }

  errorNFTAlgo(err) {
    const respPro = new TransferAlgoResponse();
    respPro.success = false;
    respPro.title = 'Ups create NFT not completed';
    respPro.errorData = new ErrorResponse({
      errorCode: 1,
      errorMsg: 'Error in create NFT',
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

  async loadAlgosToCreateNFT(recieverAccountInfo: Record<string, any>) {
    try {
      //client algorand
      const clientAlgorand: AlgodClient = this.getClientAlgorand();
      //get account
      const mnemonicHotWallet =
        process.env.TESTNET_ALGO === 'true'
          ? process.env.TEST_HOTWALLET
          : process.env.HOTWALLET;
      const myAccount: algosdk.Account =
        await this.appService.getAccountbyMnemonic(mnemonicHotWallet);
      //Check balance to tranfer
      const accountInfo = await clientAlgorand
        .accountInformation(myAccount.addr)
        .do();
      if (algosdk.microalgosToAlgos(accountInfo.amount) < 1) {
        return 'error';
      }
      //validate amount
      let amountToLoad = 0;
      if (recieverAccountInfo.assets.length === 0) {
        amountToLoad = 0.2;
      } else if (
        algosdk.microalgosToAlgos(recieverAccountInfo.amount) <
        (recieverAccountInfo.assets.length + 2) * 0.1
      ) {
        amountToLoad =
          (recieverAccountInfo.assets.length + 2) * 0.1 -
          algosdk.microalgosToAlgos(recieverAccountInfo.amount);
      }

      amountToLoad = amountToLoad + 0.001;
      // Construct the transaction
      const params = await clientAlgorand.getTransactionParams().do();
      const receiver = recieverAccountInfo.address;
      const enc = new TextEncoder();
      const note = enc.encode('epio load');
      const amount = algosdk.algosToMicroalgos(amountToLoad); //cambiar
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
      return txId;
    } catch (e) {
      console.error(e);
      return 'error';
    }
  }

  async loadAlgosToTransfer(recieverAccount: string) {
    try {
      //client algorand
      const clientAlgorand: AlgodClient = this.getClientAlgorand();
      //get account
      const mnemonicHotWallet =
        process.env.TESTNET_ALGO === 'true'
          ? process.env.TEST_HOTWALLET
          : process.env.HOTWALLET;
      const myAccount: algosdk.Account =
        await this.appService.getAccountbyMnemonic(mnemonicHotWallet);
      //Check balance to tranfer
      const accountInfo = await clientAlgorand
        .accountInformation(myAccount.addr)
        .do();
      if (algosdk.microalgosToAlgos(accountInfo.amount) < 1) {
        return 'error';
      }
      const amountToLoad = 0.001;
      // Construct the transaction
      const params = await clientAlgorand.getTransactionParams().do();
      const receiver = recieverAccount;
      const enc = new TextEncoder();
      const note = enc.encode('epio load');
      const amount = algosdk.algosToMicroalgos(amountToLoad); //cambiar
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
      return txId;
    } catch (e) {
      console.error(e);
      return 'error';
    }
  }

  async loadAlgosToOptIn(
    recieverAccountInfo: Record<string, any>,
    assetID: number,
  ) {
    try {
      //client algorand
      const clientAlgorand: AlgodClient = this.getClientAlgorand();
      //get account
      const mnemonicHotWallet =
        process.env.TESTNET_ALGO === 'true'
          ? process.env.TEST_HOTWALLET
          : process.env.HOTWALLET;
      const myAccount: algosdk.Account =
        await this.appService.getAccountbyMnemonic(mnemonicHotWallet);
      //Check balance to tranfer
      const accountInfo = await clientAlgorand
        .accountInformation(myAccount.addr)
        .do();
      if (algosdk.microalgosToAlgos(accountInfo.amount) < 1) {
        return 'error';
      }
      //validate if asset id exist in this account
      let existAsset = false;
      for (let i = 0; i < recieverAccountInfo.assets.length; i++) {
        if (recieverAccountInfo.assets[i]['asset-id'] === assetID) {
          existAsset = true;
        }
      }
      let amountToLoad = 0;
      if (!existAsset) {
        //validate amount
        if (recieverAccountInfo.assets.length === 0) {
          amountToLoad = 0.2;
        } else if (
          algosdk.microalgosToAlgos(recieverAccountInfo.amount) <
          (recieverAccountInfo.assets.length + 2) * 0.1
        ) {
          amountToLoad =
            (recieverAccountInfo.assets.length + 2) * 0.1 -
            algosdk.microalgosToAlgos(recieverAccountInfo.amount);
        }
      }
      amountToLoad = amountToLoad + 0.002;
      // Construct the transaction
      const params = await clientAlgorand.getTransactionParams().do();
      const receiver = recieverAccountInfo.address;
      const enc = new TextEncoder();
      const note = enc.encode('epio load');
      const amount = algosdk.algosToMicroalgos(amountToLoad); //cambiar
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
      return txId;
    } catch (e) {
      console.error(e);
      return 'error';
    }
  }

  async optIn(recieverAccount: string, assetID: number) {
    try {
      //client algorand
      const clientAlgorand: AlgodClient = this.getClientAlgorand();
      //get account
      const myAccount: algosdk.Account =
        await this.appService.getAccountbyMnemonic(recieverAccount);
      //Check balance to tranfer
      const accountInfo = await clientAlgorand
        .accountInformation(myAccount.addr)
        .do();
      //validate if asset id exist in this account
      let existAsset = false;
      for (let i = 0; i < accountInfo.assets.length; i++) {
        if (accountInfo.assets[i]['asset-id'] === assetID) {
          existAsset = true;
        }
      }
      if (existAsset) {
        return '';
      }
      //Init opt-in proccess
      const params = await clientAlgorand.getTransactionParams().do();
      const sender = myAccount.addr;
      const recipient = sender;
      const revocationTarget = undefined;
      const closeRemainderTo = undefined;
      const amount = 0;
      const enc = new TextEncoder();
      const note = enc.encode('opt-in');

      // signing and sending "txn" allows sender to begin accepting asset specified by creator and index
      const opttxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender,
        recipient,
        closeRemainderTo,
        revocationTarget,
        amount,
        note,
        assetID,
        params,
      );

      // Must be signed by the account wishing to opt in to the asset
      const rawSignedTxn = opttxn.signTxn(myAccount.sk);
      const txId = opttxn.txID().toString();
      await clientAlgorand.sendRawTransaction(rawSignedTxn).do();
      // Wait for confirmation
      const confirmedTxn = await this.waitForConfirmation(
        clientAlgorand,
        txId,
        4,
      );
      return txId;
    } catch (e) {
      console.error(e);
      return 'error';
    }
  }

  async compactAmountToMicroAmount(
    compactAmount: number,
    assetID: number,
  ): Promise<number> {
    const result = await this.getAssetInfo(assetID);
    const decimalsAsset = result.assets[0].params.decimals;
    if (decimalsAsset > 0) {
      const strRatio = '1e' + result.assets[0].params.decimals;
      const amountResult: number = compactAmount * Number(strRatio);
      return Math.round(amountResult);
    } else {
      return compactAmount;
    }
  }

  async microAmountToCompactAmount(
    microAmount: number,
    assetID: number,
  ): Promise<number> {
    const result = await this.getAssetInfo(assetID);
    const decimalsAsset = result.assets[0].params.decimals;
    const strRatio = '1e' + decimalsAsset;
    return microAmount / Number(strRatio);
  }

  async microAmountToCompactAmountLocal(
    microAmount: number,
    assetID: number,
  ): Promise<number> {
    const usdtID: string =
      process.env.TESTNET_ALGO === 'true'
        ? process.env.TEST_ID_USDT
        : process.env.ID_USDT;
    const slvaID: string =
      process.env.TESTNET_ALGO === 'true'
        ? process.env.TEST_ID_SLVA
        : process.env.ID_SLVA;
    let decimalsAsset = 0;
    if (assetID.toString() === usdtID) {
      decimalsAsset = 6;
    } else if (assetID.toString() === slvaID) {
      decimalsAsset = 8;
    }
    const strRatio = '1e' + decimalsAsset;
    return microAmount / Number(strRatio);
  }

  async getAssetInfo(assetID: number) {
    try {
      const indexerRoute =
        process.env.TESTNET_ALGO === 'true'
          ? process.env.TESTNET_INDEXER_ALGO
          : process.env.MAINNET_INDEXER_ALGO;
      //indexer algorand
      const token = {
        'X-API-key': process.env.X_API_KEY_ALGO,
      };
      const indexerClient = new algosdk.Indexer(token, indexerRoute, '');
      const assetInfo = await indexerClient
        .searchForAssets()
        .index(assetID)
        .do();
      return assetInfo;
    } catch (e) {
      console.error(e);
      throw new Error(e);
    }
  }

  //Stacks
  async getRandomAccountStacks(response) {
    try {
      const privateKey = makeRandomPrivKey();
      let stacksAddress;
      if (process.env.TESTNET_ALGO === 'true') {
        stacksAddress = getAddressFromPrivateKey(
          privateKeyToString(privateKey),
          TransactionVersion.Testnet,
        );
      } else {
        stacksAddress = getAddressFromPrivateKey(
          privateKeyToString(privateKey),
        );
      }
      const resBody = {
        address: stacksAddress,
        pk: privateKeyToString(privateKey),
      };
      const account: Record<string, unknown> = resBody;

      if (account === {}) {
        return response.status(500).json(this.errorgetAddressAlgo({}));
      } else {
        const respPro = new AddressByIdResponse();
        respPro.success = true;
        respPro.title = 'Account Stacks Get OK';
        respPro.successMessage = 'Account has created';
        respPro.responseData = account;
        return response.status(200).json(respPro);
      }
    } catch (e) {
      return response.status(500).json(this.errorgetAddressAlgo(e));
    }
  }

  async getStacksBalanceA(dataQuery: Record<string, unknown>, response) {
    let respPro: StacksBalanceResponse;
    if (!dataQuery) {
      respPro = new StacksBalanceResponse({
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
      respPro = new StacksBalanceResponse({
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
      let apiConfig;
      if (process.env.TESTNET_ALGO === 'true') {
        apiConfig = new Configuration({
          fetchApi: fetch,
          basePath: process.env.TESTNET_STACKS,
        });
      } else {
        apiConfig = new Configuration({
          fetchApi: fetch,
          basePath: process.env.MAINNET_STACKS,
        });
      }
      const accounts = new AccountsApi(apiConfig);
      const balances = await accounts.getAccountBalance({
        principal: dataQuery['account'].toString(),
      });
      respPro = new StacksBalanceResponse({
        success: true,
        error: false,
        responseData: new StacksBalance({
          account: dataQuery['account'].toString(),
          balanceStacks: {
            compact_stx_balance: this.microAmountToCompactAmountGeneric(
              +balances.stx.balance,
              +process.env.DECIMALS_STX,
            ),
            ...balances,
          },
        }),
      });
      return response.status(200).json(respPro);
    } catch (e) {
      respPro = new StacksBalanceResponse({
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

  async getStacksBalanceI(dataQuery: Record<string, unknown>, response) {
    let respPro: StacksBalanceResponse;
    if (!dataQuery) {
      respPro = new StacksBalanceResponse({
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
      respPro = new StacksBalanceResponse({
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

    if (+dataQuery['id'] < 0) {
      return response.status(500).json(this.errorgetAddressAlgo({}));
    }
    //convert index to account stacks
    const accountFromI = await this.convertIndexToAccountStacks(
      +dataQuery['id'],
    );

    try {
      let apiConfig;
      if (process.env.TESTNET_ALGO === 'true') {
        apiConfig = new Configuration({
          fetchApi: fetch,
          basePath: process.env.TESTNET_STACKS,
        });
      } else {
        apiConfig = new Configuration({
          fetchApi: fetch,
          basePath: process.env.MAINNET_STACKS,
        });
      }
      const accounts = new AccountsApi(apiConfig);
      const balances = await accounts.getAccountBalance({
        principal: accountFromI,
      });
      respPro = new StacksBalanceResponse({
        success: true,
        error: false,
        responseData: new StacksBalance({
          account: accountFromI,
          balanceStacks: {
            compact_stx_balance: this.microAmountToCompactAmountGeneric(
              +balances.stx.balance,
              +process.env.DECIMALS_STX,
            ),
            ...balances,
          },
        }),
      });
      return response.status(200).json(respPro);
    } catch (e) {
      respPro = new StacksBalanceResponse({
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

  async getStacksAddressI(dataQuery: Record<string, unknown>, response) {
    let respPro: StacksBalanceResponse;
    if (!dataQuery) {
      respPro = new StacksBalanceResponse({
        success: false,
        error: true,
        errorData: new ErrorResponse({
          errorCode: 0,
          errorMsg: 'No se envió id, por favor enviar id.',
          errorData: 'Missing query: id',
        }),
      });
      return response.status(200).json(respPro);
    } else if (!dataQuery['id']) {
      respPro = new StacksBalanceResponse({
        success: false,
        error: true,
        errorData: new ErrorResponse({
          errorCode: 0,
          errorMsg: 'No se envió id',
          errorData: 'Missing query: id',
        }),
      });
      return response.status(200).json(respPro);
    }

    try {
      if (+dataQuery['id'] < 0) {
        return response.status(500).json(this.errorgetAddressAlgo({}));
      }
      //convert index to account stacks
      const accountFromI = await this.convertIndexToAccountStacks(
        +dataQuery['id'],
      );

      const respPro2 = new AddressByIdResponse();
      respPro2.success = true;
      respPro2.title = 'Address Get OK';
      respPro2.successMessage = 'Account has ben recupered';
      respPro2.responseData = {
        address: accountFromI,
        index: dataQuery['id'],
      };
      return response.status(200).json(respPro2);
    } catch (e) {
      return response.status(500).json(this.errorgetAddressAlgo(e));
    }
  }

  async transferSTXPKtoA(body, response) {
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

      // Private key from hex string
      const key = body['secretFrom'];
      //const privateKey = createStacksPrivateKey(key);
      const txOptions2: SignedTokenTransferOptions = {
        recipient: body['addressTo'],
        amount: this.compactAmountToMicroAmountGeneric(
          +body['amount'],
          +process.env.DECIMALS_STX,
        ),
        senderKey: key,
        network: process.env.TESTNET_ALGO === 'true' ? 'testnet' : 'mainnet',
        memo: body['msg'],
        //nonce: 0n, // set a nonce manually if you don't want builder to fetch from a Stacks node
        fee: 200n, // set a tx fee if you don't want the builder to estimate
        anchorMode: AnchorMode.Any,
      };

      const transaction = await makeSTXTokenTransfer(txOptions2);

      // to see the raw serialized tx
      const serializedTx = transaction.serialize().toString('hex');

      // broadcasting transaction to the specified network
      const broadcastResponse = await broadcastTransaction(transaction);
      const txId = broadcastResponse.txid;

      const respOk = new TransferSTXResponse();
      respOk.success = true;
      respOk.title = 'Transfer completed';
      respOk.successMessage =
        'The transfer is indexed, please validate the transaction in a few minutes';
      if (broadcastResponse.error) {
        return response.status(400).json(
          this.errorTransferAlgo({
            error: broadcastResponse,
          }),
        );
      }
      respOk.responseData = { txId: txId, txDetail: broadcastResponse };
      return response.status(200).json(respOk);
    } catch (e) {
      return response.status(500).json(this.errorTransferAlgo(e));
    }
  }

  async transferSTXItoA(body, response) {
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

      //get pk to index
      if (+body['indexFrom'] < 0) {
        return response.status(500).json(this.errorgetAddressAlgo({}));
      }
      //convert index to account stacks
      const priKey = this.convertIndexToPKStacks(+body['indexFrom']);

      // Private key from hex string
      const key = priKey;
      //const privateKey = createStacksPrivateKey(key);
      const txOptions2: SignedTokenTransferOptions = {
        recipient: body['addressTo'],
        amount: this.compactAmountToMicroAmountGeneric(
          +body['amount'],
          +process.env.DECIMALS_STX,
        ),
        senderKey: key,
        network: process.env.TESTNET_ALGO === 'true' ? 'testnet' : 'mainnet',
        memo: body['msg'],
        //nonce: 0n, // set a nonce manually if you don't want builder to fetch from a Stacks node
        fee: 200n, // set a tx fee if you don't want the builder to estimate
        anchorMode: AnchorMode.Any,
      };

      const transaction = await makeSTXTokenTransfer(txOptions2);

      // to see the raw serialized tx
      const serializedTx = transaction.serialize().toString('hex');

      // broadcasting transaction to the specified network
      const broadcastResponse = await broadcastTransaction(transaction);
      const txId = broadcastResponse.txid;

      const respOk = new TransferSTXResponse();
      respOk.success = true;
      respOk.title = 'Transfer completed';
      respOk.successMessage =
        'The transfer is indexed, please validate the transaction in a few minutes';
      if (broadcastResponse.error) {
        return response.status(400).json(
          this.errorTransferAlgo({
            error: broadcastResponse,
          }),
        );
      }
      respOk.responseData = { txId: txId, txDetail: broadcastResponse };
      return response.status(200).json(respOk);
    } catch (e) {
      return response.status(500).json(this.errorTransferAlgo(e));
    }
  }

  async transferSTXItoI(body, response) {
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

      //get pk to index
      if (+body['indexFrom'] < 0 || +body['indexTo'] < 0) {
        return response.status(500).json(this.errorgetAddressAlgo({}));
      }
      //convert index to pk stacks
      const priKey = this.convertIndexToPKStacks(+body['indexFrom']);

      //convert index to account
      const addressTo = await this.convertIndexToAccountStacks(
        +body['indexTo'],
      );

      // Private key from hex string
      const key = priKey;
      //const privateKey = createStacksPrivateKey(key);
      const txOptions2: SignedTokenTransferOptions = {
        recipient: addressTo,
        amount: this.compactAmountToMicroAmountGeneric(
          +body['amount'],
          +process.env.DECIMALS_STX,
        ),
        senderKey: key,
        network: process.env.TESTNET_ALGO === 'true' ? 'testnet' : 'mainnet',
        memo: body['msg'],
        //nonce: 0n, // set a nonce manually if you don't want builder to fetch from a Stacks node
        fee: 200n, // set a tx fee if you don't want the builder to estimate
        anchorMode: AnchorMode.Any,
      };

      const transaction = await makeSTXTokenTransfer(txOptions2);

      // to see the raw serialized tx
      const serializedTx = transaction.serialize().toString('hex');

      // broadcasting transaction to the specified network
      const broadcastResponse = await broadcastTransaction(transaction);
      const txId = broadcastResponse.txid;

      const respOk = new TransferSTXResponse();
      respOk.success = true;
      respOk.title = 'Transfer completed';
      respOk.successMessage =
        'The transfer is indexed, please validate the transaction in a few minutes';
      if (broadcastResponse.error) {
        return response.status(400).json(
          this.errorTransferAlgo({
            error: broadcastResponse,
          }),
        );
      }
      respOk.responseData = { txId: txId, txDetail: broadcastResponse };
      return response.status(200).json(respOk);
    } catch (e) {
      return response.status(500).json(this.errorTransferAlgo(e));
    }
  }

  async getStatusTransactionStacksByTxId(
    dataQuery: Record<string, unknown>,
    response,
  ) {
    let respPro: StacksBalanceResponse;
    if (!dataQuery) {
      respPro = new StacksBalanceResponse({
        success: false,
        error: true,
        errorData: new ErrorResponse({
          errorCode: 0,
          errorMsg: 'No se envió txId, por favor enviar txID.',
          errorData: 'Missing query: txID',
        }),
      });
      return response.status(200).json(respPro);
    } else if (!dataQuery['tx']) {
      respPro = new StacksBalanceResponse({
        success: false,
        error: true,
        errorData: new ErrorResponse({
          errorCode: 0,
          errorMsg: 'No se envió txId',
          errorData: 'Missing query: txId',
        }),
      });
      return response.status(200).json(respPro);
    }

    try {
      let apiConfig;
      if (process.env.TESTNET_ALGO === 'true') {
        apiConfig = new Configuration({
          fetchApi: fetch,
          basePath: process.env.TESTNET_STACKS,
        });
      } else {
        apiConfig = new Configuration({
          fetchApi: fetch,
          basePath: process.env.MAINNET_STACKS,
        });
      }
      //get status of transaction
      const transactions = new TransactionsApi(apiConfig);
      const txId: string = dataQuery['tx'].toString();
      const txInfo = await transactions.getTransactionById({
        txId,
      });

      const respPro2 = new StacksStatusTransactionResponse();
      respPro2.success = true;
      respPro2.title = 'Status recupered';
      respPro2.successMessage = 'Please validate the status of transaction';
      respPro2.responseData = txInfo;
      return response.status(200).json(respPro2);
    } catch (e) {
      return response.status(500).json(this.errorgetAddressAlgo(e));
    }
  }

  async convertIndexToAccountStacks(index: number): Promise<string> {
    const pkAccountBTC = this.getPKBTC(index);
    //convert btc to stacks account
    let stacksAddress;
    if (process.env.TESTNET_ALGO === 'true') {
      stacksAddress = getAddressFromPrivateKey(
        privateKeyToString(createStacksPrivateKey(pkAccountBTC)),
        TransactionVersion.Testnet,
      );
    } else {
      stacksAddress = getAddressFromPrivateKey(
        privateKeyToString(createStacksPrivateKey(pkAccountBTC)),
      );
    }
    return stacksAddress;
  }

  convertIndexToPKStacks(index: number): string {
    const pkAccountBTC = this.getPKBTC(index);
    //console.log(pkAccountBTC);
    return pkAccountBTC;
  }

  getPKBTC(index: number): string {
    const mnemonic: string = process.env.SEEDBTC;
    let route;
    if (process.env.TESTNET_ALGO === 'true') {
      route = "m/44'/1'/0'/0";
    } else {
      route = "m/44'/0'/0'/0";
    }
    let redBTC;
    if (process.env.TESTNET_ALGO === 'true') {
      redBTC = bitcoin.networks.testnet;
    } else {
      redBTC = bitcoin.networks.bitcoin;
    }

    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const bip32 = BIP32Factory(ecc);
    const root = bip32.fromSeed(seed, redBTC);

    const accountpath = route;
    const account = root.derivePath(accountpath);
    const APIChild = account.derive(index); // can now withdraw whatever the user paid
    //console.log('Pk:', APIChild.privateKey.toString('hex'));
    //console.log('APIChild address:', this.getAddress(APIChild, redBTC));
    //console.log('APIChild.toWIF():', APIChild.toWIF());

    return APIChild.privateKey.toString('hex');
  }

  getAddressSegWitBTC(index: number): string {
    const mnemonic: string = process.env.SEEDBTC;
    let route;
    if (process.env.TESTNET_ALGO === 'true') {
      route = "m/44'/1'/0'/0";
    } else {
      route = "m/44'/0'/0'/0";
    }
    let redBTC;
    if (process.env.TESTNET_ALGO === 'true') {
      redBTC = bitcoin.networks.testnet;
    } else {
      redBTC = bitcoin.networks.bitcoin;
    }

    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const bip32 = BIP32Factory(ecc);
    const root = bip32.fromSeed(seed, redBTC);

    const accountpath = route;
    const account = root.derivePath(accountpath);
    const APIChild = account.derive(index); // can now withdraw whatever the user paid
    //console.log('Pk:', APIChild.privateKey.toString('hex'));
    //console.log('APIChild address:', this.getAddress(APIChild, redBTC));
    //console.log('APIChild.toWIF():', APIChild.toWIF());

    return this.getAddress(APIChild, redBTC);
  }

  getAddress(node, network) {
    return bitcoin.payments.p2sh({
      redeem: bitcoin.payments.p2wpkh({ pubkey: node.publicKey, network }),
      network,
    }).address;
  }

  microAmountToCompactAmountGeneric(
    microAmount: number,
    decimals: number,
  ): number {
    const strRatio = '1e' + decimals;
    return microAmount / Number(strRatio);
  }

  compactAmountToMicroAmountGeneric(
    compactAmount: number,
    decimals: number,
  ): number {
    if (decimals > 0) {
      const strRatio = '1e' + decimals;
      const amountResult: number = compactAmount * Number(strRatio);
      return Math.round(amountResult);
    } else {
      return compactAmount;
    }
  }
}
