import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'crypto';

import { Survey } from './schemas/survey.schema';

@Injectable()
export class SurveySeed {
  constructor(
    @InjectModel(Survey.name)
    private readonly surveyModel: Model<Survey>,
  ) {}

  async run() {
    const existing = await this.surveyModel.findOne({ title: 'Pesquisa de Satisfação - Biblioteca' });

    if (existing) return;

    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() + 7);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const surveys = [
      {
        title: 'Pesquisa de Satisfação - Biblioteca',
        description: 'Avalie os serviços da biblioteca',
        campus_id: '00000000-0000-0000-0000-000000000000',
        service_id: '00000000-0000-0000-0000-000000000000',
        is_anonymous: true,
        start_date: startDate,
        end_date: endDate,
        questions: [
          {
            id: randomUUID(),
            title: 'Como você avalia o atendimento?',
            type: 'SCALE' as const,
            required: true,
            scale: { min: 1, max: 5 },
          },
          {
            id: randomUUID(),
            title: 'O acervo atende suas necessidades?',
            type: 'SINGLE_CHOICE' as const,
            required: true,
            options: [
              { label: 'Sim', value: 'yes' },
              { label: 'Não', value: 'no' },
              { label: 'Parcialmente', value: 'partially' },
            ],
          },
          {
            id: randomUUID(),
            title: 'Quais serviços você mais utiliza?',
            type: 'MULTIPLE_CHOICE' as const,
            required: false,
            options: [
              { label: 'Empréstimo', value: 'loan' },
              { label: 'Consulta local', value: 'local_consult' },
              { label: 'Salão de estudos', value: 'study_room' },
              { label: 'Reprografia', value: 'copy' },
            ],
          },
          {
            id: randomUUID(),
            title: 'Deixe sua sugestão',
            type: 'TEXT' as const,
            required: false,
          },
        ],
      },
      {
        title: 'Pesquisa de Satisfação - Restaurante Acadêmico',
        description: 'Avalie o restaurante acadêmico',
        campus_id: '00000000-0000-0000-0000-000000000000',
        service_id: '00000000-0000-0000-0000-000000000000',
        is_anonymous: true,
        start_date: startDate,
        end_date: endDate,
        questions: [
          {
            id: randomUUID(),
            title: 'Qual sua nota para a qualidade da comida?',
            type: 'SCALE' as const,
            required: true,
            scale: { min: 1, max: 5 },
          },
          {
            id: randomUUID(),
            title: 'O ambiente é limpo e organizado?',
            type: 'SINGLE_CHOICE' as const,
            required: true,
            options: [
              { label: 'Sim', value: 'yes' },
              { label: 'Não', value: 'no' },
            ],
          },
          {
            id: randomUUID(),
            title: 'Sugestões de melhoria',
            type: 'TEXT' as const,
            required: false,
          },
        ],
      },
    ];

    for (const survey of surveys) {
      await this.surveyModel.create(survey);
      console.log(`Survey criada: ${survey.title}`);
    }
  }
}
