import express, { Router } from 'express'
import { upload, updateCoordinates, deleteMedia, getUserId } from '../Controllers/mediaController.js'
import protect from '../Middlewares/protected.js'

import multer from "multer";
const uploadMulter = multer({ storage: multer.memoryStorage() });



const route = Router();

route.post('/upload', protect, uploadMulter.single("file"), upload);
route.patch('/:id/coordinates', protect, updateCoordinates);
route.delete('/:mediaId/:fileId', protect, deleteMedia)
route.get('/:mediaId', protect, getUserId)

export default route;