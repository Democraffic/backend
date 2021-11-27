import { ApiError } from '../ApiError';

export class BadRequestError extends ApiError {
    public static readonly code = 400;
    protected static readonly defaultMessage: string = 'Bad request';

    constructor(message = BadRequestError.defaultMessage) {
        super(BadRequestError.code, message);
        this.name = 'BadRequestError';
    }
}
