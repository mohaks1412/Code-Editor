import jwt from 'jsonwebtoken';
import User from '../Models/userModel.js';


const protect = async (req, res, next) => {
  let token;

  // Extract token from HttpOnly cookie named 'authToken'
  if (req.cookies && req.cookies.authToken) {
    token = req.cookies.authToken;
  }
  

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // attach user to request object
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authorized: token failed' });
  }
};

export default protect;
