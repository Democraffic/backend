import { UserNotAuthenticatedError } from './UserNotAuthenticatedError';

export class InvalidCredentialsError extends UserNotAuthenticatedError {
    protected static readonly defaultMessage: string = 'Invalid credentials';

    constructor(message = InvalidCredentialsError.defaultMessage) {
        super(message);
        this.name = 'InvalidCredentialsError';
    }
}
