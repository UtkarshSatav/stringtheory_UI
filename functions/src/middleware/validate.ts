import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req[property], { abortEarly: false, stripUnknown: true });

        if (error) {
            const messages = error.details.map((x) => x.message).join(', ');
            return res.status(400).json({ success: false, message: `Validation Error: ${messages}` });
        }

        // Re-assign the validated value (helps with stripped unknown fields/defaults)
        req[property] = value;
        next();
    };
};
