import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import {UserRepository} from "@database/repository/Repository";

require('dotenv').config()

let SCRECT_KEY: Secret | undefined = process.env.SCRECT_KEY;

const isLogin = async (token: string) => {
    try {
        if (!SCRECT_KEY) throw new Error("SECRET_KEY NOT FOUND")
        const decodejwt = JSON.parse(JSON.stringify(<string>jwt.verify(token, SCRECT_KEY)));
        const code: number = Number(decodejwt.code)
        return await UserRepository.findOneBy({code: code})
    }catch (e){
        return null;
    }
}

export {
    isLogin
}