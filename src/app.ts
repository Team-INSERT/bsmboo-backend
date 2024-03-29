require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
import {HttpError, NotFoundException} from "@global/exception/Exceptions";
import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import controller from "@domain/Controller";
import { DatabaseStart } from "@database/Database";
import {GlobalResponseService} from "@src/global/response/GlobalResponseService";
import {GlobalResponseDTO} from "@global/response/dto/GlobalResponseDTO";
const cors = require('cors');


DatabaseStart()

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
            origin: true, // '*' 안됨 -> 정확한 주소 또는 origin: true로 해도 됨
            credentials: true,
    }),
);


app.use('/api',controller);

app.use((req:Request, res:Response, next:NextFunction) => {
        next(new NotFoundException())
});

app.use(((err: HttpError, req: Request, res: Response, next: NextFunction) => {
        const {httpCode, message} = err;
        const response = new GlobalResponseDTO(httpCode ?? 500,message ?? "Internal Server Error",null);
        GlobalResponseService(res,response);
}) as ErrorRequestHandler);

app.listen(8088)