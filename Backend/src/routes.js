import { Router } from 'express';

import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.get();

routes.post('/sessions', SessionController.store);

export default routes;
