import { ApiProperty } from '@nestjs/swagger';
import {IsString, IsOptional, IsNumber} from 'class-validator';

export class CreateCourseDto{
    @ApiProperty({
        description : "강의 제목"
    })
    @IsString()
    readonly title : string;

    @ApiProperty({
        description : "제작자"
    })
    @IsString()
    readonly author : string;

    @ApiProperty({
        description : "강의 uri"
    })
    @IsString()
    readonly link : string;

    @ApiProperty({
        description : "강의 이미지 uri"
    })
    @IsOptional()
    @IsString()
    readonly img_link? : string;

    @ApiProperty({
        description : "강의 가격"
    })
    @IsNumber()
    readonly price : number;

    @ApiProperty({
        description : "강의 평점"
    })
    @IsOptional()
    @IsNumber()
    readonly rating? : number;
}