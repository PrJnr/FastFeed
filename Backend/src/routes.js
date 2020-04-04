import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import FileController from './app/controllers/FileController';
import SessionController from './app/controllers/SessionController';
import RecipientsController from './app/controllers/RecipientsController';
import DeliveryManController from './app/controllers/DeliveryManController';
import DeliveryController from './app/controllers/DeliveryController';
import UserController from './app/controllers/UserController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/recipients', RecipientsController.store);

routes.post('/files', upload.single('file'), FileController.store);

routes.put('/recipients/:id', RecipientsController.update);
routes.get('/recipients', RecipientsController.index);

routes.get('/deliverymans', DeliveryManController.index);
routes.post('/deliverymans', DeliveryManController.store);
routes.put('/deliverymans/:id', DeliveryManController.update);
routes.delete('/deliverymans/:id', DeliveryManController.delete);

routes.post('/deliverys', DeliveryController.store);
routes.put('/deliverys/:id', DeliveryController.update);
routes.get('/deliverys', DeliveryController.index);
routes.get('/deliverys/:id', DeliveryController.show);
routes.delete('/deliverys/:id', DeliveryController.delete);

routes.get('/users', UserController.index);

export default routes;
