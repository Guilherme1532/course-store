import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { createProduct, getProductController, updateProduct, deleteProduct, getProductsByCategory, getProductById, getMostViewedProducts } from '../controllers/product.controller.js';

const productRouter = Router();

productRouter.post('/create-product', auth, createProduct);
productRouter.post('/get-products', getProductController);
productRouter.put('/update-product', auth, updateProduct);
productRouter.delete('/delete-product', auth, deleteProduct);
productRouter.get('/category-products', getProductsByCategory); 
productRouter.get('/get-product-by-id', getProductById);
productRouter.get('/most-viewed-products', getMostViewedProducts); // Assuming this is a placeholder for future implementation

export default productRouter;