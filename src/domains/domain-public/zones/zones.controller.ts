import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ZonesService } from './zones.service';
import { Public } from '../../domain-auth/authentications/decorators/public.decorator';
import { IdDto } from '../../../common/dto/request/id.dto';
import { SuccessResponse } from '../../../common/dto/response/success.response';

@Public()
@ApiTags('Zone')
@Controller({
  path: 'public/zone',
  version: '1',
})
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Get('/country')
  @HttpCode(HttpStatus.OK)
  async findCountries() {
    return new SuccessResponse({
      data: await this.zonesService.getCountries(),
    });
  }

  @Get('/state/:id')
  @HttpCode(HttpStatus.OK)
  async findStates(@Param() { id }: IdDto) {
    return new SuccessResponse({
      data: await this.zonesService.getStates(Number(id)),
    });
  }

  @Get('/state/:id/cities')
  @HttpCode(HttpStatus.OK)
  async findStateCities(@Param() { id }: IdDto) {
    return new SuccessResponse({
      data: await this.zonesService.getCities(Number(id)),
    });
  }

  @Get('/city/:id')
  @HttpCode(HttpStatus.OK)
  async findCities(@Param() { id }: IdDto) {
    return new SuccessResponse({
      data: await this.zonesService.getCity(Number(id)),
    });
  }
}
