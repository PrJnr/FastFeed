/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';
import Deliveryman from '../models/Deliverymans';

import Delivery from '../models/Deliverys';
import File from '../models/File';

import Mail from '../../lib/Mail';
import Recipients from '../models/Recipients';

class DeliveryController {
    async store(req, res) {
        const { recipient_id } = req.body;
        const { deliveryman_id } = req.body;

        const confirmedFields = Yup.object().shape({
            recipient_id: Yup.number().required(),
            deliveryman_id: Yup.number().required(),
            product: Yup.string().required(),
        });

        if (!(await confirmedFields.isValid(req.body))) {
            return res.status(400).json({ error: 'Invalid field(s)' });
        }

        const deliverymanExists = await Deliveryman.findByPk(deliveryman_id);
        const deliveryman = await Deliveryman.findOne({
            where: deliveryman_id,
        });

        if (!deliverymanExists) {
            return res.status(400).json({ erro: 'Deliveryman not found' });
        }

        const recipientExists = await Recipients.findByPk(recipient_id);
        const recipient = await Recipients.findOne({
            where: recipient_id,
        });

        if (!recipientExists) {
            return res.status(401).json({ erro: 'Recipients doent not exist' });
        }
        const deliverys = await Delivery.create(req.body);

        await Mail.sendMail({
            to: `${deliveryman.name} <${deliveryman.email}>`,
            subject: 'Nova Entrega Disponivel para retirada',
            template: 'createdDeliveryOrder',
            context: {
                deliveryman: deliveryman.name,
                recipient: recipient.name,
                product: req.body.product,
                street: recipient.street,
                number: recipient.number,
                city: recipient.city,
                state: recipient.state,
                complement: recipient.complement,
            },
        });

        return res.json(deliverys);
    }

    async index(req, res) {
        const delivery = await Delivery.findAll({
            attributes: [
                'id',
                'product',
                'canceled_at',
                'start_date',
                'end_date',
                'deliveryman_id',
                'recipient_id',
                'signature_id',
            ],

            order: [['createdAt', 'desc']],
        });
        return res.json(delivery);
    }

    async show(req, res) {
        const { id } = req.params;
        const delivery = await Delivery.findByPk(id, {
            attributes: { exclude: ['signature_id', 'path'] },
            include: [
                { model: File, as: 'signature' },
                { model: Recipients, as: 'recipient' },
                { model: Deliveryman, as: 'deliveryman' },
            ],
        });

        if (!delivery) {
            return res.status(400).json({ error: 'Not found Delivery' });
        }
        return res.json(delivery);
    }

    async update(req, res) {
        const { id } = req.params;
        const validated = Yup.object().shape({
            recipient_id: Yup.number(),
            deliveryman_id: Yup.number(),
            signature_id: Yup.number(),
            product: Yup.string(),
            canceled_at: Yup.date(),
            start_date: Yup.date(),
            end_date: Yup.date(),
        });

        if (!(await validated.isValid(req.body))) {
            return res.status(400).json({ error: 'Invalid field(s)' });
        }

        const delivery = await Delivery.findByPk(id);

        if (!delivery) {
            return res.status(400).json({ erro: 'Not Found Delivery' });
        }

        const { recipient_id, deliveryman_id } = req.body;

        const recipient = await Recipients.findByPk(recipient_id);

        if (!recipient) {
            return res.status(400).json({ error: 'Recipient not found' });
        }

        const deliveryman = await Deliveryman.findByPk(deliveryman_id);

        if (!deliveryman) {
            return res.status(400).json({ error: 'Deliveryman not found' });
        }

        await delivery.update(req.body);

        return res.json(delivery);
    }

    async delete(req, res) {
        const { id } = req.params;

        const searchDelivery = await Delivery.findByPk(id);

        if (!searchDelivery) {
            return res.status(400).json({ erro: 'Delivery not found' });
        }

        const date = new Date();
        await searchDelivery.destroy({ canceled_at: date });

        return res.json({
            status: `Delivery nº ${id} Deleted `,
            searchDelivery,
        });
    }
}

export default new DeliveryController();
