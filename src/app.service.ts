import { Injectable } from '@nestjs/common';
import { GeneralResponse } from './models/general_response.model';

@Injectable()
export class AppService {
  statusAPI(): GeneralResponse {
    return new GeneralResponse({success:true,error:false, responseData:"API OK"});
  }
}
