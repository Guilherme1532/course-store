import { Router } from 'express';
import auth from '../middlewares/auth.js';
import uploadImageController from '../controllers/uploadImage.controller.js';
import upload from '../middlewares/multer.js';
import isAdmin from '../middlewares/isAdmin.js';

const uploadRouter = Router();

uploadRouter.post('/upload', auth, isAdmin, upload.single("image"), uploadImageController);

export default uploadRouter;