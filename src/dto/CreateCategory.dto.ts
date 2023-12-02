import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto{
    @ApiProperty({
        description : "카테고리"
    })
    @IsString()
    readonly name : string;
}