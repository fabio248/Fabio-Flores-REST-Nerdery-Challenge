import { Router, Application } from 'express';
import { accountRouter } from './account.routes';

export default function routerApi(app: Application) {
  const router: Router = Router();
  app.use('/api/v1', router);
  router.use('/accounts', accountRouter);
}
