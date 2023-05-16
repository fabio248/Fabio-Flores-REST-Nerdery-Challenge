import { Router, Application } from 'express';

export default function routerApi(app: Application) {
  const router: Router = Router();
  app.use('/api/v1', router);
}
