import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  async afterInsert(event: InsertEvent<any>) {
    const entity = event.entity as { id?: string };
    const metadata = event.metadata;

    if (metadata.name === 'Audit' || !entity?.id) return;

    await event.manager.insert('audit_logs', {
      user_id: null,
      action: 'INSERT',
      entity: metadata.name,
      entity_id: entity.id,
      new_values: this.sanitizeEntity(event.entity),
    });
  }

  async afterUpdate(event: UpdateEvent<any>) {
    const entity = event.entity as { id?: string };
    const metadata = event.metadata;

    if (metadata.name === 'Audit' || !entity?.id) return;

    await event.manager.insert('audit_logs', {
      user_id: null,
      action: 'UPDATE',
      entity: metadata.name,
      entity_id: entity.id,
      old_values: this.sanitizeEntity(event.databaseEntity),
      new_values: this.sanitizeEntity(event.entity),
    });
  }

  async afterRemove(event: RemoveEvent<any>) {
    const entity = event.databaseEntity as { id?: string };
    const metadata = event.metadata;

    if (metadata.name === 'Audit' || !entity?.id) return;

    await event.manager.insert('audit_logs', {
      user_id: null,
      action: 'DELETE',
      entity: metadata.name,
      entity_id: entity.id,
      old_values: this.sanitizeEntity(event.databaseEntity),
    });
  }

  private sanitizeEntity(entity: unknown) {
    if (!entity) return undefined;
    const sanitized = { ...(entity as Record<string, unknown>) };
    delete sanitized['password'];
    delete sanitized['salt'];
    return sanitized;
  }
}
