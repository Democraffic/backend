import { BadRequestError } from './BadRequestError';

export class SpamDetected extends BadRequestError {
    protected static readonly defaultMessage: string = 'Spam detected';

    constructor(message = SpamDetected.defaultMessage, description?: string) {
        super(message, {
            description
        });
        this.name = 'SpamDetected';
    }
}