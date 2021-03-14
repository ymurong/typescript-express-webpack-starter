import { config } from 'config/config';
import * as bodyParser from 'body-parser';
import { Logger } from 'common/logger';
import {Server} from "core/server";
// @ts-ignore
import * as controllers from './controllers';
import { Request, Response } from 'express';

export class App extends Server{

    constructor() {
        super();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        // this.setupControllers();
    }

    // @ts-ignore
    private setupControllers(): void {
        const controllerInstances = [];
        for (const name of Object.keys(controllers)) {
            const controller = (controllers as any)[name];
            if (typeof controller === 'function') {
                controllerInstances.push(new controller());
            }
        }
        super.addControllers(controllerInstances);
    }


    public start(port?: number): void {
        port = port || 3000;
        this.app.get('*', (req: Request, res: Response) => {
            res.send("hello world");
        });
        this.app.listen(port, () => {
            this.logAppInfo();
        });
    }

    private logAppInfo(): void {
        Logger.logTask('APP', {
            develop: DEVELOP,
            version: VERSION,
            config: config,
        });
    }
}