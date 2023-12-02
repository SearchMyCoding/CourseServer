import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Course } from 'src/entities/course.entity';
import { CreateCourseDto } from 'src/dto/CreateCourse.dto';
import { UpdateCourseDto } from 'src/dto/UpdateCourse.dto';
import { convertFormat, convertValidURI, IsValidRating, IsValidURI } from 'src/utils/format';

@Injectable()
export class CourseService {
    constructor(
        @InjectRepository(Course)
        private readonly courseRepository : Repository<Course>
    ){}

    async getAllCourse() : Promise<Course[]>{
        return await this.courseRepository.find();
    }

    async getOneCourseById(courseId : number) : Promise<Course>{
        const FoundCourse : Course = await this.courseRepository.findOne({id : courseId});
        return FoundCourse;
    }

    async getCourseList(listNumber : number, numberOfCourseInList : number, order : 'asc' | 'desc' | undefined | null) : Promise<Course[]>{
        const findOption : FindManyOptions<Course> = {
            skip : (listNumber - 1) * numberOfCourseInList,
            take : numberOfCourseInList
        }
        findOption.order = order === 'desc' ? {title : 'DESC', id : 'ASC'} : {title : 'ASC', id : 'ASC'};

        const FoundCourse : Course[] = await this.courseRepository.find(findOption);
        return FoundCourse;
    }

    async getCourseListByIdList(idList : number[]) : Promise<Course[]>{
        const FoundCourse : Course[] = await this.courseRepository
            .createQueryBuilder('clbil')
            .where("id in (:...array)", {array : idList})
            .getMany();
        return FoundCourse;
    }

    async getOneCourseByTitle(courseTitle : string) : Promise<Course>{
        const FoundCourse : Course = await this.courseRepository.findOne({title : courseTitle});
        return FoundCourse;
    }

    async createCourse(createCourseDto : CreateCourseDto) : Promise<void>{
        const [validURI, validIMG_URI] = convertFormat(createCourseDto.link, createCourseDto.img_link);

        if(!IsValidURI(validURI))
            throw new BadRequestException(`Bad Format`);
        
        const newCreateCourseDto : CreateCourseDto = {
            title : createCourseDto.title,
            author : createCourseDto.author,
            link : validURI,
            price : createCourseDto.price,
            img_link : IsValidURI(validIMG_URI) ? validIMG_URI : null,
            rating : IsValidRating(createCourseDto.rating) ? Math.floor(createCourseDto.rating) : null
        }

        const [course, newCourse] : Course[] = await Promise.all([
            this.getOneCourseByTitle(newCreateCourseDto.title),
            this.courseRepository.create(newCreateCourseDto)
        ]);
        if(course){
            throw new BadRequestException(`Course with Title ${newCreateCourseDto.title} exists.`);
        }
        await this.courseRepository.insert(newCourse);
    }

    async patchCourse(courseTitle : string, updateCourseDto : UpdateCourseDto) : Promise<void>{
        const course : Course = await this.getOneCourseByTitle(courseTitle);
        if(!course)
            throw new NotFoundException(`Course with Title ${courseTitle} does not exists`);
        const [validURI, validIMG_URI] = convertFormat(updateCourseDto.link, updateCourseDto.img_link);
        
        if(
            (validURI !== null && !IsValidURI(validURI)) ||
            (validIMG_URI !== null && !IsValidURI(validIMG_URI))
        )
            throw new BadRequestException(`Bad Format`);

        await this.courseRepository.update({title : courseTitle},updateCourseDto);
    }
}
