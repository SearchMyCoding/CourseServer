import { Module } from '@nestjs/common';
import { BatchService } from './batch.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Course } from 'src/entities/course.entity';
import { CourseCategory } from 'src/entities/coursecategory.entity';
import { CourseModule } from 'src/course/course.module';
import { CategoryModule } from 'src/category/category.module';
import { CoursecategoryModule } from 'src/coursecategory/coursecategory.module';
import { InflearnScrapper } from './inflearn-scrapper';

@Module({
  imports:[
    TypeOrmModule.forFeature([CourseCategory, Course, Category]),
    CourseModule, CategoryModule, CoursecategoryModule
  ],
  providers: [BatchService, InflearnScrapper]
})
export class BatchModule {}
