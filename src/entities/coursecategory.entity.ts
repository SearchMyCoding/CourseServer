import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";
import { Course } from "./course.entity";

@Entity('course_category')
export class CourseCategory{
    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne(
        (type) => Course,
        (course : Course) => course.id,
        { nullable: false, onDelete: 'CASCADE' }
    )
    course : number;

    @ManyToOne(
        (type) => Category,
        (category : Category) => category.id,
        { nullable: false, onDelete: 'CASCADE' }
    )
    category : number;
}