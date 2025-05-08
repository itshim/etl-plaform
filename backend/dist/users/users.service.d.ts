import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(userData: {
        email: string;
        password: string;
    }): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
}
