import { User } from '../../users/entities/user.entity';
export declare class DataFile {
    id: number;
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    preview: any;
    columns: string[];
    userId: number;
    user: User;
    createdAt: Date;
}
