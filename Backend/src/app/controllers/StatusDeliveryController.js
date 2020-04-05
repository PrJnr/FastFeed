/* eslint-disable class-methods-use-this */
import { Op } from 'sequelize';
import * as Yup from 'yup';
import { startOfDay, endOfDay, parseISO, startOfHour, format } from 'date-fns';

import Delivery from '../models/Deliverys';
import Deliverymans from '../models/Deliverymans';
import File from '../models/File';

class StatusDeliveryController {
    async index(req, res) {
        const { id } = req.params;
        const { available, end_date } = req.query;

        const validatedDeliveryman = await Deliverymans.findByPk(id);

        if (!validatedDeliveryman) {
            return res.status(400).json({ erro: 'Deliveryman not found' });
        }
        // true nos dois
        if (available && end_date) {
            return res.status(400).json({ erro: 'Invalid Filters' });
        }

        // available = true
        if (!end_date && available) {
            const myDeliverys = await Delivery.findAll({
                where: {
                    deliveryman_id: id,
                    end_date: null,
                    canceled_at: null,
                },
            });

            return res.json({ message: 'Deliveries Available: ', myDeliverys });
        }
        // null
        if (!available && !end_date) {
            return res
                .status(400)
                .json({ erro: 'Invalid Filters, 1 filter is required' });
        }
        // se o end_date vier true
        const myDeliverys = await Delivery.findAll({
            where: {
                deliveryman_id: id,
                end_date: { [Op.ne]: null },
            },
        });

        return res.json({ message: 'Deliveries Finished', myDeliverys });
    }

    async store(req, res) {
        const { deliveryID } = req.params;
        const checkDelivery = await Delivery.findByPk(deliveryID);
        if (!checkDelivery) {
            return res.status(400).json({ error: 'Invalid Delivery' });
        }
        const { originalname: name, filename: path } = req.file;

        const file = await File.create({
            name,
            path,
        });

        return res.json(file);
    }

    async update(req, res) {
        const { id, deliveryID } = req.params;

        const CheckDelivery = await Delivery.findByPk(deliveryID);
        if (!CheckDelivery) {
            return res.status(400).json({ error: 'Delivery not found' });
        }
        const deliveryman = await Deliverymans.findByPk(id);
        if (!deliveryman) {
            return res.status(401).json({
                error: 'You can not accept delivery, just deliveryman  ',
            });
        }
        const deliveryForMan = await Delivery.findOne({
            where: { id: deliveryID, deliveryman_id: id },
        });
        if (!deliveryForMan) {
            return res.status(401).json({
                error:
                    'not unauthorized accepting delivery of other deliveryman',
            });
        }
        const AcceptedDelivery = await Delivery.findOne({
            where: {
                id: deliveryID,
                start_date: null,
            },
        });

        if (AcceptedDelivery) {
            const schema = Yup.object().shape({
                start_date: Yup.date().required(),
            });
            if (!(await schema.isValid(req.body))) {
                return res.status(400).json({ error: 'Validation fails' });
            }
            const { start_date } = req.body;
            const searchDate = parseISO(start_date);

            const deliveryLimit = await Delivery.findAll({
                where: {
                    deliveryman_id: req.params.id,
                    start_date: {
                        [Op.between]: [
                            startOfDay(searchDate),
                            endOfDay(searchDate),
                        ],
                    },
                },
            });

            if (deliveryLimit.length >= 5) {
                return res
                    .status(401)
                    .json({ error: 'Your limit of deliveries go reached' });
            }

            const startHour = Number(
                format(startOfHour(parseISO(start_date)), 'H')
            );
            if (startHour < 8 || startHour >= 18) {
                return res.status(401).json({ error: 'Outside working hours' });
            }

            await AcceptedDelivery.update(req.body);

            return res.json({
                message: 'Deliverie Accepted ',
                AcceptedDelivery,
            });
        }

        const finishedDelivery = await Delivery.findOne({
            where: {
                id: deliveryID,
            },
        });
        const { end_date, signature_id } = req.body;

        const validated = Yup.object().shape({
            end_date: Yup.date().required(),
        });
        if (!(await validated.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }
        const startHour = Number(format(startOfHour(parseISO(end_date)), 'H'));
        if (startHour < 8 || startHour >= 18) {
            return res.status(401).json({ error: 'Outside working hours' });
        }
        const searchSignature = await File.findByPk(signature_id);
        if (!searchSignature) {
            return res.status(400).json({ error: 'Invalid Signature' });
        }

        await finishedDelivery.update(req.body);
        return res.json({ message: 'Delivery Finished: ', finishedDelivery });
    }
}

export default new StatusDeliveryController();
