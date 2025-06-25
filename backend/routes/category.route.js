import { Router } from "express";
import auth from "../middlewares/auth.js";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controllers/category.controller.js";
import isAdmin from "../middlewares/isAdmin.js";

const categoryRouter = Router();

categoryRouter.post("/create-category", auth, isAdmin, createCategory);
categoryRouter.get("/get-categories", getCategories);
categoryRouter.delete("/delete-category", auth, isAdmin, deleteCategory);
categoryRouter.put("/update-category", auth, isAdmin, updateCategory); // Assuming you want to use the same controller for update

export default categoryRouter;