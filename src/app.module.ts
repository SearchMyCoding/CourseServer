import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { CourseModule } from './course/course.module';
import { CategoryModule } from './category/category.module';
import { CoursecategoryModule } from './coursecategory/coursecategory.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BatchModule } from './batch/batch.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeORMConfig),
    CourseModule,
    CategoryModule,
    CoursecategoryModule,
    ScheduleModule.forRoot(),
    BatchModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
