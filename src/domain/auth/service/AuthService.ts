import * as console from "console";
require('dotenv').config();
import {NextFunction, Request, Response} from "express";
import {User} from "@database/entity/User";
import {UserRepository} from "@database/repository/Repository";
import {GlobalResponseDTO} from "@global/response/DTO/GlobalResponseDTO";
import {GlobalResponseService} from "@global/response/GlobalResponseService";
import jwt from "jsonwebtoken";
import {isLogin} from "@domain/auth/middleware/authMiddleware";
import {
    BadRequestException,
    ForbiddenException,
    InternalServerException,
    UnAuthorizedException
} from "@global/exception/exceptions";
import BsmOauth, { BsmOauthError, BsmOauthErrorType, StudentResource, TeacherResource } from "bsm-oauth";
import authController from "@domain/auth/AuthController";
const BSM_AUTH_CLIENT_ID = process.env.CLIENT_ID || '';
const BSM_AUTH_CLIENT_SECRET = process.env.CLIENT_SECRET || '';
const screctKey = process.env.SCRECT_KEY!
const bsmOauth: BsmOauth = new BsmOauth(BSM_AUTH_CLIENT_ID, BSM_AUTH_CLIENT_SECRET);


const Login = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const authCode = req.query.code!
        if(!authCode) next(new BadRequestException())
        const token: string = await bsmOauth.getToken(authCode.toString());
        const resource: StudentResource | TeacherResource = await bsmOauth.getResource(token);
        const code = resource.userCode;
        if ("student" in resource) {
            const {name, grade, classNo} = resource.student;
            const user = new User()
            user.code = code;
            user.name = name;
            user.grade = grade;
            user.class = classNo;
            await UserRepository.upsert(user, {conflictPaths: ['code']});
        }else next(new ForbiddenException());
        const jwtToken= jwt.sign({code},screctKey,{expiresIn: '1h'})
        const ResponseDTO = new GlobalResponseDTO(200,"Login Success",jwtToken);
        GlobalResponseService(res,ResponseDTO);
    } catch (error) {
        console.log(error)
        if (error instanceof BsmOauthError) {
            switch (error.type) {
                case BsmOauthErrorType.INVALID_CLIENT: {
                    next(new InternalServerException());
                    break;
                }
                case BsmOauthErrorType.AUTH_CODE_NOT_FOUND: {
                    next(new BadRequestException())
                    break;
                }
                case BsmOauthErrorType.TOKEN_NOT_FOUND: {
                    next(new InternalServerException());
                    break;
                }
            }
        }else {
            next(new InternalServerException());
        }

    }
}
const Whoami = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const user = await isLogin(req.headers.authorization!);
        if (!user) return next(new UnAuthorizedException());
        GlobalResponseService(res,new GlobalResponseDTO(200,"Success",user));
    }catch (error) {
       next(error)
    }
}

export {
    Login,
    Whoami
}
