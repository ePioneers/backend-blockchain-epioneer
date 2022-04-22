import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponse } from 'src/models/error_response.model';

export class AddressByIdResponse {
  @ApiProperty({ example: true, description: 'Was the Api Request succesful?' })
  success: boolean;
  @ApiProperty({
    example: 'Registration succesful',
    description: 'Information about your registration',
  })
  title: string;
  @ApiProperty({
    example: 'Your registration was succesful!',
    description: 'Msg to be displayed to te user',
  })
  successMessage: string;
  @ApiProperty({
    example: new ErrorResponse(),
    description: 'If success is false, an object with the Errors details',
  })
  errorData: ErrorResponse = new ErrorResponse();
  @ApiProperty({
    example: {
      index: 1,
      address: '3HIN5IMODLPQ5V3STFWNYB6AFM6YYENGLTZKFQEFMJXDW7ZLXSARHXMNUZ',
    },
    description: 'Data with address',
  })
  responseData: Record<string, unknown>;
}
