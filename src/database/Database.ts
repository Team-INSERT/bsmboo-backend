import {DataSource} from "typeorm";
import {User} from "@database/entity/User";
import {Post} from "@database/entity/Post";

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "123dddd4",
    database: "test",
    entities: [User,Post],
    synchronize: true,
    logging: true,
})

const DatabaseStart = () => {

    AppDataSource.initialize()
        .then(() => {
            // here you can start to work with your database
        })
        .catch((error) => console.log(error))
}

export {
    DatabaseStart,
    AppDataSource
}