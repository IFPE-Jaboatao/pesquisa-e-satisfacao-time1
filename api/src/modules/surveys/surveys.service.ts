import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';

import { Survey } from './schemas/survey.schema';
import { Answer } from './schemas/answer.schema';
import { AccessToken } from './schemas/access-token.schema';

import { CreateSurveyDto } from './dtos/create-survey.dto';
import { ListSurveysDto } from './dtos/list-surveys.dto';
import { UpdateSurveyDto } from './dtos/update-survey.dto';
import { Campus } from '../catalog/campus/campus.entity';
import { Repository } from 'typeorm';
import { Course } from '../catalog/courses/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  SurveyAnswerResponse,
  SurveyOption,
  SurveyQuestion,
} from './types/survey-question.type';

@Injectable()
export class SurveysService {
  constructor(
    @InjectModel(Survey.name) private surveyModel: Model<Survey>,
    @InjectModel(Answer.name) private answerModel: Model<Answer>,
    @InjectModel(AccessToken.name) private tokenModel: Model<AccessToken>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(Campus)
    private readonly campusRepository: Repository<Campus>,
  ) {}

  async findAll(filters: ListSurveysDto) {
    const { page = 1, limit = 10, ...rest } = filters;

    const query: Record<string, any> = {
      deleted: false,
    };

    if (rest.title) {
      query.title = { $regex: rest.title, $options: 'i' };
    }

    if (rest.campus_id) {
      query.campus_id = rest.campus_id;
    }

    if (rest.course_id) {
      query.course_id = rest.course_id;
    }

    if (typeof rest.is_anonymous === 'boolean') {
      query.is_anonymous = rest.is_anonymous;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.surveyModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),

      this.surveyModel.countDocuments(query),
    ]);

    for (const survey of data) {
      const previousStatus = survey.active;

      this.updateSurveyStatus(survey);

      if (previousStatus !== survey.active) {
        await survey.save();
      }
    }

    return {
      data: data.map((survey) => ({
        ...survey.toObject(),
        _id: survey._id.toString(),
      })),

      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const survey = await this.surveyModel.findOne({
      _id: id,
      deleted: false,
    });

    if (!survey) {
      throw new NotFoundException('Survey não encontrado');
    }

    const previousStatus = survey.active;

    this.updateSurveyStatus(survey);

    if (previousStatus !== survey.active) {
      await survey.save();
    }

    return {
      ...survey.toObject(),
      _id: survey._id.toString(),
    };
  }

  async create(data: CreateSurveyDto) {
    const startDate = this.parseCustomDate(data.start_date);

    const endDate = this.parseCustomDate(data.end_date);

    this.validateSurveyDates(startDate, endDate);

    const campus = await this.campusRepository.findOneBy({
      id: data.campus_id,
    });

    if (!campus) {
      throw new BadRequestException('Campus nao encontrado');
    }

    const course = await this.courseRepository.findOneBy({
      id: data.course_id,
    });

    if (!course) {
      throw new BadRequestException('Curso nao encontrado');
    }

    const questions = data.questions.map((q) => ({
      ...q,
      id: randomUUID(),
    }));

    const createdSurvey = await this.surveyModel.create({
      ...data,
      start_date: startDate,
      end_date: endDate,
      questions,
    });

    const survey = {
      ...createdSurvey.toObject(),
      _id: createdSurvey._id.toString(),
    };

    let link: string | null = null;

    if (data.is_anonymous) {
      const token = randomUUID();

      await this.tokenModel.create({
        survey_id: survey._id,
        token,
        expires_at: endDate,
      });

      link = `/surveys/public/${token}`;
    }

    return {
      survey,
      anonymous_link: link,
    };
  }

  async update(id: string, data: UpdateSurveyDto) {
    const survey = await this.surveyModel.findOne({
      _id: id,
      deleted: false,
    });

    if (!survey) {
      throw new NotFoundException('Survey não encontrado');
    }

    if (data.questions) {
      data.questions = data.questions.map((q) => ({
        ...q,
        id: 'id' in q ? q.id : randomUUID(),
      }));
    }

    Object.assign(survey, data);

    await survey.save();

    return survey;
  }

  async getPublicSurvey(token: string) {
    const access = await this.tokenModel.findOne({ token });

    if (!access) {
      throw new NotFoundException('Link inválido ou expirado');
    }

    const survey = await this.surveyModel.findById(access.survey_id.toString());

    if (!survey) {
      throw new NotFoundException('Survey não encontrado');
    }

    return survey;
  }

  async answer(
    surveyId: string,
    responses: SurveyAnswerResponse[],
    userId?: string,
  ) {
    const survey = await this.surveyModel.findById(surveyId);

    if (!survey) {
      throw new NotFoundException('Survey não encontrado');
    }

    const previousStatus = survey.active;

    this.updateSurveyStatus(survey);

    if (previousStatus !== survey.active) {
      await survey.save();
    }

    if (!survey.active) {
      throw new BadRequestException(
        'Esta pesquisa está encerrada e não aceita mais respostas',
      );
    }

    if (!survey.is_anonymous && !userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    if (!survey.is_anonymous && userId) {
      const alreadyAnswered = await this.answerModel.findOne({
        survey_id: surveyId,
        user_id: userId,
      });

      if (alreadyAnswered) {
        throw new BadRequestException('Você já respondeu esta pesquisa');
      }
    }

    this.validateResponses(survey, responses);

    return this.answerModel.create({
      survey_id: surveyId,
      user_id: survey.is_anonymous ? undefined : userId,
      responses,
    });
  }

  async softDelete(id: string) {
    const survey = await this.surveyModel.findOne({
      _id: id,
      deleted: false,
    });

    if (!survey) {
      throw new NotFoundException('Survey não encontrado');
    }

    survey.deleted = true;
    survey.deleted_at = new Date();

    await survey.save();
  }

  private validateResponses(
    survey: Survey,
    responses: SurveyAnswerResponse[],
  ): void {
    const duplicatedQuestions = responses.filter(
      (response, index, self) =>
        self.findIndex((item) => item.question_id === response.question_id) !==
        index,
    );

    if (duplicatedQuestions.length > 0) {
      throw new BadRequestException(
        'Existem questões respondidas duplicadamente',
      );
    }

    for (const response of responses) {
      const questionExists = survey.questions.some(
        (question) => question.id === response.question_id,
      );

      if (!questionExists) {
        throw new BadRequestException(
          `Questão ${response.question_id} não pertence à pesquisa`,
        );
      }
    }

    for (const question of survey.questions) {
      const response = responses.find((r) => r.question_id === question.id);

      if (question.required && !response) {
        throw new BadRequestException(
          `A questão "${question.title}" é obrigatória`,
        );
      }

      if (!response) {
        continue;
      }

      const answer = response.answer;

      switch (question.type) {
        case 'TEXT':
          if (typeof answer !== 'string') {
            throw new BadRequestException(
              `A questão "${question.title}" deve ser texto`,
            );
          }
          break;

        case 'SINGLE_CHOICE':
          this.validateSingleChoice(question, answer);
          break;

        case 'MULTIPLE_CHOICE':
          this.validateMultipleChoice(question, answer);
          break;

        case 'SCALE':
          this.validateScale(question, answer);
          break;
      }
    }
  }

  private validateSingleChoice(
    question: SurveyQuestion,
    answer: unknown,
  ): void {
    if (typeof answer !== 'string') {
      throw new BadRequestException(
        `Resposta inválida para "${question.title}"`,
      );
    }

    const validOption = question.options?.some(
      (option: SurveyOption) => option.value === answer,
    );

    if (!validOption) {
      throw new BadRequestException(`Opção inválida para "${question.title}"`);
    }
  }

  private validateMultipleChoice(
    question: SurveyQuestion,
    answer: unknown,
  ): void {
    if (!Array.isArray(answer)) {
      throw new BadRequestException(
        `Resposta inválida para "${question.title}"`,
      );
    }

    const validValues: string[] =
      question.options?.map((option: SurveyOption) => option.value) ?? [];

    for (const value of answer) {
      if (typeof value !== 'string') {
        throw new BadRequestException(
          `Resposta inválida para "${question.title}"`,
        );
      }

      if (!validValues.includes(value)) {
        throw new BadRequestException(`Opção inválida em "${question.title}"`);
      }
    }
  }

  private validateScale(question: SurveyQuestion, answer: unknown): void {
    if (typeof answer !== 'number') {
      throw new BadRequestException(
        `Resposta inválida para "${question.title}"`,
      );
    }

    const min = question.scale?.min;
    const max = question.scale?.max;

    if (min === undefined || max === undefined) {
      throw new BadRequestException(`Escala inválida para "${question.title}"`);
    }

    if (answer < min || answer > max) {
      throw new BadRequestException(
        `A resposta da questão "${question.title}" deve estar entre ${min} e ${max}`,
      );
    }
  }

  private validateSurveyDates(startDate: Date, endDate: Date) {
    const now = new Date();

    const maxDate = new Date();

    maxDate.setFullYear(maxDate.getFullYear() + 1);

    if (startDate.getTime() < now.getTime()) {
      throw new BadRequestException(
        'A data/hora de início não pode ser menor que a atual',
      );
    }

    if (endDate.getTime() < startDate.getTime()) {
      throw new BadRequestException(
        'A data/hora de término não pode ser menor que a inicial',
      );
    }

    if (endDate.getTime() > maxDate.getTime()) {
      throw new BadRequestException(
        'A data/hora de término não pode ultrapassar 1 ano',
      );
    }
  }

  private updateSurveyStatus(survey: Survey) {
    const now = new Date();

    const startDate = new Date(survey.start_date);
    const endDate = new Date(survey.end_date);

    survey.active =
      now.getTime() >= startDate.getTime() &&
      now.getTime() <= endDate.getTime();
  }

  private parseCustomDate(date: string): Date {
    const regex = /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})$/;

    const match = regex.exec(date);

    if (!match) {
      throw new BadRequestException('Formato de data inválido');
    }

    const [, day, month, year, hour, minute] = match;

    const parsedDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
    );

    if (
      parsedDate.getDate() !== Number(day) ||
      parsedDate.getMonth() !== Number(month) - 1 ||
      parsedDate.getFullYear() !== Number(year) ||
      parsedDate.getHours() !== Number(hour) ||
      parsedDate.getMinutes() !== Number(minute)
    ) {
      throw new BadRequestException('Data/hora inválida');
    }

    return parsedDate;
  }

  async getAnonymousLink(surveyId: string) {
    const survey = await this.surveyModel.findOne({
      _id: surveyId,
      deleted: false,
    });

    if (!survey) {
      throw new NotFoundException('Survey não encontrado');
    }

    if (!survey.is_anonymous) {
      throw new BadRequestException('Esta pesquisa não é anônima');
    }

    const token = await this.tokenModel.findOne({
      survey_id: surveyId,
    });

    if (!token) {
      throw new NotFoundException('Link anônimo não encontrado');
    }

    return {
      anonymous_link: `/surveys/public/${token.token}`,
    };
  }
}
