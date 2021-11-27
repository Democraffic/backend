import { BadRequestError } from './BadRequestError';

export class InvalidIdError extends BadRequestError {
    protected static readonly defaultMessage: string = 'Invalid id';

    constructor(message = InvalidIdError.defaultMessage, details?: { param: { name: string, value: any } }) {
        super(message, details);
        this.name = 'InvalidIdError';
    }
}