import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Browser, Page, launch } from 'puppeteer';
import { InflearnScrapper } from './inflearn-scrapper';

@Injectable()
export class BatchService implements OnApplicationBootstrap {
    constructor(
        private readonly inflearnScrapper : InflearnScrapper
    ){}

    @Cron('0 0 9 * * *')
    async run(){
        const browser : Browser = await launch({
            headless: "new",
            timeout : 100000,
        });
        const page : Page = await browser.newPage();
        await this.inflearnScrapper.scrapping(page);
        
        await browser.close();
    }

    onApplicationBootstrap() {
        this.run();
    }
}
