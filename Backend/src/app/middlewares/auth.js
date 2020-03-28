import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    const [, token] = authHeader.split(' ');

    try {
        // eslint-disable-next-line no-unused-vars
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);
        // req.adminId = decoded.id;
        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Tokein Invalid' });
    }
};