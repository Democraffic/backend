import { ApiError } from '../ApiError';

export class UserNotAuthorizedError extends ApiError {
    public static readonly code = 403;
    private static readonly defaultMessage: string = 'User not authorized';

    constructor(message = UserNotAuthorizedError.defaultMessage) {
        super(UserNotAuthorizedError.code, message);
        this.name = 'UserNotAuthorizedError';
    }
}
