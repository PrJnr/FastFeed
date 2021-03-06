import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import FileController from './app/controllers/FileController';
import SessionController from './app/controllers/SessionController';
import RecipientsController from './app/controllers/RecipientsController';
import DeliveryManController from './app/controllers/DeliveryManController';
import DeliveryController from './app/controllers/DeliveryController';
import UserController from './app/controllers/UserController';
import DeliveryProblemsController from './app/controllers/DeliveryProblemsController';

import StatusDeliveryController from './app/controllers/StatusDeliveryController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);
// ROTAS DO ENTREGADOR
// Status delivery for Deliveryman
routes.get('/deliverymen/:id/deliveries', StatusDeliveryController.index);
routes.put(
    '/deliverymen/:id/deliveries/:deliveryID',
    StatusDeliveryController.update
);
routes.post(
    '/deliverymen/:id/deliveries/:deliveryID',
    upload.single('file'),
    StatusDeliveryController.store
);
// CADASTRO DE PROBLEMA
routes.post('/delivery/:id/problems', DeliveryProblemsController.store);

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

routes.get('/delivery/problems', DeliveryProblemsController.index);
routes.get('/delivery/:id/problems', DeliveryProblemsController.show);
routes.delete(
    '/problem/:id/cancel-delivery',
    DeliveryProblemsController.delete
);

routes.get('/users', UserController.index);

export default routes;
