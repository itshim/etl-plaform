import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: {
        email: string;
        password: string;
    }): Promise<{
        id: number;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    login(req: any): Promise<{
        access_token: string;
    }>;
}
