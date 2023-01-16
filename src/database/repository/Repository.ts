import { AppDataSource} from "@database/Database";
import {Post} from "@database/entity/Post";

const PostRepository = AppDataSource.getRepository(Post)

export {
    PostRepository
}