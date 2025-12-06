export declare function updateImage(submitData: {
    "file": FormData;
}): Promise<{
    success: boolean;
    errorMsg: string;
    data: unknown;
    total?: number;
    errCode?: number;
}>;
