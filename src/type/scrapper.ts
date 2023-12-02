import { Cheerio, CheerioAPI, Element } from "cheerio";
import { Page } from "puppeteer";
import { CourseType } from "./course";

export interface ScrapperType {
    scrapping(page : Page) : void;
    extractCourseInfo(api: CheerioAPI, courseElement: Cheerio<Element>) : CourseType[];
}
