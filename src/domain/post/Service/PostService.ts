import {PostRepository, UserRepository} from "@database/repository/Repository";
import {AllowPostRepository} from "@database/repository/Repository";
import {NextFunction, Request, Response} from "express";
import {Post} from "@database/entity/Post";
import { AllowPost } from "@database/entity/AllowPost";
import {isLogin} from "@domain/auth/middleware/authMiddleware";
import {GlobalResponseDTO} from "@global/response/DTO/GlobalResponseDTO";
import {GlobalResponseService} from "@global/response/GlobalResponseService";
import {ForbiddenException, InternalServerException, UnAuthorizedException} from "@global/exception/exceptions";
import {ImageUpload} from "@domain/image/Service/ImageService";

const FindAllowedPost = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const AllPost = await AllowPostRepository.find()
        const Dto = new GlobalResponseDTO(200, "성공", AllPost);
        GlobalResponseService(res, Dto);
    }catch (e) {
        console.log(e);
        return next(new InternalServerException())
    }
};
const FindAllPost = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const User = await isLogin(req.headers.authorization!).catch(e => {
            return next(new UnAuthorizedException())
        })
        if(!User) return next(new UnAuthorizedException())
        if(User!.role !== "ADMIN") return next(new ForbiddenException())
        const AllPost = PostRepository.find();
        const Dto = new GlobalResponseDTO(200, "성공", AllPost);
        GlobalResponseService(res, Dto);
    }catch (e) {
        console.log(e);
        return next(new InternalServerException())
    }
}


const CreateNewPost = async (req:Request,res:Response,next:NextFunction)  => {
    try {
        const anonymous = await UserRepository.findOneBy({code: -1});
        const { category, isAnonymous,contents, image, imageType} = req.body;
        const User = await isLogin(req.headers.authorization!).catch(e => {
            return next(new UnAuthorizedException())
        }).catch(e => {
            return next(new UnAuthorizedException())
        })
        if(!User) return next(new UnAuthorizedException())
        const post = new Post();
        post.category = category;
        post.isAnonymous = isAnonymous;
        post.contents = contents;
        if(image) post.Image = await ImageUpload(image, imageType,post.postCode)
        post.user = isAnonymous ? User! : anonymous!;
        await PostRepository.save(post);
        const DTO = new GlobalResponseDTO(200, "성공", post);
        GlobalResponseService(res, DTO);
    }catch (e) {
        console.log(e);
        return next(new InternalServerException())
    }
}

const approvePost = async(req:Request,res:Response,next:NextFunction) => {
    try {
        const {postCode} = req.body;
        const User = await isLogin(req.headers.authorization!).catch(e => {
            return next(new UnAuthorizedException())
        })
        if(!User) return next(new UnAuthorizedException())
        if(User!.role !== "ADMIN") return next(new ForbiddenException())
        const allowPost = new AllowPost();
        allowPost.post = <Post>await PostRepository.findOneBy(postCode)
        await AllowPostRepository.save(allowPost)
        const DTO = new GlobalResponseDTO(200, "성공", allowPost);
        GlobalResponseService(res, DTO);
    }catch (e) {
        console.log(e);
        return next(e)
    }
}
const deletePost = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const {postCode} = req.body;
        const User = await isLogin(req.headers.authorization!).catch(e => {
            return next(new UnAuthorizedException())
        })
        if(!User) return next(new UnAuthorizedException())
        if(User!.role !== "ADMIN") return next(new ForbiddenException())
        await PostRepository.delete(postCode)
        const DTO = new GlobalResponseDTO(200, "성공", null);
        GlobalResponseService(res, DTO);
    }catch (e) {
        console.log(e);
        return next(new InternalServerException())
    }
}


export {
    CreateNewPost,
    FindAllowedPost,
    approvePost,
    deletePost,
    FindAllPost
}