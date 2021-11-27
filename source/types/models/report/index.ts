import { ObjectId } from '@/services/db.service';

export enum ReportStatus {
    PROPOSED = 'proposed',
    CONSIDERED = 'considered'
}

export enum SolutionStatus {
    PROPOSED = 'proposed',
    CONSIDERED = 'considered'
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface Budget {
    cost: number;
    carbonFootprint: number;
    startDate: Date;
    endDate: Date;
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

export interface Solution {
    _id?: ObjectId;
    reportId: ObjectId;
    authorId: ObjectId;
    title: string;
    description: string;
    createdAt: Date;
    lastUpdatedAt: Date | null;
    status: SolutionStatus;
    badget: Budget | null;
}