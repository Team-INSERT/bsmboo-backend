import path from "path";
import fs from "fs";
import {BadRequestException, InternalServerException, NotFoundException} from "@global/exception/Exceptions";
import process from "process";
import {NextFunction, Request, Response} from "express";
import * as console from "console";
require('dotenv').config();

const ImageUpload = async (Image:string,ImageType:string,PostCode:number) => {
    let fileName;
    console.log(PostCode)
    let regex =new RegExp(`^data:image\\/${ImageType};base64,`)

    if (Image != Image.replace(regex, "")) {
        fileName =path.join(process.env.IMAGE_PATH!, `${PostCode}.${ImageType}`);
        Image = Image.replace(regex, "");
    }
    else{
        throw new BadRequestException()
    }
    fs.writeFileSync(fileName, Image, "base64");

    return "http://api.bsmboo.kro.kr/api/image/"+PostCode;
}

const FindImage = async (req:Request,res:Response,next:NextFunction)  => {
    try {
        const postCode: string = req.params.postCode;
        const File = fs.readdirSync(path.join(process.env.IMAGE_PATH!))
            .filter((file: string) => file.includes(postCode))[0]

        if (!File) next(new NotFoundException())

        return res.status(200).sendFile(path.join(process.env.IMAGE_PATH!, File))
    }catch (e) {
        console.log(e)
        next(new InternalServerException())
    }


}

export {
    ImageUpload,
    FindImage
}
