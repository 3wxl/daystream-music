export declare function GetReplyCommentList(data: {
    parentId: string;
    lastId?: string;
    size: number;
}): Promise<{
    success: boolean;
    errorMsg: string;
    data: unknown;
    total?: number;
    errCode?: number;
}>;
