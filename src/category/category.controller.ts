import { Body, Controller, Get, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateCategoryDto } from 'src/dto/CreateCategory.dto';
import { SelectNumberArrayDto } from 'src/dto/SelectNumberArray.dto';
import { UpdateCategoryDto } from 'src/dto/UpdateCategory.dto';
import { Category } from 'src/entities/category.entity';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService : CategoryService
    ){}

    @Get('/all')
    @ApiOperation({
        "summary" : "모든 카테고리 조회하는 요청",
        "description" : "모든 카테고리 배열 형태로 반환한다."
    })
    async getAllCategory() : Promise<Category[]>{
        return await this.categoryService.getAllCategory();
    }

    @Get('/id/:id')
    @ApiOperation({
        "summary" : "Id를 이용한 카테고리 조회하는 요청",
        "description" : "Id를 이용하여 카테고리을 조회하고 json 형태로 반환한다.(단, 이름에 맞는 카테고리을 찾지 못한다면 에러를 반환한다.)"
    })
    async getOneCategoryById(@Param("id") categoryId : number) : Promise<Category>{
        return await this.categoryService.getOneCategoryById(categoryId);
    }

    @Get('/list')
    @ApiOperation({
        "summary" : "Id List에 해당하는 카테고리 리스트를 조회하는 요청",
        "description" : "Id List에 해당하는 카테고리들을 배열 형태로 반환한다."
    })
    async getCategoryListByIdList(@Query(new ValidationPipe({ transform: true })) query : SelectNumberArrayDto) : Promise<Category[]>{
        return await this.categoryService.getCategoryListByIdList(query.numberString);
    }

    @Get('/name/:name')
    @ApiOperation({
        "summary" : "이름을 이용한 카테고리 조회하는 요청",
        "description" : "이름을 이용하여 카테고리을 조회하고 json 형태로 반환한다.(단, 이름에 맞는 카테고리을 찾지 못한다면 에러를 반환한다.)"
    })
    async getOneCategoryByName(@Param("name") categoryName : string) : Promise<Category>{
        return await this.categoryService.getOneCategoryByName(categoryName);
    }

    @Post('')
    @ApiOperation({
        "summary":"카테고리을 생성하는 요청",
        "description":"body를 CreateCategoryDto에 맞춰 요청해야한다."
    })
    async createCategory(@Body() createCategoryDto : CreateCategoryDto){
        return this.categoryService.createCategory(createCategoryDto);
    }

    @Patch(':name')
    @ApiOperation({
        "summary" : "이름을 이용하여 카테고리의 일부를 수정하는 요청",
        "description" : "카테고리가 존재하여야 하며 body를 UpdateCategoryDto에 맞춰 요청해야한다."
    })
    async patchCategory(@Param('name') categoryName : string, @Body() updateCategoryDto : UpdateCategoryDto){
        return this.categoryService.patchCategory(categoryName, updateCategoryDto);
    }
}
