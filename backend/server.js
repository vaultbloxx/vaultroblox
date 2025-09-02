import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import userRoutes from "./routes/user.route.js";
import sellerRoutes from "./routes/seller.route.js";
import utilsRoutes from "./routes/utils.route.js";
import { v2 as cloudinary } from "cloudinary";
import timeout from "connect-timeout";
import path from "path";
import compression from "compression";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cron from "node-cron";
import { User } from "./models/user.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 4000;

app.use(compression({ level: 6, threshold: 0 }));
app.use(
  cors({
    origin: "https://roblox-marketplace-yum7.onrender.com",
    credentials: true,
  })
);

// Apply timeout middleware (e.g., 10 minutes)
app.use(timeout("5m"));

// Middleware to handle timeout errors
app.use((req, res, next) => {
  if (req.timedout) {
    res.status(503).json({ error: "Request timed out" });
  } else {
    next();
  }
});
app.use(
  express.json({
    limit: "100mb",
    verify: (req, _, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(cookieParser());

app.use("/api/rumman/v1/auth", authRoutes);
app.use("/api/rumman/v1/user", userRoutes);
app.use("/api/rumman/v1/seller", sellerRoutes);
app.use("/api/rumman/v1/admin", adminRoutes);
app.use("/api/rumman/v1/utils", utilsRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.use("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

// ------------------ CRON JOB FUNCTION ------------------ //
function startFrozenBalanceJob() {
  // Run daily at midnight server time
  cron.schedule("0 0 * * *", async () => {
    try {
      const now = new Date();

      // Use updateMany with aggregation pipeline (MongoDB 4.2+)
      const result = await User.updateMany(
        {
          frozenBalance: { $gt: 0 },
          frozenEnd: { $lte: now },
        },
        [
          {
            $set: {
              sellerBalance: { $add: ["$sellerBalance", "$frozenBalance"] },
              frozenBalance: 0,
              frozenStart: null,
              frozenEnd: null,
            },
          },
        ]
      );

      if (result.modifiedCount > 0) {
        console.log(
          `✅ Released frozen balance for ${result.modifiedCount} users`
        );
      } else {
        console.log("ℹ️ No frozen balances to release today");
      }
    } catch (error) {
      console.error("❌ Error releasing frozen balances:", error);
    }
  });
}

app.listen(PORT, () => {
  connDB();
  console.log(`Server is running on port ${PORT}`);
  startFrozenBalanceJob(); // start cron job when server starts
});
