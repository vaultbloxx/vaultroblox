import express from "express";
import {
  acceptWithdrawal,
  changeUserVerified,
  createRecentSold,
  deleteBanner,
  deleteLimiteds,
  deleteRecentSold,
  deleteUser,
  deleteWithdrawal,
  forceDelivered,
  getAllLimited,
  getAllOrder,
  getAllUsers,
  getUserInfo,
  getwithdrawalRequests,
  makeBanner,
  rejectWithdrawal,
  updateRobux,
  updateRobuxPrice,
  getShopsForLimitedCreation,
  createLimited,
  freezeBalance,
  updateUser,
  searchLimitedByAssetId,
} from "../controllers/admin.controller.js";
import { adminRoutes } from "../middleware/adminRoutes.js";

const router = express.Router();

router.post("/update-robux", adminRoutes, updateRobux);
router.post("/update-robux-price", adminRoutes, updateRobuxPrice);
router.post("/create-recent-sold", adminRoutes, createRecentSold);
router.delete("/delete-recent-sold/:id", adminRoutes, deleteRecentSold);
router.delete("/delete-user/:id", adminRoutes, deleteUser);
router.put("/change-verified/:id", adminRoutes, changeUserVerified);

router.get("/get-all-users", adminRoutes, getAllUsers);
router.get("/get-shops", adminRoutes, getShopsForLimitedCreation);
router.get("/get-all-orders", adminRoutes, getAllOrder);
router.get("/get-user-info/:userId", adminRoutes, getUserInfo);
router.get("/get-withdrawal-requests", adminRoutes, getwithdrawalRequests);
router.get("/get-all-limiteds", adminRoutes, getAllLimited);
router.get(
  "/get-limited-by-assetId/:assetId",
  adminRoutes,
  searchLimitedByAssetId
);

router.post("/force-delivered/:orderId", adminRoutes, forceDelivered);
router.post("/create-limited", adminRoutes, createLimited);
router.post("/reject-withdrawal/:withdrawalId", adminRoutes, rejectWithdrawal);
router.post("/update-user", adminRoutes, updateUser);
router.post("/freeze-balance", adminRoutes, freezeBalance);
router.post("/accept-withdrawal/:withdrawalId", adminRoutes, acceptWithdrawal);
router.delete("/delete-limiteds/:limitedId", adminRoutes, deleteLimiteds);
router.delete(
  "/delete-withdrawal/:withdrawalId",
  adminRoutes,
  deleteWithdrawal
);

router.post("/create-banner/:limitedId", adminRoutes, makeBanner);
router.delete("/delete-banner/:bannerId", adminRoutes, deleteBanner);

export default router;
