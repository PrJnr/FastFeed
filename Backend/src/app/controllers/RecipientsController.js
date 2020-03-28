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
}

export default new RecipientsController();
