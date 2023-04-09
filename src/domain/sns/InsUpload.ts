import process from "process";
import console from "console";
const axios = require('axios');
require('dotenv').config();

const mediaUrl :string | undefined = process.env.MEDIA_URL;
const publishUrl:string | undefined = process.env.PUBLISH_URL;
const logoImage:string | undefined = process.env.LOGO_IMAGE;
const token:string | undefined = process.env.INS_TOKEN;

const postInstagram = (postNum: number, content: string, Username:string,ImageLink?: string ) => {
    try {
        const caption : string = `부산소마고 대나무숲 ${postNum}번째 제보\n${content}\n- ${Username}님 제보 -`;
        return ImageLink == undefined ? notImage(caption) : isImage(ImageLink,caption);
    }catch (err) {
        console.log(err)
        return false;
    }
}

const notImage = async(caption:string):Promise<boolean> =>{
    try {
        const mdUrl:string = `${mediaUrl}?image_url=${logoImage}&caption=${encodeURI(caption)}&access_token=${token}`;
        const CreationId = await axios.post(mdUrl)
        console.log(CreationId.data)
        const pbUrl:string = `${publishUrl}?creation_id=${CreationId.data.id}&access_token=${token}`;
        return publish(pbUrl)
    }catch (err){
        console.log(err)
        return false;
    }

}


const isImage =  async (ImageLink : string,caption:string):Promise<boolean> => {
    try {
        const mdUrl:string = `${mediaUrl}?image_url=${logoImage}&is_carousel_item=true&access_token=${token}`;
        const userImageUrl:string = `${mediaUrl}?image_url=${ImageLink}&is_carousel_item=true&access_token=${token}`;
        const logoContainer:string = await axios.post(mdUrl).data.id
        const userImageContainer:string = await axios.post(userImageUrl).data.id
        const lastPublishContainer:string = `${mediaUrl}?children=${logoContainer},${userImageContainer}&media_type=CAROUSEL&caption=${encodeURI(caption)}&access_token=${token}`;
        const CreationId:string = axios.post(lastPublishContainer).data.id
        const lastPublishUrl:string = `${publishUrl}?creation_id=${CreationId}&access_token=${token}`;
        return publish(lastPublishUrl)
    }catch (err) {
        console.log(err)
        return false;
    }

}

function publish(pbUrl : string):boolean {
    try {
        axios.post(pbUrl)
        return true;
    }catch (err){
        return false;
    }

}

export default postInstagram
