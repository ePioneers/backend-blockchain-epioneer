import { Injectable } from '@nestjs/common';
import { GeneralResponse } from './models/general_response.model';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import * as AWS from "aws-sdk";
import * as algosdk from 'algosdk';
import { Account } from 'algosdk';

@Injectable()
export class AppService {
  statusAPI(): GeneralResponse {
    return new GeneralResponse({success:true,error:false, responseData:"API OK"});
  }

  async getAccountByIndexDB(index:number):Promise<{}>{
    //validate range index
    if(index<0){
      throw new Error('index out of range: < 0')
    }

    //validate if index exist
    // Create S3 service object
    let s3 = new AWS.S3({
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_KEY_SECRET,
    });
    var file = ''+index+'.epio';

    var options = {
        Bucket: process.env.S3_BUCKET,
        Key: file,
    };
    try{
      let dataFile = await s3.getObject(options).promise();
      //Get data to file and decrypt
      let decryptData= await this.dencryptHD(dataFile.Body as Buffer);
      return JSON.parse(decryptData);
    }catch(e){
      if(e.code==='NoSuchKey'){
        //Create account, upload file
        let newIndex = await this.createFileHDByIndex(index);
        return this.getAccountByIndexDB(newIndex);
      }else{
        console.log(e);
        return {};
      }
    }
  }

  async createFileHDByIndex(index:number):Promise<number>{
    try {  
      //generate account
      const myaccount = algosdk.generateAccount();
      let account_mnemonic = algosdk.secretKeyToMnemonic(myaccount.sk);

      let account = {
        'index':index,
        'address':myaccount.addr,
        'mnemonic':account_mnemonic
      }
      let accountJson = JSON.stringify(account);
      //encrypt data account
      let dataToFile = await this.encryptHD(accountJson);
      
      //upload file
      let nameFile = ''+index+'.epio';

      // Create S3 service object
      let s3Bucket = process.env.S3_BUCKET;
      let s3 = new AWS.S3({
          accessKeyId: process.env.AWS_S3_ACCESS_KEY,
          secretAccessKey: process.env.AWS_S3_KEY_SECRET,
      });

      // Setting up S3 upload parameters
      const params = {
        Bucket: s3Bucket,
        Key: nameFile, 
        ContentType:'binary',
        Body: dataToFile,
      };
      let s3Response = await s3.putObject(params).promise();
      return index;
    }catch (e)
    {
      console.log(e);
      return -1;
    }
  }

  async getRandomAccount():Promise<{}>{
    try{
      //generate account
      const myaccount = algosdk.generateAccount();
      let account_mnemonic = algosdk.secretKeyToMnemonic(myaccount.sk);

      let account = {
        'address':myaccount.addr,
        'mnemonic':account_mnemonic
      }
      return account;
    }catch(e){
      return {};
    }
  }

  async getAccountbyMnemonic(mnemonicUser:string):Promise<algosdk.Account>{
    try{
      //create account
      const myaccount:Account = algosdk.mnemonicToSecretKey(mnemonicUser);
      return myaccount;
    }catch(e){
      return null;
    }
  }


  async encryptHD(dataToEncrypt:string):Promise<Buffer>{
    const iv = Buffer.from(process.env.IV_WALLET,'hex');
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

  async dencryptHD(dataToDecrypt:Buffer):Promise<string>{
    const iv = Buffer.from(process.env.IV_WALLET,'hex');
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
