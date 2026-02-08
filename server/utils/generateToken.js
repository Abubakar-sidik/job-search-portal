import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
  // Accept role here
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    // Add role to payload
    expiresIn: "30d",
  });
};

export default generateToken;
