import {NextFunction, Request, Response} from "express";
import fs from "fs";
import path from "path";
import {NotFoundException} from "@global/exception/Exceptions";
import * as console from "console";
require('dotenv').config()
const express = require('express');
const router = express.Router();
const Folder = process.env.IMAGE_PATH!;
router.get('/:postCode',(req:Request,res:Response,next:NextFunction) => {
    const postCode:string = req.params.postCode;
    const File = fs.readdirSync(path.join(Folder))
        .filter((file:string) => file.includes(postCode))[0]
    if(File) return res.status(200).sendFile(path.join(Folder,File))

    else next(new NotFoundException())
})

export default router;