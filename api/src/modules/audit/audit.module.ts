import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Audit } from './audit.entity';
import { AuditService } from './audit.service';
import { AuditSubscriber } from './audit.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Audit])],
  providers: [AuditService, AuditSubscriber],
  exports: [AuditService, AuditSubscriber],
})
export class AuditModule {}
