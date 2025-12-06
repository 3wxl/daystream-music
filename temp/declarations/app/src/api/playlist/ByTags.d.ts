export declare function getlistByTags(currentTag: any, pageNum: any, pageSize: any): Promise<{
    success: boolean;
    errorMsg: string;
    data: unknown;
    total?: number;
    errCode?: number;
}>;
