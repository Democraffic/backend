import { ObjectId } from '@/services/db.service';

export interface ReqIdParams {
    idParams: { [key: string]: ObjectId }
}