import jwt from 'jsonwebtoken';
import Personnel from '../models/Personnel/Personnel.js'; // Adjust path accordingly

const SECRET_KEY = process.env.SECRET_KEY; // Use env variables for secrets

export const authenticateToken = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: 'Unauthenticated.' });
    }

    const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);

    const personnel = await Personnel.findById(decoded.id)
      .select('-password -refreshToken');

    if (!personnel) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.personnel = {
      id: personnel._id,
      role: personnel.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token expired or invalid.' });
  }
};
