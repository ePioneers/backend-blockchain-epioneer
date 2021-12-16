import { ApiProperty } from "@nestjs/swagger";
import { ErrorResponse } from "src/models/error_response.model";

export class TransferAlgoResponse {
  @ApiProperty({example: true, description: 'Was the Api Request succesful?'})
  success: boolean;
  @ApiProperty({example: 'Registration succesful', description: 'Information about your registration'})
  title: string;
  @ApiProperty({example: 'Your registration was succesful!', description: 'Msg to be displayed to te user'})
  successMessage: string;
  @ApiProperty({example: new ErrorResponse, description: 'If success is false, an object with the Errors details'})
  errorData: ErrorResponse = new ErrorResponse;
  @ApiProperty({example:{}, description: 'Data response algorand blockchain'})
  responseData: {};
}