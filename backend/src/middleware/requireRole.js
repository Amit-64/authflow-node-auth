const User = require("../models/User");

exports.requireRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      // 1. Ensure requireAuth ran first and attached the user ID
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // 2. Fetch the user from the database to get their current role securely
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // 3. Check if the user's role matches the required role
      if (user.role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden: You do not have permission to access this resource" });
      }

      // 4. If allowed, call next()
      return next();

    } catch (error) {
      return next(error);
    }
  };
};