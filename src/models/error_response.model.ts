import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  constructor({
    errorCode,
    errorMsg,
    errorData,
  }: { errorCode?: number; errorMsg?: string; errorData?: string } = {}) {
    this.errorCode = errorCode;
    this.errorMsg = errorMsg;
    this.errorData = errorData;
  }

  @ApiProperty({ example: 1, description: 'Internal code error' })
  errorCode: number;
  @ApiProperty({
    example: 'The user is not registered',
    description: 'Message describing the error, addressed to the end user',
  })
  errorMsg: string;
  @ApiProperty({
    example: 'data object json',
    description: 'Data object with technical error',
  })
  errorData: string;
}
