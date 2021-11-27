import { ApiError } from '../ApiError';

export class NotFoundError extends ApiError {
    public static readonly code = 404;
    protected static readonly defaultMessage: string = 'Not found';

    constructor(message = NotFoundError.defaultMessage) {
        super(NotFoundError.code, message);
        this.name = 'NotFoundError';
    }
}
