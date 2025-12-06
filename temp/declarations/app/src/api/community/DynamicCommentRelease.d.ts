export declare function DynamicCommentRelease(data: {
    targetId: string;
    targetType: number;
    content: string;
}): Promise<{
    success: boolean;
    errorMsg: string;
    data: unknown;
    total?: number;
    errCode?: number;
}>;
