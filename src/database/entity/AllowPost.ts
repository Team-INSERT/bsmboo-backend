import {Entity, Column, PrimaryGeneratedColumn} from "typeorm"
import {OneToOne} from "typeorm";
import {Post} from "@database/entity/Post";
import {JoinColumn} from "typeorm";


@Entity()
export class AllowPost {

    @PrimaryGeneratedColumn()
    AllowedCode!:number

    @OneToOne(() => Post,{
        eager: true ,
        onDelete:'CASCADE'
    })
    @JoinColumn()
    post!:Post

}