import { Injectable } from '@nestjs/common';
import { GeneralResponse } from './models/general_response.model';
import { createCipheriv, createDecipheriv, scrypt } from 'crypto';
import { promisify } from 'util';
import * as AWS from 'aws-sdk';
import * as algosdk from 'algosdk';
import { Account } from 'algosdk';

@Injectable()
export class AppService {
  statusAPI(): GeneralResponse {
    return new GeneralResponse({
      success: true,
      error: false,
      responseData: 'API OK',
    });
  }

  async getAccountByIndexDB(index: number): Promise<Record<string, unknown>> {
    //validate range index
    if (index < 0) {
      throw new Error('index out of range: < 0');
    }

    //validate if index exist
    // Create S3 service object
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_KEY_SECRET,
    });
    const file = '' + index + '.epio';

    const options = {
      Bucket:
        process.env.TESTNET_ALGO === 'true'
          ? process.env.TEST_S3_BUCKET
          : process.env.S3_BUCKET,
      Key: file,
    };
    try {
      const dataFile = await s3.getObject(options).promise();
      //Get data to file and decrypt
      const decryptData = await this.dencryptHD(dataFile.Body as Buffer);
      return JSON.parse(decryptData);
    } catch (e) {
      if (e.code === 'NoSuchKey') {
        //Create account, upload file
        const newIndex = await this.createFileHDByIndex(index);
        return this.getAccountByIndexDB(newIndex);
      } else {
        console.log(e);
        return {};
      }
    }
  }

  async createFileHDByIndex(index: number): Promise<number> {
    try {
      //generate account
      const myaccount = algosdk.generateAccount();
      const account_mnemonic = algosdk.secretKeyToMnemonic(myaccount.sk);

      const account = {
        index: index,
        address: myaccount.addr,
        mnemonic: account_mnemonic,
      };
      const accountJson = JSON.stringify(account);
      //encrypt data account
      const dataToFile = await this.encryptHD(accountJson);

      //upload file
      const nameFile = '' + index + '.epio';

      // Create S3 service object
      const s3Bucket =
        process.env.TESTNET_ALGO === 'true'
          ? process.env.TEST_S3_BUCKET
          : process.env.S3_BUCKET;
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_KEY_SECRET,
      });

      // Setting up S3 upload parameters
      const params = {
        Bucket: s3Bucket,
        Key: nameFile,
        ContentType: 'binary',
        Body: dataToFile,
      };
      const s3Response = await s3.putObject(params).promise();
      return index;
    } catch (e) {
      console.log(e);
      return -1;
    }
  }

  async createFileJsonNFT(jsonNft, idNFT: string): Promise<string> {
    try {
      const dataToFile = JSON.stringify(jsonNft);

      //upload file
      const nameFile = 'epio' + idNFT + '-' + Date.now() + '.json';
      // Create S3 service object
      const s3Bucket =
        process.env.TESTNET_ALGO === 'true'
          ? process.env.TEST_S3_BUCKET_JSON_NFT
          : process.env.S3_BUCKET_JSON_NFT;
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_KEY_SECRET,
      });
      // Setting up S3 upload parameters
      const params = {
        Bucket: s3Bucket,
        Key: nameFile,
        ContentType: 'application/json',
        Body: dataToFile,
        ACL: 'public-read',
      };
      const s3Response = await s3.putObject(params).promise();
      const urlJson =
        'https://' +
        (process.env.TESTNET_ALGO === 'true'
          ? process.env.TEST_S3_BUCKET_JSON_NFT
          : process.env.S3_BUCKET_JSON_NFT) +
        '.s3.amazonaws.com/' +
        nameFile;
      return urlJson;
    } catch (e) {
      console.log(e);
      return 'error';
    }
  }

  async getRandomAccount(): Promise<Record<string, unknown>> {
    try {
      //generate account
      const myaccount = algosdk.generateAccount();
      const account_mnemonic = algosdk.secretKeyToMnemonic(myaccount.sk);

      const account = {
        address: myaccount.addr,
        mnemonic: account_mnemonic,
      };
      return account;
    } catch (e) {
      return {};
    }
  }

  async getAccountbyMnemonic(mnemonicUser: string): Promise<algosdk.Account> {
    try {
      //create account
      const myaccount: Account = algosdk.mnemonicToSecretKey(mnemonicUser);
      return myaccount;
    } catch (e) {
      return null;
    }
  }

  async encryptHD(dataToEncrypt: string): Promise<Buffer> {
    const iv = Buffer.from(process.env.IV_WALLET, 'hex');
    const password = process.env.HD_WALLET;
    // The key length is dependent on the algorithm.
    // In this case for aes256, it is 32 bytes.
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const encryptedText = Buffer.concat([
      cipher.update(dataToEncrypt),
      cipher.final(),
    ]);
    return encryptedText;
  }

  async dencryptHD(dataToDecrypt: Buffer): Promise<string> {
    const iv = Buffer.from(process.env.IV_WALLET, 'hex');
    const password = process.env.HD_WALLET;
    // The key length is dependent on the algorithm.
    // In this case for aes256, it is 32 bytes.
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv('aes-256-ctr', key, iv);

    const decryptedText = Buffer.concat([
      decipher.update(dataToDecrypt),
      decipher.final(),
    ]);
    return decryptedText.toString();
  }
}
