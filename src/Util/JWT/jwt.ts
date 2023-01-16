import express from "express";
import { InternalServerException, UnAuthorizedException } from "@src/util/exceptions";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const cookieHostName = process.env.COOKIE_HOST;
const secretKey = process.env.SECRET_KEY;
if (!cookieHostName || !secretKey) {
    throw new Error('Failed to load env config');
}

const sign = (
    payload: object,
    expire: string
) => {
    return jwt.sign(payload, secretKey, {
        algorithm: 'HS256',
        expiresIn: expire
    });
}

const login = async (
    userode: number,
    expire: string
) => {
    if (!user.getIsLogin()) {
        throw new InternalServerException('Failed to login');
    }

    const token = crypto.randomBytes(64).toString('hex');
    const result = {
        token: jwt.sign(user.getUser(), secretKey, {
            algorithm: 'HS256',
            expiresIn: expire
        }),
        refreshToken: jwt.sign({token}, secretKey, {
            algorithm: 'HS256',
            expiresIn: '60d'
        }),
    };
    await tokenRepository.insertToken(token, user.getUser().code);
    return result;
}

const verify = (
    token: string
) => {
    let result: {
        value: any,
        message: string
    } = {value:{},message:'INVALID'};

    try {
        result.value = jwt.verify(token, secretKey);
        result.message = 'VALID';
    } catch (err: {message:string} | any) {
        if (err.message === 'jwt expired') {
            result.message = 'EXPIRED';
        }
        result.value = {};
    } finally {
        return result;
    }
}

const refreshToken = async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    // 리프레시 토큰이 없으면 무시하고 넘어감
    if (!req.cookies.refreshToken) {
        return next();
    }
    if (req.cookies.token) {
        const result = verify(req.cookies.token);
        // 액세스 토큰이 사용가능하면 무시하고 넘어감
        if (!(result.message == 'EXPIRED' || result.message == 'INVALID')) {
            return next();
        }
    }

    const result = verify(req.cookies.refreshToken);
    // 리프레시 토큰이 유효하지 않으면 무시하고 넘어감
    if (result.message == 'INVALID') {
        res.clearCookie('refreshToken', {
            domain: cookieHostName,
            path: '/'
        });
        res.clearCookie('token', {
            domain: cookieHostName,
            path: '/'
        });
        return next();
    }

    // 리프레시 토큰이 만료되었으면 로그인을 요청
    if (result.message == 'EXPIRED') {
        res.clearCookie('refreshToken', {
            domain: cookieHostName,
            path: '/'
        });
        res.clearCookie('token', {
            domain: cookieHostName,
            path: '/'
        });
        return next(new UnAuthorizedException('Need to relogin'));
    }

    // db에서 리프레시 토큰 사용이 가능한지 확인
    const tokenInfo = await tokenRepository.getToken(result.value.token);
    // 리프레시 토큰이 db에서 사용불가 되었으면 로그인을 요청
    if (tokenInfo === null) {
        res.clearCookie('refreshToken', {
            domain: cookieHostName,
            path: '/'
        });
        res.clearCookie('token', {
            domain: cookieHostName,
            path: '/'
        });
        return next(new UnAuthorizedException('Need to relogin'));
    }

    // 유저 정보를 가져옴
    const userInfo = await accountRepository.getByUsercode(tokenInfo.usercode);
    if (userInfo === null) {
        res.clearCookie('refreshToken', {
            domain: cookieHostName,
            path: '/'
        });
        res.clearCookie('token', {
            domain: cookieHostName,
            path: '/'
        });
        return next(new UnAuthorizedException('Need to relogin'));
    }

    const user = new User(userInfo);
    if (!user.getIsLogin()) {
        throw new InternalServerException('Failed to refresh');
    }
    const payload = user.getUser();

    // 액세스 토큰 재발행
    const token = jwt.sign(payload, secretKey, {
        algorithm:'HS256',
        expiresIn:'1h'
    })
    res.cookie('token', token, {
        domain: cookieHostName,
        path: '/',
        httpOnly:true,
        secure:true,
        maxAge:1000*60*60// 1시간 동안 저장 1000ms*60초*60분
    });
    return res.status(401).send(JSON.stringify({
        statusCode:401,
        message:'token updated',
        token
    }));
}

export {
    sign,
    login,
    verify,
    refreshToken
}