require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
import {HttpError} from "@src/Util/exceptions";
import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import path from 'path';
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import controller from "./api/controller";
const swaggerSpec = YAML.load(path.join(__dirname, '../build/swagger.yaml'))
const app = express();


app.use(express.json());
app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api',controller);

app.use(((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    if (err.httpCode) {
        res.status(err.httpCode).send(JSON.stringify({
            statusCode: err.httpCode,
            message: err.message
        }));
    } else {
        console.error(err);
        res.status(500).send(JSON.stringify({
            statusCode: 500,
            message: 'Internal Server Error'
        }));
    }
}) as ErrorRequestHandler);

app.listen(8000)