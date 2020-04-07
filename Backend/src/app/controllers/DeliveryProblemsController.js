/* eslint-disable class-methods-use-this */
import DeliveryProblems from '../models/Delivery_problems';
import Deliverys from '../models/Deliverys';
import Deliverymans from '../models/Deliverymans';
import Recipients from '../models/Recipients';
import Mail from '../../lib/Mail';

class DeliveryProblemsController {
    async index(req, res) {
        const deliverysProblem = await DeliveryProblems.findAll({
            include: [
                {
                    model: Deliverys,
                    as: 'delivery',
                },
            ],
        });

        return res.json(deliverysProblem);
    }

    async show(req, res) {
        const { id } = req.params;

        const deliveryProblem = await DeliveryProblems.findAll({
            where: {
                delivery_id: id,
            },
            include: [
                {
                    model: Deliverys,
                    as: 'delivery',
                },
            ],
        });

        if (!deliveryProblem) {
            return res
                .status(400)
                .json({ error: 'Dont have exists problems for this Delivery' });
        }

        return res.json({ deliveryProblem });
    }

    async store(req, res) {
        const { id } = req.params;

        const searchDelivery = await Deliverys.findOne({
            where: {
                id,
            },
        });

        if (!searchDelivery) {
            return res.status(400).json({ error: 'Dont Have exists Delivery' });
        }

        const deliveryProblem = await DeliveryProblems.create(req.body);

        return res.json(deliveryProblem);
    }

    async delete(req, res) {
        const { id } = req.params;

        const searchProblem = await DeliveryProblems.findByPk(id);
        if (!searchProblem) {
            return res
                .status(400)
                .json({ error: 'Dont Have Problems for Canceled' });
        }

        const { delivery_id } = searchProblem;

        const canceledDelivery = await Deliverys.findByPk(delivery_id);

        const { recipient_id } = canceledDelivery;

        const { deliveryman_id } = canceledDelivery;

        const findDeliveryman = await Deliverymans.findByPk(deliveryman_id);
        const findRecipient = await Recipients.findByPk(recipient_id);

        if (!canceledDelivery) {
            return res.status(400).json({ error: 'Delivery dont have exists' });
        }

        canceledDelivery.canceled_at = new Date();

        await canceledDelivery.save();

        await Mail.sendMail({
            to: `${findDeliveryman.name} <${findDeliveryman.email}>`,
            subject: 'Entrega Cancelada',
            template: 'canceledDeliveryOrder',
            context: {
                id,
                deliveryman: findDeliveryman.name,
                recipient: findRecipient.name,
                product: canceledDelivery.product,
                delivery: searchProblem.description,
            },
        });

        return res.json({ error: 'Canceled Delivery: ', canceledDelivery });
    }
}

export default new DeliveryProblemsController();
