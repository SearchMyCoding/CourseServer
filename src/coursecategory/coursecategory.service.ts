import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';
import { CourseService } from 'src/course/course.service';
import { CreateCourseCategoryDto } from 'src/dto/CreateCourseCatgory.dto';
import { UpdateCourseCategoryDto } from 'src/dto/UpdateCourseCatgory.dto';
import { Category } from 'src/entities/category.entity';
import { Course } from 'src/entities/course.entity';
import { CourseCategory } from 'src/entities/coursecategory.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class CourseCategoryService {
    constructor(
        @InjectRepository(CourseCategory)
        private readonly coursecategoryRepository : Repository<CourseCategory>,
        private readonly courseService : CourseService,
        private readonly categoryService : CategoryService
    ){}

    async getCategoryIdListByCourseId(courseId : number) : Promise<number[]> {
        const FoundList : CourseCategory[] = await this.coursecategoryRepository.find({
            select: ["id", "course", "category"],
            where : {course : courseId},
            loadRelationIds : {
                relations: ["course", "category"]
            }
        });

        const FoundCategoryIdList : number[] = FoundList.map((coursecategoryObj)=>coursecategoryObj.category).sort((a,b)=>a-b);
        return FoundCategoryIdList;
    }

    async getCourseIdListByCategoryId(categoryId : number) : Promise<number[]> {
        const FoundList : CourseCategory[] = await this.coursecategoryRepository.find({
            select: ["id", "course", "category"],
            where : {category : categoryId},
            loadRelationIds : {
                relations: ["course", "category"]
            }
        });

        const FoundCourseIdList : number[] = FoundList.map((coursecategoryObj)=>coursecategoryObj.course).sort((a,b)=>a-b);
        return FoundCourseIdList;
    }

    async getCourseListByCategoryName(categoryName : string, page : number = 1, perPage : number = 10) : Promise<Course[]>{
        const FoundCategory : Category = await this.categoryService.getOneCategoryByName(categoryName);

        const CourseList : CourseCategory[] = await this.coursecategoryRepository.find({
            select: ["id", "course", "category"],
            where : {category : FoundCategory.id},
            loadRelationIds : {
                relations: ["course", "category"]
            },
            take : perPage,
            skip : perPage * (page - 1)
        });
        

        const FoundCourseIdList : number[] = CourseList.map((coursecategoryObj)=> coursecategoryObj.course).sort((a,b)=>a-b);
        const FoundCourseList : Course[] = await this.courseService.getCourseListByIdList(FoundCourseIdList);
        return FoundCourseList;
    }

    async getCategoryListByCourseTitle(courseTitle : string, page : number = 1, perPage : number = 10) : Promise<Category[]>{
        const FoundCourse : Course = await this.courseService.getOneCourseByTitle(courseTitle);

        const CategoryList : CourseCategory[] = await this.coursecategoryRepository.find({
            select: ["id", "course", "category"],
            where : {course : FoundCourse.id},
            loadRelationIds : {
                relations: ["course", "category"]
            },
            take : perPage,
            skip : perPage * (page - 1)
        });
        

        const FoundCategoryIdList : number[] = CategoryList.map((categoryObj)=>categoryObj.category).sort((a,b)=>a-b);
        const FoundCategoryList : Category[] = await this.categoryService.getCategoryListByIdList(FoundCategoryIdList);
        return FoundCategoryList;
    }

    async createCourseCategory(createCourseCategory : CreateCourseCategoryDto) : Promise<void>{
        const [course, category] : [Course, Category] = await Promise.all([
            this.courseService.getOneCourseById(createCourseCategory.courseId),
            this.categoryService.getOneCategoryById(createCourseCategory.categoryId)
        ]);
        if(!course)
            throw new NotFoundException(`Course with Id ${createCourseCategory.courseId} does not exists`);
        if(!category)
            throw new NotFoundException(`Category with Id ${createCourseCategory.categoryId} does not exists`);

        const FoundCourseCategory : CourseCategory = await this.coursecategoryRepository.findOne({category : createCourseCategory.categoryId, course : createCourseCategory.courseId});
        if(!!FoundCourseCategory)
            throw new BadRequestException(`CourseCategory exists.`);
        const newCourseCategory : CourseCategory = this.coursecategoryRepository.create({
            course : course.id,
            category : category.id
        });
        
        await this.coursecategoryRepository.insert(newCourseCategory);
    }

    async patchCourseId(updateCourseCategoryDto : UpdateCourseCategoryDto) : Promise<void>{
        if(updateCourseCategoryDto.modified !== 'course')
            throw new BadRequestException(`It's wrong request. You cannot modify ${updateCourseCategoryDto.modified}.`);
        
        const [FoundCategory, FoundCourse, FoundCourseToModify] : [Category, Course, Course] = await Promise.all([
            this.categoryService.getOneCategoryById(updateCourseCategoryDto.categoryId),
            this.courseService.getOneCourseById(updateCourseCategoryDto.courseId),
            this.courseService.getOneCourseById(updateCourseCategoryDto.idToModify)
        ]);

        
        const FoundCourseCategory : CourseCategory = await this.coursecategoryRepository.findOne({category : FoundCategory.id, course : FoundCourse.id});
        if(!FoundCourseCategory)
            throw new NotFoundException(`CourseCategory is not found.`);

        await this.coursecategoryRepository.update({category : FoundCategory.id, course : FoundCourse.id}, {course : FoundCourseToModify.id});
    }

    async patchCategoryId(updateCourseCategoryDto : UpdateCourseCategoryDto) : Promise<void>{
        if(updateCourseCategoryDto.modified !== 'category')
            throw new BadRequestException(`It's wrong request. You cannot modify ${updateCourseCategoryDto.modified}.`);

        const [FoundCategory, FoundCourse, FoundCategoryToModify] : [Category, Course, Category] = await Promise.all([
            this.categoryService.getOneCategoryById(updateCourseCategoryDto.categoryId),
            this.courseService.getOneCourseById(updateCourseCategoryDto.courseId),
            this.categoryService.getOneCategoryById(updateCourseCategoryDto.idToModify)
        ]);
        
        const FoundCourseCategory : CourseCategory = await this.coursecategoryRepository.findOne({category : FoundCategory.id, course : FoundCourse.id});
        if(!FoundCourseCategory)
            throw new NotFoundException(`CourseCategory is not found.`);

        await this.coursecategoryRepository.update({category : FoundCategory.id, course : FoundCourse.id}, {course : FoundCategoryToModify.id});
    }
}
