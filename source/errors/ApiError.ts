export interface ServerErrorResponse {
    name: string;
    message: string;
    details?: any;
}

export class ApiError extends Error {
    public __proto__: Error;
    public readonly code: number;
    public readonly details?: any;

    constructor(code: number, message?: string, details?: any) {
        // This includes a trick in order to make the instanceof properly work
        const trueProto = new.target.prototype;
        super(message);
        this.__proto__ = trueProto;

        this.code = code;
        this.details = details;
        this.name = 'ApiError';
    }

    public getServerResponse(): ServerErrorResponse {
        return {
            name: this.name,
            message: this.message,
            details: this.details
        };
    }
}
