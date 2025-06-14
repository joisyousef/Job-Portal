import jwt from "jsonwebtoken";

<<<<<<< HEAD
=======
/**
 * @param {{ id: string, email: string, role: "recruiter" | "user" }} payload
 * @returns {string} signed JWT
 */
>>>>>>> authentication
const generateToken = ({ id, email, role }) => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export default generateToken;
