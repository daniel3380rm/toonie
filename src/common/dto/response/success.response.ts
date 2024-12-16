import { ApiProperty } from '@nestjs/swagger';

export class BaseSuccessResponse<type> {
  @ApiProperty({ type: Number })
  statusCode: number;

  @ApiProperty({ type: String })
  message: string;

  @ApiProperty({ type: Object })
  data: type;

  @ApiProperty({ type: Object })
  metadata: object;
}

interface SuccessResponseParamsInterface<type> {
  data: type;
  message?: string;
  statusCode?: number;
  metadata?: any;
}

export class SuccessResponse<type> extends BaseSuccessResponse<type> {
  constructor({
    data,
    message,
    statusCode = 200,
    metadata = null,
  }: SuccessResponseParamsInterface<type>) {
    super();

    this.statusCode = statusCode;
    this.message = message || null;
    this.data = data;
    this.metadata = metadata;
  }
}
