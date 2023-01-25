import {NextFunction, Request, Response} from "express";
import fs from "fs";
import path from "path";
import {NotFoundException} from "@global/exception/exceptions";
import * as console from "console";

const express = require('express');
const router = express.Router();

router.get('/:postCode',(req:Request,res:Response,next:NextFunction) => {
    const postCode:string = req.params.postCode;
    const File = fs.readdirSync(path.join("C:\\Users\\jason\\Image"))
        .filter((file:string) => file.includes(postCode))[0]
    if(File) return res.status(200).sendFile(path.join("C:\\Users\\jason\\Image",File))

    else next(new NotFoundException())
})

export default router;