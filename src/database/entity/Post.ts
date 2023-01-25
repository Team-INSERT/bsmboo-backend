import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn} from "typeorm"
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

    @Column("boolean",{
        default: false
    })
    isAllow!:boolean

    @Column("text")
    contents!:string

    @Column("varchar",{
        nullable: true,
        default: null
    })
    Image?:string

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date


    @ManyToOne( ()=> User,(user)=>user.posts,{ eager: true })
    user!:User

}