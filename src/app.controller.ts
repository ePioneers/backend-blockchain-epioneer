import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GeneralResponse } from './models/general_response.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("status")
  getStatus(): GeneralResponse {
    return this.appService.statusAPI();
  }
}
