import boom from '@hapi/boom';
import { Request, Response, NextFunction } from 'express';

type ValidatorHandler = (schema: any, property: string) => (req: Request, res: Response, next: NextFunction) => void;

interface RequestWithProperty extends Request {
  [key: string]: any;
}

const validatorHandler: ValidatorHandler = (schema, property) => {
  return (req: RequestWithProperty, res, next) => {
    const data = req[property];
    const { error } = schema.validate(data, { 
      abortEarly: false
    });
    if (error) {
      next(boom.badRequest(error));
    }
    next();
  }
}

export default validatorHandler;
