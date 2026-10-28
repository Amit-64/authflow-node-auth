const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const rateLimit = require("express-rate-limit");

// TODO (Task 10): apply stricter rate limiting to login/register endpoints.
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false });

router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.post("/logout", authController.logout);

module.exports = router;
