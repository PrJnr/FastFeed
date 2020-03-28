import Recipients from '../models/Recipients';

class RecipientsController {
    // eslint-disable-next-line class-methods-use-this
    async store(req, res) {
        const recipients = await Recipients.create(req.body);

        return res.json(recipients);
    }
}

export default new RecipientsController();
