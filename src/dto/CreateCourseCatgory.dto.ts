import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreateCourseCategoryDto{
    @ApiProperty({
        description : "강의"
    })
    @IsNumber()
    readonly courseId : number;

    @ApiProperty({
        description : "카테고리"
    })
    @IsNumber()
    readonly categoryId : number;
}