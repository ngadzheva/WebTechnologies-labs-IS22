import { Request, Response } from 'express';
import UserController from '../controllers/users-controller';
import IUser from '../interfaces/user';

const controller: UserController = new UserController();

const validateUser = (request: Request, response: Response, next: () => void): void => {
    const user: IUser = request.body;

    const isValidUser: string[] = controller.validateUser(user);

    if (isValidUser.length > 0) {
        response.status(400).json({error: isValidUser});
    } else {
        next();
    }
}

export default validateUser;