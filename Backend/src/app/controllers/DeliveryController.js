/* eslint-disable class-methods-use-this */

import Deliverymans from '../models/Deliverymans';
import Recipients from '../models/Recipients';

class DeliveryController {
    async store(req, res) {
        const deliverymanExists = await Deliverymans.findByPk({
            where: { deliveryman_id: req.body.deliveryman_id },
        });
        if (deliverymanExists) {
            return res
                .status(400)
                .json({ erro: 'Deliveryman doent not exist' });
        }

        const recipientExists = await Recipients.findByPk({
            where: { recipients: req.body.recipient_id },
        });

        if (!recipientExists) {
            return res.status(401).json({ erro: 'Recipients doent not exist' });
        }
        const deliveryman = await Deliverymans.create(req.body);

        return res.json(deliveryman);
    }
}

export default new DeliveryController();
