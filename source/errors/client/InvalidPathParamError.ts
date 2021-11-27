import { BadRequestError } from './BadRequestError';

export class InvalidPathParamError extends BadRequestError {
    protected static readonly defaultMessage: string = 'Invalid path param';

    constructor(message = InvalidPathParamError.defaultMessage) {
        super(message);
        this.name = 'InvalidPathParamError';
    }
}
