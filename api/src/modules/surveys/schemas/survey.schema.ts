import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SurveyQuestion } from '../types/survey-question.type';

@Schema({ timestamps: true })
export class Survey {
  @Prop({ required: true })
  title!: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  campus_id!: string;

  @Prop({ required: true })
  course_id!: string;

  @Prop({ required: true })
  service_id!: string;

  @Prop({ default: false })
  is_anonymous!: boolean;

  @Prop({ default: true })
  active!: boolean;

  @Prop({ type: Array, required: true })
  questions!: SurveyQuestion[];

  @Prop({ default: false })
  deleted!: boolean;

  @Prop()
  deleted_at?: Date;

  @Prop({ required: true })
  start_date!: Date;

  @Prop({ required: true })
  end_date!: Date;

  createdAt!: Date;

  updatedAt!: Date;
}

export const SurveySchema = SchemaFactory.createForClass(Survey);
