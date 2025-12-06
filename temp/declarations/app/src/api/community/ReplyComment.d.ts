export declare function ReplyComment(data: {
    parentId: string;
    content: string;
}): Promise<{
    success: boolean;
    errorMsg: string;
    data: unknown;
    total?: number;
    errCode?: number;
}>;
