require('dotenv').config();
import BsmOauth, { BsmOauthError, BsmOauthErrorType, BsmOauthUserRole, StudentResource, TeacherResource } from "bsm-oauth";


const BSM_AUTH_CLIENT_ID = process.env.CLIENT_ID || '';
const BSM_AUTH_CLIENT_SECRET = process.env.CLIENT_SECRE || '';
const bsmOauth: BsmOauth = new BsmOauth(BSM_AUTH_CLIENT_ID, BSM_AUTH_CLIENT_SECRET);

const Oauth = async (authCode:string) => {
    try {
        // 인증코드로 토큰 발급\
        const token: string = await bsmOauth.getToken(authCode);

        // 토큰으로 유저 정보 가져오기
        const resource: (StudentResource | TeacherResource) = await bsmOauth.getResource(token);
        // 가져온 유저 정보 확인
        console.log(resource.userCode);

    } catch (error) {
        if (error instanceof BsmOauthError) {
            switch (error.type) {
                case BsmOauthErrorType.INVALID_CLIENT: {
                    // 클라이언트 정보가 잘못되었을 때
                    break;
                }
                case BsmOauthErrorType.AUTH_CODE_NOT_FOUND: {
                    // 인증코드를 찾을 수 없을 때
                    break;
                }
                case BsmOauthErrorType.TOKEN_NOT_FOUND: {
                    // 토큰을 찾을 수 없을 때
                    break;
                }
            }
        }
    }
}

export {
    Oauth
}
