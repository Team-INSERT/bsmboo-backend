import {Entity, Column, PrimaryColumn, OneToMany} from "typeorm"
import {Post} from "@database/entity/Post";

@Entity()
export class User {
    @PrimaryColumn()
    code!: number
    @Column()
    grade!:number
    @Column()
    class!:number
    @Column()
    name!:number
    @OneToMany(() => Post, (Post) => Post.user)
    posts!: Post[]
}