import { ObjectId } from '@/services/db.service';

export enum ReportStatus {
    PROPOSED = 'proposed',
    CONSIDERED = 'considered'
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface Report {
    _id?: ObjectId;
    authorId: ObjectId;
    title: string;
    description: string;
    media: string[];
    coordinates: Coordinates[];
    createdAt: Date;
    lastUpdatedAt: Date | null;
    upvoters: ObjectId[];
    status: ReportStatus;
}