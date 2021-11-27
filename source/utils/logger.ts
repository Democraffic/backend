import { Logger } from 'euberlog';
import CONFIG from '@/config';

export default new Logger({
    debug: CONFIG.LOGGER.DEBUG
});
