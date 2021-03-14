import { App } from 'app/app';
import { Logger } from 'common/logger';

Logger.logTask('SYSTEM', 'STARTING');

const app = new App();
app.start(4000)

Logger.logTask('SYSTEM', 'FINISHED');