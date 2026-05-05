import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Audit, AuditAction } from './audit.entity';

export interface CreateAuditDto {
  userId: string | null;
  action: AuditAction;
  entity: string;
  entityId: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(Audit)
    private readonly auditRepository: Repository<Audit>,
  ) {}

  async log(data: CreateAuditDto): Promise<void> {
    const audit = this.auditRepository.create({
      user_id: data.userId ?? undefined,
      action: data.action,
      entity: data.entity,
      entity_id: data.entityId,
      old_values: data.oldValues,
      new_values: data.newValues,
    });

    await this.auditRepository.save(audit);
  }
}
