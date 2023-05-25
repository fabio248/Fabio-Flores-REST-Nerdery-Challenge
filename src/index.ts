/// <reference types="./types/express.d.ts" />
import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import config from './config';
import routerApi from './routes';
import {
  errorValidateHandler,
  genericErrorHandler,
} from './middleware/error.middleware';
import { initEvents } from './event';

const app: Application = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// import authenticate methods
import './utils/auth/index';

app.get('/ping', (_req: Request, res: Response) => {
  res.send('pong');
});

routerApi(app);

app.use(errorValidateHandler);
app.use(genericErrorHandler);

app.listen(config.port, () => {
  console.log(`Running on port ${config.port}`);
  initEvents();
});
