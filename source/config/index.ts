/* eslint-disable @typescript-eslint/naming-convention */
import * as dotenv from 'dotenv';
import * as path from 'path';

declare const process: {
    env: Record<string, string>;
    cwd: () => string;
};

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const packageJson = require(path.join(process.cwd(), 'package.json'));

dotenv.config({
    path: path.join(process.cwd(), '.env')
});

const CONFIG = {
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    SERVER: {
        PORT: process.env.PORT ?? process.env.SERVER_PORT ?? 3000
    },
    MONGO: {
        URI: process.env.MONGO_URL,
        DB: process.env.MONGO_DB
    },
    LOGGER: {
        DEBUG: process.env.LOGGER_DEBUG === 'true'
    },
    UPLOAD: {
        SIZE_LIMIT: +process.env.UPLOAD_SIZE_LIMIT
    },
    TEMP: {
        PATH: process.env.TEMP_PATH
    },
    STORED: {
        PATH: process.env.STORED_PATH,
        PATHS: {
            MEDIA: 'media'
        }
    },
    API_SPAM_URL: process.env.API_SPAM_URL,
    API_VERSION: packageJson.version
};

export default CONFIG;
