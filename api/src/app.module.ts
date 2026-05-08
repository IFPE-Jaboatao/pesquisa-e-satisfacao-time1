import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from './database/typeorm';
import { UsersModule } from './modules/users/users.module';
import { SeedModule } from './database/seeds/seed.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { AuthModule } from './modules/auth/auth.module';
import { CampusModule } from './modules/catalog/campus/campus.module';
import { AuditModule } from './modules/audit/audit.module';
import { CoursesModule } from './modules/catalog/courses/courses.module';
import { ClassesModule } from './modules/catalog/classes/classes.module';
import { ServicesModule } from './modules/catalog/services/services.module';
import { SurveysModule } from './modules/surveys/surveys.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm')!,
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),

    AuthModule,
    AuditModule,
    CampusModule,
    CoursesModule,
    ClassesModule,
    ServicesModule,
    UsersModule,
    ProfilesModule,
    SurveysModule,
    SeedModule,
  ],
})
export class AppModule {}
