import process from "process";
import console from "console";
const axios = require('axios');
require('dotenv').config();

const mediaUrl = process.env.MEDIA_URL;
const publishUrl = process.env.PUBLISH_URL;
const logoImage = process.env.LOGO_IMAGE;
const token = process.env.INS_TOKEN;

const postInstagram = (Postnum: number, content: string, Username:string,ImageLink?: string ) => {
    try {
        const caption : string = `부산소마고 대나무숲 ${Postnum}번째 제보\n${content}\n- ${Username}님 제보 -`;
        return ImageLink == undefined ? notImage(caption) : isImage(ImageLink,caption);
    }catch (err) {
        console.log(err)
        return false;
    }
}

const notImage = async(caption:string) =>{
    try {
        const mdUrl = `${mediaUrl}?image_url=${logoImage}&caption=${encodeURI(caption)}&access_token=${token}`;
        const CreationId = await axios.post(mdUrl)
        console.log(CreationId)
        const pbUrl = `${publishUrl}?creation_id=${CreationId}&access_token=${token}`;
        return publish(pbUrl)
    }catch (err){
        console.log(err)
        return false;
    }

}


const isImage =  async (ImageLink : string,caption:string) => {
    try {
        const mdUrl = `${mediaUrl}?image_url=${logoImage}&is_carousel_item=true&access_token=${token}`;
        const userImageUrl = `${mediaUrl}?image_url=${ImageLink}&is_carousel_item=true&access_token=${token}`;
        const logoContainer = await axios.post(mdUrl).data.id
        const userImageContainer = await axios.post(userImageUrl).data.id
        const lastPublishContainer = `${mediaUrl}?children=${logoContainer},${userImageContainer}&media_type=CAROUSEL&caption=${encodeURI(caption)}&access_token=${token}`;
        const CreationId = axios.post(lastPublishContainer).data.id
        const lastPublishUrl = `${publishUrl}?creation_id=${CreationId}&access_token=${token}`;
        return publish(lastPublishUrl)
    }catch (err) {
        console.log(err)
        return false;
    }

}

function publish(pbUrl : any) {
    try {
        axios.post(pbUrl)
        return true;
    }catch (err){
        return false;
    }

}

export default postInstagram
