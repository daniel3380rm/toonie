import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { JwtGuard } from '../../domain-auth/authentications/guards/jwt.guard';
import { Public } from '../../domain-auth/authentications/decorators/public.decorator';

@ApiTags('Files')
@Controller({
  path: 'files',
  version: '1',
})
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    return this.filesService.uploadFile(file);
  }

  @Public()
  @Get(':uuid')
  async download(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Response() response: any,
  ) {
    const file = await this.filesService.getFileById(uuid);
    if (!file) {
      throw new NotFoundException('file.NOT_FOUND');
    }
    return response.sendFile(file.path, { root: './files/' });
  }
}
