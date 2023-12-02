import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateCourseCategoryDto } from 'src/dto/CreateCourseCatgory.dto';
import { UpdateCourseCategoryDto } from 'src/dto/UpdateCourseCatgory.dto';
import { Category } from 'src/entities/category.entity';
import { Course } from 'src/entities/course.entity';
import { CourseCategoryService } from './coursecategory.service';

@Controller('coursecategory')
export class CoursecategoryController {
    constructor(
        private readonly coursecategoryService : CourseCategoryService
    ){}

    @Get('/course/id/:categoryId')
    @ApiOperation({
        "summary" : "카테고리 id에 해당하는 강의 id 리스트를 조회하는 요청",
        "description" : "카테고리 id에 해당하는 강의들의 id를 배열 형태로 반환한다."
    })
    async getCourseIdListByCategoryId(@Param("categoryId") categoryId : number) : Promise<number[]>{
        return await this.coursecategoryService.getCourseIdListByCategoryId(categoryId);
    }

    @Get('/category/id/:courseId')
    @ApiOperation({
        "summary" : "강의 id에 해당하는 카테고리 id 리스트를 조회하는 요청",
        "description" : "강의 id에 해당하는 카테고리들의 id를 배열 형태로 반환한다."
    })
    async getCategoryIdListByCourseId(@Param('courseId') courseId : number) : Promise<number[]>{
        return await this.coursecategoryService.getCategoryIdListByCourseId(courseId);
    }

    @Get('/course/name/:categoryName')
    @ApiOperation({
        "summary" : "카테고리 이름에 해당하는 강의 리스트를 조회하는 요청",
        "description" : "카테고리 이름에 해당하는 강의들을 배열 형태로 반환한다."
    })
    async getCourseListByCategoryName(@Param('categoryName') categoryName : string) : Promise<Course[]>{
        return await this.coursecategoryService.getCourseListByCategoryName(categoryName);
    }
    
    @Get('/category/title/:courseTitle')
    @ApiOperation({
        "summary" : "강의 제목에 해당하는 카테고리 리스트를 조회하는 요청",
        "description" : "강의 제목에 해당하는 카테고리들을 배열 형태로 반환한다."
    })
    async getCategoryListByCourseTitle(@Param('courseTitle') courseTitle : string) : Promise<Category[]>{
        return await this.coursecategoryService.getCategoryListByCourseTitle(courseTitle);
    }

    @Post()
    @ApiOperation({
        "summary":"강의와 카테고리의 관계를 생성하는 요청",
        "description":"body를 CreateCourseCategoryDto에 맞춰 요청해야한다."
    })
    async createCourseCategory(@Body() createCourseCategory: CreateCourseCategoryDto) : Promise<void>{
        return await this.coursecategoryService.createCourseCategory(createCourseCategory);
    }

    @Patch('/course')
    @ApiOperation({
        "summary" : "카테고리와 강의 id를 이용하여 강의의 id를 수정하는 요청",
        "description" : "강의가 존재하여야 하며 body를 UpdateCourseCategoryDto에 맞춰 요청해야한다."
    })
    async patchCourseId(@Body() updateCourseCategoryDto: UpdateCourseCategoryDto) : Promise<void>{
        return await this.coursecategoryService.patchCourseId(updateCourseCategoryDto);
    }

    @Patch('/category')
    @ApiOperation({
        "summary" : "카테고리와 강의 id를 이용하여 카테고리의 id를 수정하는 요청",
        "description" : "카테고리가 존재하여야 하며 body를 UpdateCourseCategoryDto에 맞춰 요청해야한다."
    })
    async patchCategoryId(@Body() updateCourseCategoryDto: UpdateCourseCategoryDto) : Promise<void>{
        return await this.coursecategoryService.patchCategoryId(updateCourseCategoryDto);
    }

}
