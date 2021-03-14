import { Request, Response } from 'express';
import {Logger} from "common/logger";

export class PingController {

    // @ts-ignore
    private ping(req:Request, res:Response){
        Logger.log(req.params.id);
        return res.status(200).json({
            status: 'ok',
        })
    }

}