import express from 'express';
const router = express.Router();
import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import {Oauth} from '@domain/login/LoginService';

router.use('/',async (req:Request,res:Response) => {
    await Oauth(<string>req.query.code);
});

export default router;