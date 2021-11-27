import { BadRequestError } from './BadRequestError';

export class InvalidTokenError extends BadRequestError {
    protected static readonly defaultMessage: string = 'Invalid provided token';

    constructor(message = InvalidTokenError.defaultMessage) {
        super(message);
        this.name = 'InvalidTokenError';
    }
}
