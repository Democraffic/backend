import { ApiError } from '../ApiError';

export class InternalServerError extends ApiError {
    public static readonly code = 500;
    private static readonly defaultMessage: string = 'Internal server error';

    constructor(message = InternalServerError.defaultMessage) {
        super(InternalServerError.code, message);

        this.name = 'InternalServerError';
    }
}
