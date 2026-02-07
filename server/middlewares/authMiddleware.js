import jwt, { decode } from "jsonwebtoken";
import Company from "../models/Company.js";

export const protectCompany = async (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.json({ sucess: false, message: "Not authorized, Try again" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    next();

    res.Company = await Company.findById(decoded.id).select("-password");
  } catch (error) {
    res.json({ sucess: false, message: error.message });
  }
};
