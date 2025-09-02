import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const adminRoutes = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized, please login" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized, token not valid" });
    }

    const user = await User.findById(decoded?.userId).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (user.role !== "admin" && user.role !== "owner") {
      return res.status(401).json({ error: "You are not the admin Bruh" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
