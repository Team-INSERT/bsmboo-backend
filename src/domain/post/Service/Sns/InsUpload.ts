import fs from "fs";
import path from "path";
import process from "process";
import {InternalServerException, NotFoundException} from "@global/exception/exceptions";
import console from "console";
import {NextFunction, Request, Response} from "express";
import {Post} from "@database/entity/Post";
import {User} from "@database/entity/User";
import {PostRepository} from "@database/repository/Repository";

const axios = require('axios');
require('dotenv').config();
const models = require('../database/entity');

const mediaUrl = process.env.MEDIA_URL;
const publishUrl = process.env.PUBLISH_URL;
const logoImage = process.env.LOGO_IMAGE;
const token = process.env.INS_TOKEN;

let caption : string;
let mdUrl : string;
let pbUrl : string;
let userImageUrl : string;
let logoContainer : string;
let userImageContainer : string;
let lastPublishContainer : string;
let lastPublishUrl : string;

const postInstagram = (User: any, post: any) => {
    try {
        caption = `부산소마고 대나무숲 ${post.postCode}번째 제보\n${post.contents}\n- ${User.name}님 제보 -`;
        post.Image == null ? notImage() : isImage(post);
    }catch (err) {
        console.log(err)
    }
}

function notImage() {
    mdUrl = mediaUrl + "?image_url=" + logoImage + "&caption=" + encodeURI(caption) + "&access_token=" + token;
    axios.post(mdUrl)
        .then((res : any) => {
            // console.log(res.data.id);
            pbUrl = publishUrl + "?creation_id=" + res.data.id + "&access_token=" + token;
        }).then(() => {
        publish(pbUrl)
    }).catch((err : Error) => {
        console.error(err);
    })
}


function isImage(post : any) {
    console.log(post);
    mdUrl = mediaUrl + "?image_url=" + logoImage + "&is_carousel_item=" + "true" + "&access_token=" + token;
    userImageUrl = mediaUrl + "?image_url=" + post.Image + "&is_carousel_item=" + "true" + "&access_token=" + token;
    axios.post(mdUrl)
        .then((res : any) => {
            logoContainer = res.data.id;
        }).then(() => {
        axios.post(userImageUrl)
            .then((res: any) => {
                userImageContainer = res.data.id;
            }).then(() => {
            lastPublishContainer = mediaUrl + "?children=" + logoContainer + "," + userImageContainer + "&media_type=" + "CAROUSEL" + "&caption=" + encodeURI(caption) + "&access_token=" + token;
            axios.post(lastPublishContainer).then((res : any) => {
                lastPublishUrl = publishUrl + "?creation_id=" + res.data.id + "&access_token=" + token;
                publish(lastPublishUrl)
            })
        })
    }).catch((err : Error) => {
        console.log(err);
    })
}

function publish(pbUrl : any) {
    axios.post(pbUrl)
        .then(() => console.log(`success`))
        .catch((err : Error) => {
            console.error(err);
        })
}

export default postInstagram
