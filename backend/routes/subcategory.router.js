import { Router } from "express";
import {
  createSubcategoryController,
  deleteSubcategory,
  getSubcategoryController,
  updateSubcategoryController,
} from "../controllers/subcategory.controller.js";
import auth from "../middlewares/auth.js";
import isAdmin from "../middlewares/isAdmin.js";

const subcategoryRouter = Router();

subcategoryRouter.post(
  "/create-subcategories",
  auth,
  createSubcategoryController
);
subcategoryRouter.get("/get-subcategories", getSubcategoryController);
subcategoryRouter.put("/update-subcategory", auth, isAdmin, updateSubcategoryController);
subcategoryRouter.delete("/delete-subcategory", auth, isAdmin, deleteSubcategory )

export default subcategoryRouter;
