import jwt from 'jsonwebtoken';
import User from '../models/User';

class SessionController {
    // eslint-disable-next-line class-methods-use-this
    async store(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ error: 'User not Found' });
        }

        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: 'Password doesnt match' });
        }

        const { id, name } = user;

        return res.json({
            user: {
                id,
                name,
                email,
            },
            token: jwt.sign({ id }, '1929e2ff4fe77251cf5e2a47c823c571', {
                expiresIn: '7d',
            }), // 1929e2ff4fe77251cf5e2a47c823c571
        });
    }
}

export default new SessionController();
