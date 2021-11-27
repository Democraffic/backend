import { ApiError } from '../ApiError';

export class UserNotAuthenticatedError extends ApiError {
    public static readonly code = 401;
    protected static readonly defaultMessage: string = 'User not authenticated';

    constructor(message = UserNotAuthenticatedError.defaultMessage) {
        super(UserNotAuthenticatedError.code, message);
        this.name = 'UserNotAuthenticatedError';
    }
}
