import Recipients from '../models/Recipients';

class RecipientsController {
    // eslint-disable-next-line class-methods-use-this
    async store(req, res) {
        const recipientsExists = await Recipients.findOne({
            where: { name: req.body.name },
        });
        if (recipientsExists) {
            return res.status(400).json({ erro: 'Recipients already exists' });
        }
        const recipients = await Recipients.create(req.body);

        return res.json(recipients);
    }

    // eslint-disable-next-line class-methods-use-this
    async update(req, res) {
        const { id } = req.params;

        const recipient = await Recipients.findByPk(id);

        // const validId = await Recipients.findByPk(id);
        if (!recipient) {
            return res
                .status(401)
                .json({ error: 'Recipient not doents exists' });
        }

        const {
            name,
            street,
            number,
            complement,
            state,
            city,
            zip_code,
        } = await recipient.update(req.body);

        console.log(recipient);

        return res.json({
            id,
            name,
            street,
            number,
            complement,
            state,
            city,
            zip_code,
        });
    }
}

export default new RecipientsController();
