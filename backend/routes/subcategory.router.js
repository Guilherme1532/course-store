import { Router } from "express";
import {
  createSubcategoryController,
  deleteSubcategory,
  getSubcategoryController,
  updateSubcategoryController,
} from "../controllers/subcategory.controller.js";
import auth from "../middlewares/auth.js";

const subcategoryRouter = Router();

subcategoryRouter.post(
  "/create-subcategories",
  auth,
  createSubcategoryController
);
subcategoryRouter.get("/get-subcategories", getSubcategoryController);
subcategoryRouter.put("/update-subcategory", auth, updateSubcategoryController);
subcategoryRouter.delete("/delete-subcategory", auth, deleteSubcategory )

export default subcategoryRouter;
