import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SurveyAnswerResponse } from '../types/survey-question.type';

export type AnswerDocument = HydratedDocument<Answer>;

@Schema({ timestamps: true })
export class Answer {
  @Prop({ required: true })
  survey_id!: string;

  @Prop()
  user_id?: string;

  @Prop({
    type: [
      {
        question_id: { type: String, required: true },
        answer: { type: Object, required: true },
      },
    ],
    required: true,
  })
  responses!: SurveyAnswerResponse[];
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
