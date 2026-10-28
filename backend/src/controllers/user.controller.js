const User = require("../models/User");

exports.getMe = async (req, res, next) => {
  try {
    // Task 7: use req.user.id from verified auth middleware to fetch the user from DB
    const userId = req.user.id; 

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Return only safe profile fields
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return res.status(200).json(safeUser);
  } catch (error) {
    next(error);
  }
};

exports.adminUsers = async (req, res, next) => {
  try {
    // Task 8: return a safe list of users
    // (Note: requireAuth and requireRole("admin") will be handled in the route file)
    const users = await User.find().select("-passwordHash"); // Exclude password hash for safety

    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};