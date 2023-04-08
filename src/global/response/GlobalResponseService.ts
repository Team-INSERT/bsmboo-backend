import {Response} from "express";
import {GlobalResponseDTO} from "@global/response/dto/GlobalResponseDTO";

const GlobalResponseService = (res:Response,ResDto:GlobalResponseDTO) => {
    res.status(ResDto.status).json(ResDto)
}
export {
    GlobalResponseService
}