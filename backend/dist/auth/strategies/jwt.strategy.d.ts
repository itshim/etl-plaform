import { Strategy } from 'passport-jwt';
import { TGeneralObject } from '../../interface';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: TGeneralObject): {
        id: TGeneralObject;
        email: TGeneralObject;
    };
}
export {};
