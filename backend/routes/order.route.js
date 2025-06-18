import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
  createOrder, getOrders
} from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.post("/create-order", auth, createOrder);
orderRouter.get("/get-orders", auth, getOrders);

export default orderRouter;
