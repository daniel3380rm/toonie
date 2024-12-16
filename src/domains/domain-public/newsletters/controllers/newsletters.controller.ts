import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NewslettersDto } from '../dto/newsletters.dto';
import { NewslettersService } from '../services/newsletters.service';
import { Public } from '../../../domain-auth/authentications/decorators/public.decorator';
import { SuccessResponse } from '../../../../common/dto/response/success.response';

@ApiTags('Newsletters')
@Controller({
  path: 'public/newsletters',
  version: '1',
})
export class NewslettersController {
  constructor(private newslettersService: NewslettersService) {}

  @Public()
  @Post()
  async create(@Body() newslettersDto: NewslettersDto) {
    await this.newslettersService.create(newslettersDto);
    return new SuccessResponse({ data: null, message: 'success' });
  }
}
