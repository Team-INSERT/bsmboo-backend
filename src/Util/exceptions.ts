class HttpError extends Error {
    httpCode: number;
    constructor(message?: string) {
        super();
        this.httpCode = 500;
        this.message = 'Internal Server Error';
        if (this instanceof BadRequestException) {
            this.httpCode = 400;
            this.message = 'Bad Request';
        }
        if (this instanceof UnAuthorizedException) {
            this.httpCode = 401;
            this.message = 'Unauthorized';
        }
        if (this instanceof ForbiddenException) {
            this.httpCode = 403;
            this.message = 'Forbidden';
        }
        if (this instanceof NotFoundException) {
            this.httpCode = 404;
            this.message = 'Not Found';
        }
        if (this instanceof ConflictException) {
            this.httpCode = 409;
            this.message = 'Conflict';
        }
        if (this instanceof InternalServerException) {
            this.httpCode = 500;
            this.message = 'Internal Server Error';
        }
        if (typeof message != 'undefined') {
            this.message = message;
        }
    }
}

class BadRequestException extends HttpError {}
class UnAuthorizedException extends HttpError {}
class ForbiddenException extends HttpError {}
class NotFoundException extends HttpError {}
class ConflictException extends HttpError {}
class InternalServerException extends HttpError {}

export {
    HttpError,
    BadRequestException,
    UnAuthorizedException,
    ForbiddenException,
    NotFoundException,
    ConflictException,
    InternalServerException
}