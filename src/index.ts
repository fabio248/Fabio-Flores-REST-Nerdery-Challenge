import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import config from './config';

const app: Application = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/ping', (_req: Request, res: Response) => {
  res.send('pong');
});

app.listen(config.port, () => {
  console.log(`Running on port ${config.port}`);
});
