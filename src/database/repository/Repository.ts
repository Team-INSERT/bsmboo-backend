import { AppDataSource} from "@database/Database";
import {Post} from "@database/entity/Post";
import {User} from "@database/entity/User";
import {AllowPost} from "@database/entity/AllowPost";

const PostRepository = AppDataSource.getRepository(Post)
const UserRepository = AppDataSource.getRepository(User)
const AllowPostRepository = AppDataSource.getRepository(AllowPost)

export {
    PostRepository,
    UserRepository,
    AllowPostRepository
}