import Router from 'express';
import { addToCart, getCart, removeFromCart, clearCart } from '../controllers/cart.controller.js';


const cartRouter = Router();

cartRouter.post('/add', addToCart);
cartRouter.get('/get-cart/:userId', getCart);
cartRouter.delete('/remove-item', removeFromCart)
cartRouter.delete('/clear-cart', clearCart);

export default cartRouter;