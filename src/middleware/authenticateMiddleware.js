import jwt from 'jsonwebtoken';
import Personnel from '../models/Personnel/Personnel.js'; // Adjust path accordingly

const SECRET_KEY = process.env.SECRET_KEY; // Use env variables for secrets

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization header missing or malformed.' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access token missing.' });
        }

        const decoded = jwt.verify(token, SECRET_KEY);

       
        const personnel = await Personnel.findById(decoded.id).select('-password -refreshToken');
        if (!personnel) {
            return res.status(401).json({ message: 'Invalid token: personnel not found.' });
        }

        req.personnel = { id: personnel._id, role: personnel.role, ...personnel.toObject() };

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token.' + error.message });
    }
};
