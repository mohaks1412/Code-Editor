import express from 'express'
import { executeDsa, executeAssignment, generateInlineCodeCompletion} from '../Controllers/exeController.js'
import protect from '../Middlewares/protected.js'

const route = express.Router();

route.post('/dsa', protect, executeDsa)

route.post('/assignment', protect, executeAssignment)

route.post('/suggest', generateInlineCodeCompletion)
export default route;