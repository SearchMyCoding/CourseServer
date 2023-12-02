import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCategoryDto } from 'src/dto/CreateCategory.dto';
import { UpdateCategoryDto } from 'src/dto/UpdateCategory.dto';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';
import { CategoryService } from './category.service';

const mockCategoryRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  insert: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockReturnThis()
    })
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: MockRepository<Category>;
  let mockCategory : Category;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide : getRepositoryToken(Category),
          useValue : mockCategoryRepository()
        },
      ],
    }).compile();

    
    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<MockRepository<Category>>(
      getRepositoryToken(Category),
    );

    mockCategory = {
      id : 1,
      name : 'web'
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllCategory',()=>{
    it('should find all category', async ()=>{
      categoryRepository.find.mockResolvedValue([]);

      const result = await service.getAllCategory();
      expect(categoryRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOneCategoryById',()=>{
    const findId : number = 1;
    const findErrorId : number = 9999;
    it('should find a category',async ()=>{
      categoryRepository.findOne.mockResolvedValue(mockCategory);

      const result = await service.getOneCategoryById(findId);
      expect(categoryRepository.findOne).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockCategory);
    });
  });

  describe('getCategoryListByIdList', ()=>{
    const randomListLength : number = Math.floor(Math.random() * 10) + 1;
    const findIdList : number[] = new Array<number>(randomListLength).fill(0).map((_,index)=>index+1);
    const mockCategoryList : Category[] = [{
      id : 1,
      name : 'web'
    }]
    it('should find category list', async ()=>{
      jest
        .spyOn(categoryRepository.createQueryBuilder(),'getMany')
        .mockResolvedValue(mockCategoryList);
      const result : Category[] = await service.getCategoryListByIdList(findIdList);
      expect(categoryRepository.createQueryBuilder().getMany).toHaveBeenCalled();

      expect(result.length).toEqual(mockCategoryList.length);
    })
  });

  describe('getOneCategoryByName',()=>{
    const findName : string = 'web';
    const findErrorName : string = 'app';
    it('should find a category',async ()=>{
      categoryRepository.findOne.mockResolvedValue(mockCategory);

      const result = await service.getOneCategoryByName(findName);
      expect(categoryRepository.findOne).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockCategory);
    });
  });
  
  describe('createCategory',()=>{
    const mockCreateCategoryDto : CreateCategoryDto = {
      name : 'web'
    };

    const mockErrorCreateCategoryDto = {
      name : 'app',
      link : 'www.example.abc'
    }
    
    it("should create a category", async () => {
      categoryRepository.find.mockResolvedValue([]);
      const BeforeCreate = (await service.getAllCategory()).length;
      expect(categoryRepository.find).toHaveBeenCalledTimes(1);
      
      const result = await service.createCategory(mockCreateCategoryDto);

      categoryRepository.find.mockResolvedValue([mockCategory]);
      const AfterCreate = (await service.getAllCategory()).length;
      expect(categoryRepository.find).toHaveBeenCalledTimes(2);

      expect(AfterCreate).toEqual(BeforeCreate + 1);
    });

    it("should return a BadRequestException", async () => {
      try{
        await service.createCategory(mockErrorCreateCategoryDto as CreateCategoryDto);
      }catch(e){
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('patchCategory',()=>{
    const mockFindName : string = 'web';
    const mockUpdateCategoryName : string = 'app';
    const mockErrorUpdateCategoryName : string = 'AI';
    const mockUpdateCategoryDto : UpdateCategoryDto = {
      name : 'app'
    }
    const mockUpdateCategory : Category = {
      id : 1,
      name : 'app'
    };

    const mockErrorUpdateCategoryDto = {
      name : 'app',
      link : 'www.example.abc'
    }

    it("should patch a category", async () => {
      categoryRepository.findOne.mockResolvedValue(mockCategory);
      const BeforeUpdate = await service.getOneCategoryByName(mockFindName);
      expect(categoryRepository.findOne).toHaveBeenCalledTimes(1);
      
      const result = await service.patchCategory(mockFindName, mockUpdateCategoryDto)

      categoryRepository.findOne.mockResolvedValue(mockUpdateCategory);
      const AfterUpdate = await service.getOneCategoryByName(mockUpdateCategoryName);
      expect(categoryRepository.findOne).toHaveBeenCalledTimes(3);

      expect(BeforeUpdate.id).toEqual(AfterUpdate.id);
      expect(AfterUpdate.id).toEqual(mockUpdateCategory.id);
      expect(AfterUpdate.name).toEqual(mockUpdateCategory.name);
    });
    
    it("should return a NotFoundException", async () => {
      categoryRepository.findOne.mockResolvedValue(mockCategory);
      const BeforeUpdate = await service.getOneCategoryByName(mockFindName);
      expect(categoryRepository.findOne).toHaveBeenCalledTimes(1);
      try{
        await service.patchCategory(mockErrorUpdateCategoryName, mockUpdateCategoryDto);
      }catch(e){
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });

    it("should return a BadRequestException", async () => {
      categoryRepository.findOne.mockResolvedValue(mockCategory);
      const BeforeUpdate = await service.getOneCategoryByName(mockFindName);
      expect(categoryRepository.findOne).toHaveBeenCalledTimes(1);
      try{
        await service.patchCategory(mockFindName, mockErrorUpdateCategoryDto as UpdateCategoryDto);
      }catch(e){
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
