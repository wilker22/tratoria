import { Router, Request, Response } from 'express';
import { CreateUserController } from './controllers/user/CreateUserController';
import { AuthUserController } from './controllers/user/AuthUserController'; 
import { validateSchema } from './midlewares/validateSchema';
import { createUserSchema, authUserSchema } from './schemas/userSchema';
import { DetailUserController } from './controllers/user/DetailUserController';
import { isAuthenticated } from './midlewares/isAuthenticated';


const router = Router();


//Rotas Users
router.post("/users", validateSchema(createUserSchema), new CreateUserController().handle);
router.post("/session", validateSchema(authUserSchema), new AuthUserController().handle );
router.get("/me", isAuthenticated, new DetailUserController().handle);
export { router };