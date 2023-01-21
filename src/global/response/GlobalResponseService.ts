import {Response} from "express";
import {GlobalResponseDTO} from "@src/global/response/DTO/GlobalResponseDTO";

const GlobalResponseService = (res:Response,ResDto:GlobalResponseDTO) => {
    res.status(ResDto.status).json(ResDto)
}
export {
    GlobalResponseService
}