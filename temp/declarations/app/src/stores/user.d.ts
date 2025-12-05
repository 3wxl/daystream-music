export declare const useUserStore: import("pinia").StoreDefinition<"user", Pick<{
    token: globalThis.Ref<string, string>;
    userInfo: globalThis.Ref<any, any>;
    login: (loginForm: any) => Promise<{
        success: boolean;
        errorMsg: string;
        data: import("@/api/Auth/Login").LoginResult;
        total?: number;
        errCode?: number;
    }>;
    logout: () => void;
    getUsersInfo: () => Promise<void>;
}, "userInfo" | "token">, Pick<{
    token: globalThis.Ref<string, string>;
    userInfo: globalThis.Ref<any, any>;
    login: (loginForm: any) => Promise<{
        success: boolean;
        errorMsg: string;
        data: import("@/api/Auth/Login").LoginResult;
        total?: number;
        errCode?: number;
    }>;
    logout: () => void;
    getUsersInfo: () => Promise<void>;
}, never>, Pick<{
    token: globalThis.Ref<string, string>;
    userInfo: globalThis.Ref<any, any>;
    login: (loginForm: any) => Promise<{
        success: boolean;
        errorMsg: string;
        data: import("@/api/Auth/Login").LoginResult;
        total?: number;
        errCode?: number;
    }>;
    logout: () => void;
    getUsersInfo: () => Promise<void>;
}, "login" | "logout" | "getUsersInfo">>;
