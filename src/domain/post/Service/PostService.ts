import {PostRepository, UserRepository} from "@database/repository/Repository";
import {AllowPostRepository} from "@database/repository/Repository";
import {NextFunction, Request, Response} from "express";
import {Post} from "@database/entity/Post";
import { AllowPost } from "@database/entity/AllowPost";
import {isLogin} from "@domain/auth/middleware/authMiddleware";
import {GlobalResponseDTO} from "@global/response/DTO/GlobalResponseDTO";
import {GlobalResponseService} from "@global/response/GlobalResponseService";
import {
    BadRequestException,
    ForbiddenException,
    InternalServerException,
    UnAuthorizedException
} from "@global/exception/exceptions";
import {ImageUpload} from "@domain/image/Service/ImageService";
import * as console from "console";
import postInstagram from '@domain/sns/InsUpload'

const FindAllowedPost = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const AllPost = await AllowPostRepository.find()
        const Dto = new GlobalResponseDTO(200, "성공", AllPost);
        GlobalResponseService(res, Dto);
    }catch (e) {
        return next(new InternalServerException())
    }
}
const FindAllPost = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const User = await isLogin(req.headers.authorization!).catch(e => {
            return next(new UnAuthorizedException())
        })
        if(!User) return next(new UnAuthorizedException())
        if(User!.role !== "ADMIN") return next(new ForbiddenException())
        const AllPost = await PostRepository.find();;
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
        })
        if(!User) return next(new UnAuthorizedException())
        const post = new Post();
        post.category = category;
        post.isAnonymous = isAnonymous;
        post.contents = contents;

        if(isAnonymous) post.user = anonymous!;
        else post.user = User!
        await PostRepository.save(post);
        if(image) post.Image = await ImageUpload(image, imageType,post.postCode)
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

        const post = await PostRepository.findOneBy({postCode: postCode});
        if(!post) return next(new BadRequestException())
        post.isAllow = true;
        await PostRepository.save(post);

        const allowPost = new AllowPost();
        allowPost.post = post;
        await AllowPostRepository.save(allowPost)

        const instaResult = await postInstagram(allowPost.AllowedCode, post.contents,post.user.name,post.Image)
        if (!instaResult) {
            next(new InternalServerException())
        }

        const DTO = new GlobalResponseDTO(200, "성공", allowPost);
        GlobalResponseService(res, DTO);
    }catch (e) {
        return next(new InternalServerException())
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