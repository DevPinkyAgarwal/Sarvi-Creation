import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';

interface JwtPayload {
    userId: string;
}

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.user = await User.findById(decoded.userId).select('-password');
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, user not found.' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, invalid token.' });
    }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin.' });
    }
};
