import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "../config/connectDB.js";
import userRouter from "../routes/user.route.js";
import categoryRouter from "../routes/category.route.js";
import uploadRouter from "../routes/uploadImage.router.js";
import subcategoryRouter from "../routes/subcategory.router.js";
import productRouter from "../routes/product.route.js";
import cartRouter from "../routes/cart.route.js";
import orderRouter from "../routes/order.route.js";

const app = express();


app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan());
app.use(
  helmet({
    crossOriginOpenerPolicy: false,
  })
);


app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/subcategory", subcategoryRouter);
app.use("/api/file", uploadRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter); 

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });

export default app;
