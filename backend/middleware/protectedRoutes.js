import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

export const protectedRoutes = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized, No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized, invalid token" });
    }

    const user = await User.findById(decoded?.userId).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protected middleware", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
