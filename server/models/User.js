import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Keep your custom _id
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // ADD THIS - needed for authentication
  resume: { type: String },
  image: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "recruiter"],
    default: "user",
  },
});

// ADD THIS METHOD - needed for password checking
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Simple comparison for now - you can enhance this later
  return this.password === enteredPassword;
};

const User = mongoose.model("User", userSchema);
export default User;
