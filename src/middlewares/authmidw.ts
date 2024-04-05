import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateUser = (
    req: Request,
    res: Response,
    next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, 'bakame') as { userId: string };
        req.userId = decoded.userId; // Attach user ID to request for further use
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};