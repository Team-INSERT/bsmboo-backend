export class GlobalResponseDTO {
    status!: number;
    message!: string;
    data: object | string | null | undefined;

    constructor(status: number, message: string, data: object | string | null | undefined) {
        this.status = status;
        this.message = message;
        if(data) this.data = data;
    }



}