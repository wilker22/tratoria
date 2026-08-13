import { Router, Request, Response } from 'express';
import multer from 'multer';
import uploadConfig from './config/multer';
import { CreateUserController } from './controllers/user/CreateUserController';
import { AuthUserController } from './controllers/user/AuthUserController'; 
import { validateSchema } from './midlewares/validateSchema';
import { createUserSchema, authUserSchema } from './schemas/userSchema';
import { DetailUserController } from './controllers/user/DetailUserController';
import { isAuthenticated } from './midlewares/isAuthenticated';
import { CreateCategoryController } from './controllers/category/CreateCategoryController';
import { isAdmin } from './midlewares/isAdmin';
import { createCategorySchema } from './schemas/createCategorySchema';
import { ListCategoryController } from './controllers/category/ListCategoryController';
import { CreateProductController } from './controllers/product/CreateProductController';
import { createProductSchema, listProductSchema } from './schemas/productSchema';
import { ListProductsController } from './controllers/product/ListProductsController';


const router = Router();
const upload = multer(uploadConfig); 


//Rotas Users
router.post("/users", validateSchema(createUserSchema), new CreateUserController().handle);
router.post("/session", validateSchema(authUserSchema), new AuthUserController().handle );
router.get("/me", isAuthenticated, new DetailUserController().handle);

//rotas category
router.post("/category", isAuthenticated, isAdmin, validateSchema(createCategorySchema), new CreateCategoryController().handle);
router.get("/category", isAuthenticated, new ListCategoryController().handle);

//rotas product
router.post("/product", isAuthenticated, isAdmin, upload.single('file'), validateSchema(createProductSchema), new CreateProductController().handle); 
router.get("/products", isAuthenticated, validateSchema(listProductSchema), new ListProductsController().handle);



export { router };