import Deliverymans from '../models/Deliverymans';
import File from '../models/File';

class DeliveryManController {
    // eslint-disable-next-line class-methods-use-this
    async store(req, res) {
        /*  const deliverymanExists = await DeliveryMan.findOne({
            where: { email: req.body.email },
        });
        if (deliverymanExists) {
            return res.status(400).json({ erro: 'DeliveryMan already exists' });
        } */
        const deliveryman = await Deliverymans.create(req.body);

        return res.json(deliveryman);
    }

    // eslint-disable-next-line class-methods-use-this
    async index(req, res) {
        const deliverys = await Deliverymans.findAll({
            where: { deliverymans: true },
            include: [
                {
                    model: File,
                    as: 'avatar',
                    attributes: ['name', 'path'],
                },
            ],
            order: [['createdAt', 'desc']],
        });
        return res.json(deliverys);
    }
}

export default new DeliveryManController();
