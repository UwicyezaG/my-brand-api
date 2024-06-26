

import jwt, {Secret} from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";

interface LogUserRequest extends Request {
    user?: any;
}

export const authenticatedUser = (
    req: LogUserRequest,
    res: Response,
    next: NextFunction
) => {
    const headers = req.headers["authorization"];
    const token = headers && headers.split(" ")[1];
    if (!token) {
        return res.status(401).json({message: "Authentication required."});
    }
    try {
        req.user = jwt.verify(token, "bakame" as Secret);
        next();
    } catch (error) {
        res.status(400).json({message: "Invalid Token"});
    }
};