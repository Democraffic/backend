import { InvalidBodyError } from './InvalidBodyError';

export class UniqueRootError extends InvalidBodyError {
    protected static readonly defaultMessage: string = 'There can be only one root user';

    constructor(message = UniqueRootError.defaultMessage) {
        super(message);
        this.name = 'UniqueRootError';
    }
}
