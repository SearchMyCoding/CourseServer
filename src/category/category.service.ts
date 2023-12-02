import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from 'src/dto/CreateCategory.dto';
import { UpdateCategoryDto } from 'src/dto/UpdateCategory.dto';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository : Repository<Category>
    ){}

    async getAllCategory() : Promise<Category[]>{
        return await this.categoryRepository.find();
    }

    async getOneCategoryById(categoryId : number) : Promise<Category>{
        const FoundCategory : Category = await this.categoryRepository.findOne({id : categoryId})
        return FoundCategory;
    }
    
    async getCategoryListByIdList(categoryIdList : number[]) : Promise<Category[]>{
        const FoundCategory : Category[] = await this.categoryRepository
                .createQueryBuilder('clbil')
                .where("id in (:...array)", {array : categoryIdList})
                .getMany();
        return FoundCategory;
    }

    async getOneCategoryByName(categoryName : string) : Promise<Category>{
        const FoundCategory : Category = await this.categoryRepository.findOne({name : categoryName});
        return FoundCategory;
    }

    async createCategory(createCategoryDto : CreateCategoryDto) : Promise<void>{
        const {name} = createCategoryDto;
        const [category, newCategory] : Category[] = await Promise.all([
            this.getOneCategoryByName(name),
            this.categoryRepository.create({
                name : name
            })
        ]);
        if(category)
            throw new BadRequestException(`Category with Name ${name} exists.`);
        await this.categoryRepository.insert(newCategory);
    }

    async patchCategory(categoryName : string, updateCategoryDto : UpdateCategoryDto) : Promise<void>{
        try{
            await this.getOneCategoryByName(categoryName);
        }catch(err){
            throw err;
        }
        await this.categoryRepository.update({name : categoryName},updateCategoryDto);
    }
}
