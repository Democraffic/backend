import { BadRequestError } from './BadRequestError';

export class ForeignKeyError extends BadRequestError {
    protected static readonly defaultMessage: string = 'Foreign key constraint failed';

    constructor(message = ForeignKeyError.defaultMessage) {
        super(message);
        this.name = 'ForeignKeyError';
    }
}
