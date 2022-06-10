import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponse } from 'src/models/error_response.model';
import { StacksBalance } from './stacks_balance.model';

export class StacksBalanceResponse {
  constructor({
    success,
    error,
    errorData,
    responseData,
  }: {
    success?: boolean;
    error?: boolean;
    errorData?: ErrorResponse;
    responseData?: StacksBalance;
  } = {}) {
    this.success = success;
    this.error = error;
    (this.errorData = errorData), (this.responseData = responseData);
  }

  @ApiProperty({
    example: true,
    description:
      'Indicates with a boolean if the response was completed successfully',
  })
  success: boolean;
  @ApiProperty({
    example: false,
    description:
      'Indicates with a boolean whether the request generated an error',
  })
  error: boolean;
  @ApiProperty({
    example: new ErrorResponse(),
    description:
      'ErrorReponse model containing the necessary data about the error occurred.',
    type: ErrorResponse,
  })
  errorData: ErrorResponse;
  @ApiProperty({ example: new StacksBalance(), description: 'Balance model' })
  responseData: StacksBalance;
}
