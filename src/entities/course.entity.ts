import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Category } from "./category.entity";
import { CourseCategory } from "./coursecategory.entity";

@Entity('course')
export class Course{
    @PrimaryGeneratedColumn()
    id : number;

    @Column({
        type : "varchar",
        length : 500,
        unique: true,
        nullable : false
    })
    title : string;
    
    @Column({
        type : "varchar",
        length : 2000,
        nullable : false
    })
    author : string;

    @Column({
        type : "varchar",
        length : 2000,
        unique: true,
        nullable : false
    })
    link : string;

    @Column({
        type : "varchar",
        length : 2000,
        nullable : true
    })
    img_link? : string;

    @Column({
        nullable : false
    })
    price : number;

    @Column({
        nullable : true
    })
    rating? : number;

    @OneToMany(
      (type) => CourseCategory,
      (coursecategory : CourseCategory) => coursecategory.category
    )
    category? : Category[]
}