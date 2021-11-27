import { BadRequestError } from './BadRequestError';

export class InvalidActionError extends BadRequestError {
    protected static readonly defaultMessage: string = 'Invalid action';

    constructor(message = InvalidActionError.defaultMessage) {
        super(message);
        this.name = 'InvalidActionError';
    }
}
