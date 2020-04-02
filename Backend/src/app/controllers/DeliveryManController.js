/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import fs from 'fs';

import Deliverymans from '../models/Deliverymans';
import File from '../models/File';

class DeliveryManController {
    // eslint-disable-next-line class-methods-use-this
    async store(req, res) {
        const deliverymanExists = await Deliverymans.findOne({
            where: { email: req.body.email },
        });
        if (deliverymanExists) {
            return res.status(400).json({ erro: 'DeliveryMan already exists' });
        }
        const deliveryman = await Deliverymans.create(req.body);

        return res.json(deliveryman);
    }

    // eslint-disable-next-line class-methods-use-this
    async index(req, res) {
        const deliverys = await Deliverymans.findAll({
            attributes: ['id', 'name', 'email'],
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

    // eslint-disable-next-line class-methods-use-this
    async update(req, res) {
        const { id } = req.params;
        const { email } = req.body;
        const delivery = await Deliverymans.findByPk(id);

        if (!delivery) {
            return res.status(400).json({ error: 'Delivery not found' });
        }

        if (!!email && email !== delivery.email) {
            const emailExists = await Deliverymans.findOne({
                where: { email },
            });

            if (emailExists) {
                return res.status(400).json({ error: 'E-mail already exists' });
            }
        }

        await delivery.update(req.body);

        return res.json(delivery);
    }

    async delete(req, res) {
        const { id } = req.params;

        const deliveryman = await Deliverymans.findByPk(id);

        if (!deliveryman) {
            return res.status(401).json({ error: 'User doents not exists' });
        }
        const avatarID = deliveryman.avatar_id; // pegando o id do avatar

        await deliveryman.destroy();

        if (avatarID !== null) {
            // Deletando o avatar do Usuario
            const avatarDelete = await File.findByPk(avatarID);
            const { path } = avatarDelete;
            await avatarDelete.destroy();

            // deletando o arquivo do servidor
            await fs.unlink(`tmp/uploads/${path}`, (err) => {
                console.log(err);
            });
            console.log('File Removed Succesfully');
        }

        const { name, email } = deliveryman;
        return res.json({
            id,
            name,
            email,
            avatarID,
        });
    }
}

export default new DeliveryManController();
