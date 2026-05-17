import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Class } from '../catalog/classes/classes.entity';
import { Enrollment } from '../catalog/classes/enrollment.entity';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Class, Enrollment]), ProfilesModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
