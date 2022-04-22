import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponse } from 'src/models/error_response.model';

export class PrincipalTokensIdsResponse {
  @ApiProperty({ example: true, description: 'Was the Api Request succesful?' })
  success: boolean;
  @ApiProperty({
    example: 'Get principal tokens succesful',
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
      usdt: 85272063,
      slva: 85272064,
    },
    description: 'Data response algorand blockchain',
  })
  responseData: Record<string, unknown>;
}
