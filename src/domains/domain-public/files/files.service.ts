import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
  ) {}

  async uploadFile(file): Promise<FileEntity> {
    if (!file) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: 'selectFile',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const path = {
      local: `${file.filename}`,
    };

    return this.fileRepository.save(
      this.fileRepository.create({
        path: path[this.configService.get('file.driver')],
      }),
    );
  }

  async getFileById(uuid: string) {
    return await this.fileRepository.findOneBy({
      uuid,
    });
  }
}
