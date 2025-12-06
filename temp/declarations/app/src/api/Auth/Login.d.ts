import type { LoginForm } from '@/types/Auth/login';
export interface CaptchaResult {
    captchaBase64Image: string;
    captchaUUId: string;
}
export declare function getCaptcha(): Promise<{
    success: boolean;
    errorMsg: string;
    data: CaptchaResult;
    total?: number;
    errCode?: number;
}>;
export interface LoginResult {
    token: string;
}
export declare function LoginByemail(data: LoginForm): Promise<{
    success: boolean;
    errorMsg: string;
    data: LoginResult;
    total?: number;
    errCode?: number;
}>;
