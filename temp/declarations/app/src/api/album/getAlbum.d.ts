export declare const getAlbum: (pageNum: any, pageSize: any) => Promise<{
    success: boolean;
    errorMsg: string;
    data: unknown;
    total?: number;
    errCode?: number;
}>;
