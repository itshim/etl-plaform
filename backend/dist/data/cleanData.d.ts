interface CleanDataOptions {
    removeDuplicates: boolean;
    missingThreshold: number;
    nullValues: string[];
}
declare function cleanData(data: any, options?: Partial<CleanDataOptions>): any;
export default cleanData;
