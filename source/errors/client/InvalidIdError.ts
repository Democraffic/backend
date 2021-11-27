import { BadRequestError } from './BadRequestError';

export class InvalidIdError extends BadRequestError {
    protected static readonly defaultMessage: string = 'Invalid id';

    constructor(message = InvalidIdError.defaultMessage) {
        super(message);
        this.name = 'InvalidIdError';
    }
}
