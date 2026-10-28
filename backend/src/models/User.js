const mongoose = require("mongoose");

// TODO (Task 2): define the user schema.
// Suggested fields:
// - name: required, trimmed string
// - email: required, unique, lowercase, trimmed string
// - passwordHash: required string (never store the raw password)
// - role: enum ["user", "admin"], default "user"
// Add timestamps: true. Validate input at the API boundary too.
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
}, { timestamps: true });




// TODO (Task 2): export the model after completing the schema.
// module.exports = mongoose.model("User", userSchema);
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
