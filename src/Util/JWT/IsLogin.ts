import express from 'express';
import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import jwt from 'jsonwebtoken';
const router = express.Router();
router.use(cookieParser())
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET || "";

const isLogin = (req:Request,res:Response,next:NextFunction) =>{
    const decode = jwt.verify(req.cookies.token,SECRET_KEY);

}

