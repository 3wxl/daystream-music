export declare function getDynamicList(submitData: {
    "userId"?: number;
    "keyWord"?: string;
    "lastId"?: string;
    "pageSize": number;
}): Promise<{
    success: boolean;
    errorMsg: string;
    data: unknown;
    total?: number;
    errCode?: number;
}>;
