import { ApiProperty } from '@nestjs/swagger';

export class BaseErrorResponse {
  @ApiProperty({ type: Number })
  statusCode: number;

  @ApiProperty({ type: String })
  message: string;

  @ApiProperty()
  metadata: Record<string, any>;
}

export class ErrorResponse extends BaseErrorResponse {
  constructor(message: string, statusCode: number, metadata: object = {}) {
    super();

    this.statusCode = statusCode;
    this.message = message;
    this.metadata = metadata;
  }
}
