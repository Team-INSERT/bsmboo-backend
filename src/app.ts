require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
import {HttpError} from "@src/global/exception/exceptions";
import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import "reflect-metadata"
import controller from "./domain/controller";
const app = express();
import { DatabaseStart } from "@database/Database";

app.use(express.json());
app.use(cookieParser());
app.use('/api',controller);

DatabaseStart()

app.use(((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    if (err.httpCode) {
        res.status(err.httpCode).json({
            statusCode: err.httpCode,
            message: err.message
        });
    } else {
        console.error(err);
        res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error'
        });
    }
}) as ErrorRequestHandler);

app.listen(8081)