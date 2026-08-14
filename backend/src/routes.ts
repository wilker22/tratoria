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
import { createProductSchema, listProductByCategorySchema, listProductSchema } from './schemas/productSchema';
import { ListProductsController } from './controllers/product/ListProductsController';
import { DeleteProductController } from './controllers/product/DeleteProductController';
import { ListProductByCategoryController } from './controllers/product/ListProductByCategoryController';
import { CreateOrderController } from './controllers/order/CreateOrderController';
import { addItemSchema, createOrderSchema, detailOrderSchema, finishOrderSchema, removeItemSchema, sendOrderSchema } from './schemas/createOrderSchema';
import { ListOrdersController } from './controllers/order/ListOrdersController';
import { AddItemController } from './controllers/order/AddItemController';
import { RemoveItemController } from './controllers/order/RemoveItemController';
import { DetailOrderController } from './controllers/order/DetailOrderController';
import { SendOrderController } from './controllers/order/SendOrderController';
import { FinishOrderController } from './controllers/order/FinishOrderController';


const router = Router();
const upload = multer(uploadConfig); 


//Rotas Users
router.post("/users", validateSchema(createUserSchema), new CreateUserController().handle);
router.post("/session", validateSchema(authUserSchema), new AuthUserController().handle );
router.get("/me", isAuthenticated, new DetailUserController().handle);

//rotas category
router.post("/category", isAuthenticated, isAdmin, validateSchema(createCategorySchema), new CreateCategoryController().handle);
router.get("/category", isAuthenticated, new ListCategoryController().handle);
router.get("/category/product", isAuthenticated, validateSchema(listProductByCategorySchema), new ListProductByCategoryController().handle );


//rotas product
router.post("/product", isAuthenticated, isAdmin, upload.single('file'), validateSchema(createProductSchema), new CreateProductController().handle); 
router.get("/products", isAuthenticated, validateSchema(listProductSchema), new ListProductsController().handle);
router.delete("/product", isAuthenticated, isAdmin, new DeleteProductController().handle);

//rotas order
router.post("/order", isAuthenticated, validateSchema(createOrderSchema), new CreateOrderController().handle);
router.get("/orders", isAuthenticated, new ListOrdersController().handle);
router.post("/order/add", isAuthenticated, validateSchema(addItemSchema),  new AddItemController().handle);
router.delete("/order/remove", isAuthenticated, validateSchema(removeItemSchema) ,new RemoveItemController().handle);
router.get("/order/detail", isAuthenticated, validateSchema(detailOrderSchema) ,new DetailOrderController().handle);
router.put("/order/send", isAuthenticated,  validateSchema(sendOrderSchema), new SendOrderController().handle );
router.put("/order/finish", isAuthenticated,  validateSchema(finishOrderSchema), new FinishOrderController().handle );

export { router };