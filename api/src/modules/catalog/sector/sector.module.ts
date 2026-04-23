import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Sector } from './sector.entity';
import { SectorService } from './sector.service';
import { SectorController } from './sector.controller';
import { Campus } from '../campus/campus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sector, Campus])],
  controllers: [SectorController],
  providers: [SectorService],
  exports: [SectorService],
})
export class SectorModule {}
