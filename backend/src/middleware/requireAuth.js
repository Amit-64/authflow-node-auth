const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // 1. Read the JWT from the cookie
    const token = req.cookies?.token; 

    // 2. If missing, return 401
    if (!token) {
      return res.status(401).json({ message: "Authentication token missing" });
    }

    // 3. Verify signature and expiry (Synchronous version)
    // If the token is invalid, expired, or tampered with, this will throw an error automatically
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach verified claims to req.user
    req.user = { id: decoded.sub }; 

    // 5. Proceed to the next middleware or controller
    return next();

  } catch (err) {
    // 5. Treat malformed/expired tokens as 401
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};