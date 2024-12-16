import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewslettersEntity } from '../entities/newsletters.entity';
import { NewslettersDto } from '../dto/newsletters.dto';

@Injectable()
export class NewslettersService {
  constructor(
    @InjectRepository(NewslettersEntity)
    private newslettersRepository: Repository<NewslettersEntity>,
  ) {}

  async create(newslettersDto: NewslettersDto) {
    return await this.newslettersRepository.save(newslettersDto);
  }
}
