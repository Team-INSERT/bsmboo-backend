import express from 'express';
const router = express.Router();
import { Request, Response } from "express";
import {Login} from '@domain/login/LoginService';

router.use('/', async (req: Request, res: Response) => {
    try {
        const token: string | undefined | null = await Login(<string>req.query.code);
        if (!token) {
            res.status(400).json({
                status: 400,
                message: "으디서 선생이"
            })
        }
        res.status(200).json({
            status: 200,
            message: "성공",
            token
        })
    } catch (e) {
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        })
    }
});

export default router;