import * as console from "console";

require('dotenv').config();
import BsmOauth, { BsmOauthError, BsmOauthErrorType, BsmOauthUserRole, StudentResource, TeacherResource } from "bsm-oauth";
import jwt from "jsonwebtoken";
import {User} from "@database/entity/User";
import {UserRepository} from "@database/repository/Repository";


const BSM_AUTH_CLIENT_ID = process.env.CLIENT_ID || '';
const BSM_AUTH_CLIENT_SECRET = process.env.CLIENT_SECRET || '';
const screctKey = process.env.SCRECT_KEY!
const bsmOauth: BsmOauth = new BsmOauth(BSM_AUTH_CLIENT_ID, BSM_AUTH_CLIENT_SECRET);
const Login = async (authCode:string) => {
    try {
        const token: string = await bsmOauth.getToken(authCode);
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
        }else {
           return null;
        }

        return jwt.sign({
            code
        },screctKey,{
            expiresIn: '1h'
        })

    } catch (error) {
        console.log(error);
        if (error instanceof BsmOauthError) {
            switch (error.type) {
                case BsmOauthErrorType.INVALID_CLIENT: {
                    return null
                    break;
                }
                case BsmOauthErrorType.AUTH_CODE_NOT_FOUND: {
                    return null
                    break;
                }
                case BsmOauthErrorType.TOKEN_NOT_FOUND: {
                    return null
                    break;
                }
            }
        }
    }
}

export {
    Login
}
