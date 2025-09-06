import express from 'express'
import { registerUser, loginUser, updateUserProfile, getMe, logoutUser } from '../Controllers/userController.js'
import protect from '../Middlewares/protected.js'
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const route = express.Router();

route.post('/register', registerUser);

route.post('/login', loginUser);

route.put("/profile", protect,upload.single('profileImage'), updateUserProfile);

route.get("/me", protect, getMe)

route.post("/logout", protect, logoutUser)

export default route;
