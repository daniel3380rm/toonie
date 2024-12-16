import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpMethods } from './enums/http-methods.enum';
import { ConfigService } from '@nestjs/config';
import { IsSuccessfulDto } from 'src/common/dto/is-successful.dto';

interface ISendRequest {
  method: HttpMethods;
  body?: object;
  path: string;
  isAdditionalPath?: boolean;
  token?: string;
  token_type?: string;
  Bearer?: string;
  headers?: object;
}

interface ISubRequest {
  body?: object;
  path: string;
  token?: string;
  token_type?: string;
  headers?: object;
}

@Injectable()
export class RequestService<T> {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async sendRaw({
    method,
    body,
    isAdditionalPath,
    path,
    headers,
    token,
  }: ISendRequest) {
    const url = isAdditionalPath
      ? this.configService.get('app.baseUrl') + path
      : path;

    const result = await firstValueFrom(
      this.httpService.request<T>({
        method,
        data: body || {},
        url: url,
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
      }),
    );

    return result;
  }

  async send({
    method,
    body,
    isAdditionalPath,
    path,
    headers,
    token,
    token_type = 'Bearer',
  }: ISendRequest): Promise<IsSuccessfulDto> {
    try {
      const url = isAdditionalPath
        ? this.configService.get('app.baseUrl') + path
        : path;

      const { data } = await firstValueFrom(
        this.httpService.request<{ data: T }>({
          method,
          data: body || {},
          url: url,
          headers: {
            ...headers,
            Authorization: token ? `${token_type} ${token}` : undefined,
          },
        }),
      );

      return new IsSuccessfulDto(true, data);
    } catch (err) {
      return new IsSuccessfulDto(
        false,
        err.response || err.response.data,
        err.response.data.msg,
      );
    }
  }

  async post(payload: ISubRequest) {
    return await this.send({ ...payload, method: HttpMethods.POST });
  }

  async get(payload: ISubRequest) {
    return await this.send({ ...payload, method: HttpMethods.GET });
  }

  async patch(payload: ISubRequest) {
    return await this.send({ ...payload, method: HttpMethods.PATCH });
  }

  async remove(payload: Omit<ISubRequest, 'body'>) {
    return await this.send({ ...payload, method: HttpMethods.DELETE });
  }
}

export { HttpMethods };
