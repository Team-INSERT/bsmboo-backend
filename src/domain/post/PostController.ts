import {Request, Response} from "express";
import {approvePost, CreateNewPost, deletePost, FindAllowedPost, FindAllPost} from "@domain/post/Service/PostService";
const express = require('express');
const router = express.Router();



router.get('/',async (req:Request,res:Response) => {
    try {
        const AllPost = await FindAllowedPost();
        res.status(200).json({
            status: 200,
            message: "성공",
            AllPost
        });
    }catch (e) {
        console.log(e);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        })
    }
})


router.post('/create',async (req:Request,res:Response) => {
    try {
        const post = await CreateNewPost(req);
        res.status(200).json({
            status: 200,
            message: "성공",
            post
        })
    }catch (e){
        console.log(e);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        })
    }
})

router.put('/allow',async (req:Request,res:Response)=>{
    try {
        const allowPost = await approvePost(req)
        res.status(200).json({
            status: 200,
            message: "성공",
            allowPost
        })
    }catch (e){
        console.log(e);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        })
    }
})

router.delete('/delete',async (req:Request,res:Response)=>{
    try {
        await deletePost(req)
        res.status(200).json({
            status: 200,
            message: "성공",
        })
    }catch (e){
        console.log(e);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        })
    }
})

router.get('/manage',async (req: Request, res: Response) => {
    try {
        const AllPost = await FindAllPost();
        res.status(200).json({
            status: 200,
            message: "성공",
            AllPost
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        })
    }
})


export default router;