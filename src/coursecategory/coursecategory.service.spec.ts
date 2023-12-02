import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';
import { CourseService } from 'src/course/course.service';
import { CourseCategory } from 'src/entities/coursecategory.entity';
import { Repository } from 'typeorm';
import { CourseCategoryService } from './coursecategory.service';
import { createMock } from '@golevelup/ts-jest';
import { Category } from 'src/entities/category.entity';
import { Course } from 'src/entities/course.entity';
import { CreateCourseCategoryDto } from 'src/dto/CreateCourseCatgory.dto';
import { UpdateCourseCategoryDto } from 'src/dto/UpdateCourseCatgory.dto';

const MockRepository = {
  find: jest.fn(),
  findOne : jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  insert: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    where: jest.fn().mockReturnThis(),
    distinct: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnThis()
  })
}

const mockCourseCategoryRepository = () => MockRepository;

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('CoursecategoryService', () => {
  let service: CourseCategoryService;
  let courseService : CourseService;
  let categoryService : CategoryService;
  let courseCategoryRepository : MockRepository<CourseCategory>;
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseCategoryService,
        {
          provide : getRepositoryToken(CourseCategory),
          useValue : mockCourseCategoryRepository()
        },
        {
          provide: CourseService,
          useValue: createMock<CourseService>()
        },
        {
          provide: CategoryService,
          useValue: createMock<CategoryService>()
        }
      ],
    }).compile();

    service = module.get<CourseCategoryService>(CourseCategoryService);
    courseService = module.get<CourseService>(CourseService);
    categoryService = module.get<CategoryService>(CategoryService);
    courseCategoryRepository = module.get<MockRepository<CourseCategory>>(
      getRepositoryToken(CourseCategory),
    );
    
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCategoryIdListByCourseId', ()=>{
    const mockCourseId : number = 1;
    const mockCourseCategoryId : number = 1;
    const mockCategoryId : number = 1;

    const mockCourseCategoryList : CourseCategory[] = [{
      id : mockCourseCategoryId,
      course : mockCourseId,
      category : mockCategoryId
    }];

    const mockCategoryIdList : number[] = [mockCategoryId];

    it("should find category Id List", async ()=>{
      courseCategoryRepository.find.mockResolvedValue(mockCourseCategoryList);

      const result : number[] = await service.getCategoryIdListByCourseId(mockCourseId);

      expect(courseCategoryRepository.find).toHaveBeenCalled();
      expect(result.length).toEqual(mockCategoryIdList.length);
      expect(result[0]).toEqual(mockCategoryIdList[0]);
    });
  });

  describe('getCourseIdListByCategoryId', ()=>{
    const mockCourseId : number = 1;
    const mockCourseCategoryId : number = 1;
    const mockCategoryId : number = 1;

    const mockCourseCategoryList : CourseCategory[] = [{
      id : mockCourseCategoryId,
      course : mockCourseId,
      category : mockCategoryId
    }];

    const mockCourseIdList : number[] = [mockCourseId];

    it("should find course Id List", async ()=>{
      courseCategoryRepository.find.mockResolvedValue(mockCourseCategoryList);

      const result : number[] = await service.getCourseIdListByCategoryId(mockCategoryId);

      expect(courseCategoryRepository.find).toHaveBeenCalled();
      expect(result.length).toEqual(mockCourseIdList.length);
      expect(result[0]).toEqual(mockCourseIdList[0]);
    });
  });
  
  describe("getCourseListByCategoryName", ()=>{
    const mockStartNumber : number = 1;
    const mockCountNumber : number = 1
    const mockCourseId : number = 1;
    const mockCategoryId : number = 1;
    const mockCourseCategoryId : number = 1;
    const mockCategoryName : string = "web";
    const mockCategory : Category = {
      id : mockCategoryId,
      name : mockCategoryName
    };
    const mockCourseCategory : CourseCategory[] = [{
      id : mockCourseCategoryId,
      course : mockCourseId,
      category : mockCategoryId
    }];
    const mockCourseList : Course[] = [
      {
        id : mockCourseId,
        author : 'test',
        link : 'https://localhost',
        title : '웹 기초',
        price : 0,
      }
    ];
    it('should find all course', async ()=>{
      jest
        .spyOn(categoryService, 'getOneCategoryByName')
        .mockResolvedValue(mockCategory);
      
      jest
        .spyOn(courseService, 'getCourseListByIdList')
        .mockResolvedValue(mockCourseList);

      const result : Course[] = await service.getCourseListByCategoryName(mockCategoryName, mockStartNumber, mockCountNumber);
      
      expect(categoryService.getOneCategoryByName).toHaveBeenCalledTimes(1);
      expect(courseService.getCourseListByIdList).toHaveBeenCalledTimes(1);
      
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getCategoryListByCourseTitle', ()=>{
    const mockCourseTitle : string = '웹 기초';
    const mockCourseId : number = 1;
    const mockCategoryId : number = 1;
    const mockCourse : Course = {
      id : mockCourseId,
      author : 'test',
      link : 'https://localhost',
      title : '웹 기초',
      price : 0,
    }
    const mockCourseCategory : CourseCategory[] = [{
      id : 1,
      course : mockCourseId,
      category : mockCategoryId
    }]
    const mockCategoryList : Category[] = [
      {
        id: mockCategoryId,
        name: 'web'
      }
    ]
    
    it('should find all category', async ()=>{
      jest
        .spyOn(courseService, 'getOneCourseByTitle')
        .mockResolvedValue(mockCourse);
      
      courseCategoryRepository.find.mockResolvedValue(mockCourseCategory);
      
      jest
        .spyOn(categoryService, 'getCategoryListByIdList')
        .mockResolvedValue(mockCategoryList);
      
      const result : Category[] = await service.getCategoryListByCourseTitle(mockCourseTitle);
      
      expect(courseService.getOneCourseByTitle).toHaveBeenCalledTimes(1);
      expect(courseCategoryRepository.find).toHaveBeenCalled();
      expect(categoryService.getCategoryListByIdList).toHaveBeenCalledTimes(1);

      expect(result.length).toEqual(mockCategoryList.length);
    })
  });

  describe('createCourseCategory',()=>{
    const mockCourseId : number = 1;
    const mockCategoryId : number = 1;
    const mockCourseCategoryId : number = 1;
    const mockCourse : Course = {
      id : mockCourseId,
      author : 'test',
      link : 'https://localhost',
      title : '웹 기초',
      price : 0,
    };
    const mockCategory : Category = 
    {
      id: mockCategoryId,
      name: 'web'
    };
    const mockCreateCourseCategoryDto : CreateCourseCategoryDto = {
      courseId : mockCourseId,
      categoryId: mockCategoryId
    };
    const mockCourseCategoryList : CourseCategory[] = [{
      id : mockCourseCategoryId,
      course : mockCourse.id,
      category : mockCategory.id
    }];

    it('should create a coursecategory', async () => {
      courseCategoryRepository.find.mockResolvedValue([]);
      const BeforeUpdate = await service.getCategoryIdListByCourseId(mockCourseId);
      expect(courseCategoryRepository.find).toHaveBeenCalled();
      
      const result = await service.createCourseCategory(mockCreateCourseCategoryDto);

      courseCategoryRepository.find.mockResolvedValue(mockCourseCategoryList);
      const AfterUpdate = await service.getCategoryIdListByCourseId(mockCourseId);
      expect(courseCategoryRepository.find).toHaveBeenCalled();

      expect(AfterUpdate.length).toEqual(BeforeUpdate.length + 1);
    });
  });

  describe('patchCourseId', ()=>{
    const mockCourseId : number = 1;
    const mockCategoryId : number = 1;
    const mockUpdateCourseId : number = 2;
    const mockUpdateCourseCategoryDto : UpdateCourseCategoryDto = {
      modified : 'course',
      courseId : mockCourseId,
      categoryId : mockCategoryId,
      idToModify : mockUpdateCourseId
    };

    const mockCourseCategory : CourseCategory = {
      id : 1,
      course : mockCourseId,
      category : mockCategoryId
    };

    const mockUpdateCourseCategory : CourseCategory = {
      id : 1,
      course : mockUpdateCourseId,
      category : mockCategoryId
    }
    
    it("should patch a courseId", async () => {
      jest
        .spyOn(courseCategoryRepository, 'findOne')
        .mockResolvedValue(mockCourseCategory);
      
      jest
        .spyOn(service, 'getCourseIdListByCategoryId')
        .mockResolvedValue([mockCourseId]);
      const BeforeUpdate = await service.getCourseIdListByCategoryId(mockCategoryId);
      
      const result = await service.patchCourseId(mockUpdateCourseCategoryDto);

      jest
        .spyOn(courseCategoryRepository, 'findOne')
        .mockResolvedValue(mockUpdateCourseCategory);

      jest
        .spyOn(service, 'getCourseIdListByCategoryId')
        .mockResolvedValue([mockUpdateCourseId]);
      const AfterUpdate = await service.getCourseIdListByCategoryId(mockCategoryId);

      expect(BeforeUpdate.length).toEqual(AfterUpdate.length);
      expect(BeforeUpdate[0]).toEqual(mockCourseId);
      expect(AfterUpdate[0]).toEqual(mockUpdateCourseId);
    });
  });

  describe('patchCategoryId',()=>{
    const mockCourseId : number = 1;
    const mockCategoryId : number = 1;
    const mockUpdateCategoryId : number = 2;
    const mockUpdateCourseCategoryDto : UpdateCourseCategoryDto = {
      modified : 'category',
      courseId : mockCourseId,
      categoryId : mockCategoryId,
      idToModify : mockUpdateCategoryId
    };

    const mockCourseCategory : CourseCategory = {
      id : 1,
      course : mockCourseId,
      category : mockCategoryId
    };

    const mockUpdateCourseCategory : CourseCategory = {
      id : 1,
      course : mockUpdateCategoryId,
      category : mockCategoryId
    }
    
    it("should patch a category id", async () => {
      jest
        .spyOn(courseCategoryRepository, 'findOne')
        .mockResolvedValue(mockCourseCategory);
      
      jest
        .spyOn(service, 'getCategoryIdListByCourseId')
        .mockResolvedValue([mockCategoryId]);
      const BeforeUpdate = await service.getCategoryIdListByCourseId(mockCourseId);
      
      const result = await service.patchCategoryId(mockUpdateCourseCategoryDto);

      jest
        .spyOn(courseCategoryRepository, 'findOne')
        .mockResolvedValue(mockUpdateCourseCategory);

      jest
        .spyOn(service, 'getCategoryIdListByCourseId')
        .mockResolvedValue([mockUpdateCategoryId]);
      const AfterUpdate = await service.getCategoryIdListByCourseId(mockCourseId);

      expect(BeforeUpdate.length).toEqual(AfterUpdate.length);
      expect(BeforeUpdate[0]).toEqual(mockCourseId);
      expect(AfterUpdate[0]).toEqual(mockUpdateCategoryId);
    });
  });
});
