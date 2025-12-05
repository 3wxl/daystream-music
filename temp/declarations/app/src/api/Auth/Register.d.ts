import type { RegisterForm } from '@/types/Auth/register';
export declare function registerUser(data: RegisterForm): Promise<{
    success: boolean;
    errorMsg: string;
    data: unknown;
    total?: number;
    errCode?: number;
}>;
export declare function getEmailCaptcha(toEmail: string): Promise<{
    success: boolean;
    errorMsg: string;
    data: unknown;
    total?: number;
    errCode?: number;
}>;
