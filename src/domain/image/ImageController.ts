import {NextFunction, Request, Response} from "express";
require('dotenv').config()
const express = require('express');
const router = express.Router();
const Folder = process.env.IMAGE_PATH!;
import {FindImage} from "@domain/image/service/ImageService";

router.get('/:postCode',(req:Request,res:Response,next:NextFunction) => {
    return FindImage(req,res,next)
})

export default router;