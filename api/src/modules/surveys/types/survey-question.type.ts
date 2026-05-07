export interface SurveyOption {
  label: string;
  value: string;
}

export interface SurveyScale {
  min: number;
  max: number;
}

export type SurveyQuestionType =
  | 'TEXT'
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE'
  | 'SCALE';

export interface SurveyQuestion {
  id: string;
  title: string;
  type: SurveyQuestionType;
  required: boolean;

  options?: SurveyOption[];

  scale?: SurveyScale;
}

export interface SurveyAnswerResponse {
  question_id: string;
  answer: unknown;
}
