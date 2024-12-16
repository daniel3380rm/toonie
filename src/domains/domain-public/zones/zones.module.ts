import { Module } from '@nestjs/common';
import { DataReader } from './dataReader';
import { ZonesController } from './zones.controller';
import { ZonesService } from './zones.service';

@Module({
  imports: [],
  controllers: [ZonesController],
  providers: [ZonesService, DataReader],
  exports: [ZonesService],
})
export class ZonesModule {}
