import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Check if the request has an 'Authorization' header, and if it starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Get the token from the header (format is "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token using your JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //this decoded now contains my id, thus i can use it to fetch my user

      // 3. Find the user from the token's ID and attach them to the request
      // We exclude the password when fetching the user
      req.user = await User.findById(decoded.id).select('-password');
      //node my req.user is populated

      // 4. Call "next()" to move on to the *next* function (e.g., the controller)
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};


export const admin = (req, res, next) => {
  // This middleware runs *after* 'protect', so we already have 'req.user'
  if (req.user && req.user.isAdmin) {
    next(); // User is an admin, proceed
    // i think later we need to manage for the route for the new dashboard as well
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};