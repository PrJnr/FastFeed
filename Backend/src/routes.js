import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import RecipientsController from './app/controllers/RecipientsController';

const routes = new Router();

routes.post('/recipients', RecipientsController.store);

routes.post('/sessions', SessionController.store);

export default routes;
