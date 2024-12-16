import { Module } from '@nestjs/common';
import { ZonesModule } from './zones/zones.module';
import { NewslettersModule } from './newsletters/newsletters.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [FilesModule, ZonesModule, NewslettersModule],
})
export class DomainPublicModule {}
