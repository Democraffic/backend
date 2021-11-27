import { BadRequestError } from './BadRequestError';

export class InvalidQueryParamError extends BadRequestError {
    protected static readonly defaultMessage: string = 'Invalid query param';

    constructor(message = InvalidQueryParamError.defaultMessage) {
        super(message);
        this.name = 'InvalidQueryParamError';
    }
}
