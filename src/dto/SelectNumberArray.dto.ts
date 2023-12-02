import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsNumber } from "class-validator";

export class SelectNumberArrayDto{
    @ApiProperty({
        description : "숫자들 배열, 형식 : 1,2,3,4,5(복수) 또는 1(단일)"
    })
    @IsArray()
    @IsNumber({},{ each: true })
    @Type(() => String)
    @Transform(({value}) => value.toString().split(',').map(Number).filter((v : number)=> !Number.isNaN(v)))
    readonly numberString : number[];
}