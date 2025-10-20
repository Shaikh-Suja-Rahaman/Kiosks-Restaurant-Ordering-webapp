import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  // i am going to tokenize the id
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email)
      return res.status(400).json({ message: "Please fill all the fields" });

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration" });
  }
};


export const loginUser = async (req, res) => {
  try {
    // 1. Get the data from the request body
    const { email, password } = req.body;

    // 2. Simple validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // 3. Find the user by email
    const user = await User.findOne({ email });

    // 4. Check if user exists AND if passwords match
    // We use bcryptjs.compare to check the hashed password
    if (user && (await bcryptjs.compare(password, user.password))) {
      // 5. User is valid, send back data and a new token
      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        favorites: user.favorites, // Send their favorites list
        token: generateToken(user._id),
      });
    } else {
      // 6. If user not found or password incorrect
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
