import { TGeneralObject } from '../../interface';
declare const JwtStrategy_base: any;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: TGeneralObject): {
        id: TGeneralObject;
        email: TGeneralObject;
    };
}
export {};
