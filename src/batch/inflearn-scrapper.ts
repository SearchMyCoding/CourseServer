import { Injectable } from "@nestjs/common";
import { Cheerio, CheerioAPI, load, Element } from "cheerio";
import { HTTPResponse, Page } from "puppeteer";
import { CategoryService } from "src/category/category.service";
import { CourseService } from "src/course/course.service";
import { CourseCategoryService } from "src/coursecategory/coursecategory.service";
import { CreateCategoryDto } from "src/dto/CreateCategory.dto";
import { CreateCourseDto } from "src/dto/CreateCourse.dto";
import { CreateCourseCategoryDto } from "src/dto/CreateCourseCatgory.dto";
import { Category } from "src/entities/category.entity";
import { Course } from "src/entities/course.entity";
import { CourseType } from "src/type/course";
import { ScrapperType } from "src/type/scrapper";

@Injectable()
export class InflearnScrapper implements ScrapperType{
    private max : number;
    constructor(
        private readonly courseService : CourseService,
        private readonly categoryService : CategoryService,
        private readonly courseCategoryService  : CourseCategoryService
    ){
        this.max = 1;
    }
    async scrapping(page : Page){
        const rootUrl : string = 'https://www.inflearn.com/';
        const subUrl : string = 'courses';
        const pageNumberListElemnt : string = '.pagination-link';
        const classList : string = '.course_card_item';

        for(let i : number = 1; i <= this.max; i++){
            const result : HTTPResponse = await page.goto(`${rootUrl}${subUrl}?page=${i}`);
            const content : string = await page.content();
            const api : CheerioAPI = load(content);
            api(pageNumberListElemnt).each((index : number, el)=>{
                const num = Number(api(el).text());
                if(!Number.isNaN(num) && num > this.max){
                    this.max = num;
                }
            });
            
            const courseElement = api(classList) as Cheerio<Element>;
            if (courseElement.length === 0) {
                continue;
            }
            const courseList : CourseType[] = this.extractCourseInfo(api, courseElement);
            for(const newCourse of courseList){
                const createCourseDto: CreateCourseDto = {
                    title : newCourse["title"].trim(),
                    author : newCourse["author"].trim(),
                    link : newCourse["link"],
                    price : newCourse["price"],
                    rating : newCourse["rating"],
                    img_link : newCourse["img_link"],
                }
                const course : Course = await this.courseService.getOneCourseByTitle(createCourseDto.title);
                try{
                    (!course) ? await this.courseService.createCourse(createCourseDto) : await this.courseService.patchCourse(course.title, createCourseDto);
                }catch(err){
                    // console.log(err.message);
                    // console.log(createCourseDto);
                }
                for(const newCategory of newCourse["categorys"]){
                    const categoryName : string = newCategory.trim();
                    if(!categoryName)
                        continue;
                    const createCategoryDto: CreateCategoryDto = {name : categoryName};
                    const category : Category = await this.categoryService.getOneCategoryByName(newCategory);
                    try{
                        (!category) ? await this.categoryService.createCategory(createCategoryDto) : await this.categoryService.patchCategory(categoryName, createCategoryDto);
                    }catch(err){
                        // console.log(err.message);
                        // console.log(createCategoryDto);
                    }
                    const createCourse : Course= await this.courseService.getOneCourseByTitle(createCourseDto.title);
                    const createCategory : Category = await this.categoryService.getOneCategoryByName(createCategoryDto.name);
                    
                    if(!!createCourse && !!createCategory){
                        const createCourseCategory: CreateCourseCategoryDto = {
                            courseId : createCourse.id,
                            categoryId : createCategory.id
                        };
                        try{
                            await this.courseCategoryService.createCourseCategory(createCourseCategory);
                        }catch(err){
                            // console.log(err.message);
                        }
                    }
                }
            }
        }
    }

    extractCourseInfo(api: CheerioAPI, courseElement: Cheerio<Element>) : CourseType[]{
        const result : CourseType[] = [];
        courseElement.each((i : number, el : Element)=>{
            const temp : Cheerio<Element> = api(el);
            const dataChild : Cheerio<Element> = temp.find('.course-data');
            const imgChild : Cheerio<Element> = temp.find('.swiper-lazy');
            const linkChild : Cheerio<Element> = temp.find('.course_card_front');
            const dataString : string = dataChild.attr('fxd-data');
            const img_link : string = imgChild.attr('data-src');
            const link : string = linkChild.attr('href');

            try{
                const data : object = JSON.parse(dataString);
                let course : CourseType = {
                    title : (data["course_title"]??""),
                    author : (data["seq0_instructor_name"]??""),
                    categorys : [...(data["second_category"]??"").split(',').map((str : string)=>str.trim())],
                    rating : Math.round(Number(data["star_rate"]) * 20),
                    price : Number(data["selling_price"]),
                    link : 'https://www.inflearn.com' + link,
                    img_link : img_link
                }
                result.push(course);
            }catch(err){
                // console.log(err.message)
                // console.log(dataString);
                // console.log(link);
                // console.log(img_link);
            }
        })
        return result;
    }
}