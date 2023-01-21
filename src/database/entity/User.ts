import {Entity, Column, PrimaryColumn, OneToMany} from "typeorm"
import {Post} from "@database/entity/Post";
import {Role} from "@domain/auth/role/Role";

@Entity()
export class User {
    @PrimaryColumn()
    code!: number

    @Column({
        type: "enum",
        enum: Role,
        default: Role.NORMAL,
    })
    role!:Role

    @Column()
    grade!:number
    @Column()
    class!:number
    @Column()
    name!:string
    @OneToMany(() => Post, (Post) => Post.user)
    posts!: Post[]
}