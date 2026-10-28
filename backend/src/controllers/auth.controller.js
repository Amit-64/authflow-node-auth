// Controllers should contain request/response logic; routes should stay small.

const User = require("../models/User");
const bcrypt = require("bcryptjs"); // Added missing import
const jwt = require("jsonwebtoken"); // Added missing import

exports.register = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    let { email } = req.body; // Use 'let' so we can normalize/reassign it safely

    // 1. Validate name, email, and password
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // 2. Normalize email and check whether it already exists
    email = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists." });
    }

    // 3. Hash password with bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user with passwordHash using await (cleaner than .then)
    const user = await User.create({ 
      name, 
      email, 
      passwordHash: hashedPassword 
    });

    // 5. Return 201 and a safe user object
    const safeUser = { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role 
    };
    
    return res.status(201).json(safeUser);

  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate email/password
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Find user (done once)
    const user = await User.findOne({ email: normalizedEmail });
    
    // 3. Use generic 401 message for invalid credentials
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // 4. Sign a short-lived JWT with only necessary claims (sub)
    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // 5. Set it in a secure HttpOnly cookie
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", // set to true in production
      sameSite: 'strict', 
      maxAge: 15 * 60 * 1000 
    });

    return res.status(200).json({ message: "Login successful." });

  } catch (error) {
    next(error);
  }
};

exports.logout = async (_req, res, next) => {
  try {
    // Task 9: clear the cookie using matching cookie options
    res.clearCookie('token', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: 'strict' 
    });
    
    return res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    next(error);
  }
};