import { MongoClient, Db, ClientSession, TransactionOptions, ReadPreference, ReadConcern, ObjectId } from 'mongodb';
import CONFIG from '@/config';

export { ObjectId } from 'mongodb';

export async function dbQuery<ResultType>(callback: (db: Db) => Promise<ResultType>): Promise<ResultType> {
    const connection = await MongoClient.connect(CONFIG.MONGO.URI);
    const db = connection.db(CONFIG.MONGO.DB);

    let result!: ResultType;
    let error: any;

    try {
        result = await callback(db);
    } catch (error_) {
        error = error_;
    } finally {
        await connection.close();

        if (error) {
            throw error;
        } else {
            return result;
        }
    }
}

export async function dbTransaction<ResultType>(
    callback: (db: Db, session: ClientSession) => Promise<ResultType>
): Promise<ResultType> {
    const connection = await MongoClient.connect(CONFIG.MONGO.URI);
    const db = connection.db(CONFIG.MONGO.DB);
    const session = connection.startSession();

    const transactionOptions: TransactionOptions = {
        readPreference: new ReadPreference('primary'),
        readConcern: new ReadConcern('local'),
        writeConcern: { w: 'majority' }
    };

    let result!: ResultType;
    let error: any;

    try {
        await session.withTransaction(async () => {
            result = await callback(db, session);
        }, transactionOptions);
    } catch (error_) {
        error = error_;
    } finally {
        await session.endSession();
        await connection.close();

        if (error) {
            throw error;
        } else {
            return result;
        }
    }
}

export function dbId(_id: string): ObjectId {
    return new ObjectId(_id);
}