import express from 'express'
import { createFile, updateFile} from '../Controllers/FileController.js'
import protect from '../Middlewares/protected.js'

const route = express.Router();

route.post('/create', protect, createFile)

route.put("/:fileId", protect, updateFile);

export default route;