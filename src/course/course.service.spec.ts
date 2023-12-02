import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCourseDto } from 'src/dto/CreateCourse.dto';
import { UpdateCourseDto } from 'src/dto/UpdateCourse.dto';
import { Course } from 'src/entities/course.entity';
import { Repository } from 'typeorm';
import { CourseService } from './course.service';

const mockCourseRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  insert: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
  //   /// mockReturnThis()은  jest.fn(()=>this)의 Sugar Function으로 this를 반환하여 chained method를 mocking하는 것이 가능하도록 해줍니다.
  //   /// 출처 : https://velog.io/@hkja0111/NestJS-11-Unit-Test-QueryBuilder
  //   ///
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnThis()
  })
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('CoursesService', () => {
  let service: CourseService;
  let courseRepository: MockRepository<Course>;
  let mockCourse: Course;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide : getRepositoryToken(Course),
          useValue : mockCourseRepository()
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
    courseRepository = module.get<MockRepository<Course>>(
      getRepositoryToken(Course),
    );

    mockCourse = {
      id : 1,
      author : "test",
      title : "웹의 이해",
      link : "https://www.example.link",
      img_link : "https://www.examplelink.link",
      rating : 0,
      price : 0
    };

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllCourse',()=>{
    it('should find all course', async ()=>{
      courseRepository.find.mockResolvedValue([]);

      const result = await service.getAllCourse();
      expect(courseRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOneCourseById',()=>{
    const findId : number = 1;
    const findErrorId : number = 999;

    it('should find a course',async ()=>{
      courseRepository.findOne.mockResolvedValue(mockCourse);

      const result = await service.getOneCourseById(findId);
      expect(courseRepository.findOne).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockCourse);
    });
  });

  describe('getCourseList',()=>{
    const mockCourseList : Course[] = new Array<Course>(10);
    const mockListNumber : number = 1;
    const mockNumberOfCourseInList : number = 10;

    it(`should find ${mockNumberOfCourseInList} course`, async ()=>{
      courseRepository.find.mockResolvedValue(mockCourseList);
      const result = await service.getCourseList(mockListNumber, mockNumberOfCourseInList, null);

      expect(courseRepository.find).toHaveBeenCalledTimes(1);

      expect(result.length).toEqual(mockNumberOfCourseInList);
    })
  });

  describe('getCourseListByIdList', ()=>{
    /// https://stackoverflow.com/questions/66904523/what-would-be-a-proper-way-to-test-typeorms-querybuilder-chaining-methods
    const mockCourseList : Course[] = [];
    const mockIdList : number[] = [];
    it('should find course list by id list', async()=>{
      /// courseRepository.createQueryBuilder.getMany.mockResolvedValue(mockIdList);
      /// 위와 같이 그냥 jest.fn()으로 하면 where에서 에러 발생
      /// 
      jest
        .spyOn(courseRepository.createQueryBuilder(),'getMany')/// Creates a mock function similar to jest.fn but also tracks calls to object[methodName]
        .mockResolvedValue(mockCourseList);
      const result = await service.getCourseListByIdList(mockIdList);
      expect(courseRepository.createQueryBuilder().getMany).toHaveBeenCalled();
      
      expect(result.length).toEqual(mockCourseList.length)
    });
  })

  describe('getOneCourseByTitle',()=>{
    const findTitle : string = '웹의 이해';
    const findErrorTitle : string = '앱의 이해';

    it('should find a course',async ()=>{
      courseRepository.findOne.mockResolvedValue(mockCourse);

      const result = await service.getOneCourseByTitle(findTitle);
      expect(courseRepository.findOne).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockCourse);
    });
  });

  describe('createCourse',()=>{
    const mockCreateCourseDto : CreateCourseDto = {
      title : "웹의 이해",
      author : "test",
      link : "https://www.example.link",
      img_link : "https://www.examplelink.link",
      rating : 0,
      price : 0
    };

    const mockErrorCreateCourseDto = {
      title : "hi",
      img_link : "wwwheefsdfdsa"
    }
    
    it("should create a course", async () => {
      courseRepository.find.mockResolvedValue([]);
      const BeforeCreate = (await service.getAllCourse()).length;
      expect(courseRepository.find).toHaveBeenCalledTimes(1);
      
      const result = await service.createCourse(mockCreateCourseDto);

      courseRepository.find.mockResolvedValue([mockCourse]);
      const AfterCreate = (await service.getAllCourse()).length;
      expect(courseRepository.find).toHaveBeenCalledTimes(2);
      expect(AfterCreate).toEqual(BeforeCreate + 1);
    });

    it("should return a BadRequestException", async () => {
      try{
        await service.createCourse(mockErrorCreateCourseDto as CreateCourseDto);
      }catch(e){
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('patchCourse',()=>{
    const mockFindTitle : string = '웹의 이해';
    const mockUpdateCourseTitle : string = '앱의 이해';
    const mockErrorUpdateCourseTitle : string = 'AI의 이해';
    const mockUpdateCourseDto : UpdateCourseDto = {
      title : "앱의 이해"
    }
    const mockUpdateCourse : Course = {
      id : 1,
      author : "test",
      title : "앱의 이해",
      link : "https://www.example.link",
      img_link : "https://www.examplelink.link",
      rating : 0,
      price : 0
    };
    const mockErrorPatchCourseDto = {
      title : "hi",
      img_link : "wwwheefsdfdsa"
    }

    it("should patch a course", async () => {
      courseRepository.findOne.mockResolvedValue(mockCourse);
      const BeforeUpdate = await service.getOneCourseByTitle(mockFindTitle);
      expect(courseRepository.findOne).toHaveBeenCalledTimes(1);
      
      const result = await service.patchCourse(mockFindTitle, mockUpdateCourseDto)

      courseRepository.findOne.mockResolvedValue(mockUpdateCourse);
      const AfterUpdate = await service.getOneCourseByTitle(mockUpdateCourseTitle);
      expect(courseRepository.findOne).toHaveBeenCalledTimes(3);

      expect(BeforeUpdate.id).toEqual(AfterUpdate.id);
      expect(AfterUpdate.id).toEqual(mockUpdateCourse.id);
      expect(AfterUpdate.title).toEqual(mockUpdateCourse.title);
    });
    
    it("should return a NotFoundException", async () => {
      courseRepository.findOne.mockResolvedValue(mockCourse);
      const BeforeUpdate = await service.getOneCourseByTitle(mockFindTitle);
      expect(courseRepository.findOne).toHaveBeenCalledTimes(1);
      try{
        await service.patchCourse(mockErrorUpdateCourseTitle, mockUpdateCourseDto);
      }catch(e){
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
    
    it("should return a BadRequestException", async () => {
      courseRepository.findOne.mockResolvedValue(mockCourse);
      const BeforeUpdate = await service.getOneCourseByTitle(mockFindTitle);
      expect(courseRepository.findOne).toHaveBeenCalledTimes(1);
      try{
        await service.patchCourse(mockFindTitle, mockErrorPatchCourseDto as UpdateCourseDto);
      }catch(e){
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
