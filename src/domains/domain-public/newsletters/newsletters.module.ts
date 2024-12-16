import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewslettersController } from './controllers/newsletters.controller';
import { NewslettersEntity } from './entities/newsletters.entity';
import { NewslettersService } from './services/newsletters.service';

@Module({
  imports: [TypeOrmModule.forFeature([NewslettersEntity])],
  controllers: [NewslettersController],
  providers: [NewslettersService],
  exports: [TypeOrmModule],
})
export class NewslettersModule {}
