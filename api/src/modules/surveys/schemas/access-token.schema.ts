import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccessTokenDocument = HydratedDocument<AccessToken>;

@Schema({ timestamps: true })
export class AccessToken {
  @Prop({ required: true })
  survey_id!: string;

  @Prop({ required: true, unique: true })
  token!: string;

  @Prop({ required: true })
  expires_at!: Date;
}

export const AccessTokenSchema = SchemaFactory.createForClass(AccessToken);
