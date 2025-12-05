import type { ForgotForm } from '@/types/Auth/forgot';
export declare function setNewpassword(data: ForgotForm): Promise<{
    success: boolean;
    errorMsg: string;
    data: unknown;
    total?: number;
    errCode?: number;
}>;
