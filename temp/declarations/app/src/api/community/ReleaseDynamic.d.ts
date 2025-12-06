export declare function ReleaseDynamic(data: {
    title: string;
    content: string;
    images?: string[];
}): Promise<{
    success: boolean;
    errorMsg: string;
    data: unknown;
    total?: number;
    errCode?: number;
}>;
