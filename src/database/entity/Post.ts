import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, ManyToOne} from "typeorm"
import {Category} from "@domain/post/category/Category";
import {User} from "@database/entity/User";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    postCode!:number


    @Column({
        type: "enum",
        enum: Category,
        default: Category.FREE,
    })
    category!:Category

    @Column("boolean")
    isAnonymous!:boolean

    @Column("text")
    contents!:string

    @Column("varchar")
    Image!:string

    @ManyToOne(()=> User,(user)=>user.posts,{ eager: true })
    user!:User

}