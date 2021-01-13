declare type TPath = {
    type: 'sub' | 'ins' | 'del';
    aChar: string;
    bChar: string;
    aIndex: number;
    bIndex: number;
};
/**
 * @param String a 源字符串
 * @param String b 目标字符串
 * @return Object {distance, path}
 */
declare function editDistance(a?: string, b?: string): {
    distance: number;
    path: TPath[];
};
export default editDistance;
