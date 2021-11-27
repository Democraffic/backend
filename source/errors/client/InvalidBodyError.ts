import { BadRequestError } from './BadRequestError';

export class InvalidBodyError extends BadRequestError {
    protected static readonly defaultMessage: string = 'Invalid body';

    constructor(message = InvalidBodyError.defaultMessage) {
        super(message);
        this.name = 'InvalidBodyError';
    }
}
