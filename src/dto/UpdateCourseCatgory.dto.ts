import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { CreateCourseCategoryDto } from "./CreateCourseCatgory.dto";

export class UpdateCourseCategoryDto extends PartialType(CreateCourseCategoryDto){
    @ApiProperty({
        description : "수정 : 강의 | 카테고리"
    })
    @IsString()
    readonly modified : 'course' | 'category';

    @ApiProperty({
        description : "수정할 번호, course와 category는 찾는 번호"
    })
    @IsNumber()
    readonly idToModify : number;
}