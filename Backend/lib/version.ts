import * as dotenv from 'dotenv';

export function GetVersion() {
    dotenv.config();
    return process.env.VERSION;
}