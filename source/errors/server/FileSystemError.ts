import { ApiError } from '../ApiError';

export class FileSystemError extends ApiError {
    public static readonly code = 500;
    private static readonly defaultMessage: string = 'File system error';

    constructor(message = FileSystemError.defaultMessage) {
        super(FileSystemError.code, message);

        this.name = 'FileSystemError';
    }
}
