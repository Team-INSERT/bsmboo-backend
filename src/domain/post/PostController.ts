import {Request, Response} from "express";
import {PostRepository} from "@database/repository/Repository";
const express = require('express');
const router = express.Router();



router.get('/',async (req:Request,res:Response) => {
    const post = await PostRepository.find();
    console.log(post)
    res.send("a");
})


router.post('/create',async (req:Request,res:Response) => {
    const post = await PostRepository.find();
    console.log(post)
    res.send("a");
})


export default router;