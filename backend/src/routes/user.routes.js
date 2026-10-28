const router = require("express").Router();
const userController = require("../controllers/user.controller");
const requireAuth = require("../middleware/requireAuth");
const { requireRole } = require("../middleware/requireRole");

router.get("/me", requireAuth, userController.getMe);
// TODO (Task 8): add admin-only example after implementing middleware:
router.get("/admin/users", requireAuth, requireRole("admin"), userController.adminUsers);

module.exports = router;
