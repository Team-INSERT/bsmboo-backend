import {DataSource} from "typeorm";
import {User} from "@database/entity/User";
import {Post} from "@database/entity/Post";
import process from "process";
import {AllowPost} from "@database/entity/AllowPost";
require('dotenv').config()

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    entities: [User,Post,AllowPost],
    synchronize: true,
    logging: ["info","error"],
})

const DatabaseStart = () => {
    AppDataSource.initialize()
        .then(() => {
            const user = new User()
            user.code = -1;
            user.name = "anonymous";
            user.grade = 0;
            user.class = 0;
            AppDataSource.manager.save(user)
        })
        .catch((error) => console.log(error))
}

export {
    DatabaseStart,
    AppDataSource
}