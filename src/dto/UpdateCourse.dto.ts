import { CreateCourseDto } from './CreateCourse.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCourseDto extends PartialType(CreateCourseDto){}