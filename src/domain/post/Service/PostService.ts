import {PostRepository} from "@database/repository/Repository";
import {AllowPostRepository} from "@database/repository/Repository";
import {Request} from "express";
import {Post} from "@database/entity/Post";
import { AllowPost } from "@database/entity/AllowPost";
import {isLogin} from "@domain/login/middleware/authMiddleware";

const FindAllowedPost = async () => await AllowPostRepository.find();
const FindAllPost = async () => await PostRepository.find();


const CreateNewPost = async (req:Request)  => {
    const { category, isAnonymous,contents, Image} = req.body;
    const User = await isLogin(req.headers.authorization!)
    if(!User) throw new Error("로그인이 필요합니다.")
    const post = new Post();
    post.category = category;
    post.isAnonymous = isAnonymous;
    post.contents = contents;
    post.Image = "https://i.imgur.com/9ZQZ1Zu.png";
    post.user = User;
    await PostRepository.save(post);
    return post;
}

const approvePost = async(req:Request) => {
    const {postCode} = req.body;
    const User = await isLogin(req.headers.authorization!)
    if(!User) throw new Error("로그인이 필요합니다.")
    const allowPost = new AllowPost();
    allowPost.post = <Post>await PostRepository.findOneBy(postCode)
    await AllowPostRepository.save(allowPost)
    return allowPost
}
const deletePost = async (req:Request) => {
    const {postCode} = req.body;
    await PostRepository.delete(postCode)
}


export {
    CreateNewPost,
    FindAllowedPost,
    approvePost,
    deletePost,
    FindAllPost
}