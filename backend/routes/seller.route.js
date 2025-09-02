import express from "express";
import { protectedRoutes } from "../middleware/protectedRoutes.js";
import {
  addAcount,
  calculateRecentRevenue,
  countRecentOrders,
  createItem,
  deleteAccount,
  deleteItem,
  getAccount,
  getAuto2FaQr,
  getBuyerOrders,
  getNotification,
  getPlayerLimitedItems,
  getRecentOrders,
  getSellerLimiteds,
  getSellerOrders,
  markDeliveredOrder,
  placeWithdraw,
  rejectOrder,
  setAuto2Fa,
  updateCookie,
  viewListings,
} from "../controllers/seller.controller.js";
import { sellerRoutes } from "../middleware/sellerRoutes.js";

const router = express.Router();

router.get("/todays-order", protectedRoutes, countRecentOrders);
router.get("/todays-revenue", protectedRoutes, calculateRecentRevenue);
router.get("/recent-orders", protectedRoutes, getRecentOrders);
router.get("/accounts/:userId", protectedRoutes, getAccount);
router.get("/listings/:accountId", protectedRoutes, viewListings);
router.get("/get-seller-limiteds/:userId", sellerRoutes, getSellerLimiteds);
router.get("/get-seller-orders", protectedRoutes, getSellerOrders);
router.get("/get-buyer-orders", protectedRoutes, getBuyerOrders);
router.get("/notifications", protectedRoutes, getNotification);

router.post("/add-account", protectedRoutes, addAcount);
router.post("/list-limited/:playerId", sellerRoutes, createItem);
router.delete("/delete-listing/:limitedId", sellerRoutes, deleteItem);
router.delete("/delete-account/:accountId", sellerRoutes, deleteAccount);

router.post("/autofa-qr/:accountId", sellerRoutes, getAuto2FaQr);
router.post("/set-autofa/:accountId", sellerRoutes, setAuto2Fa);
router.post("/update-cookie/:accountId", sellerRoutes, updateCookie);
router.post("/reject-order/:orderId", sellerRoutes, rejectOrder);
router.post("/deliver-order/:orderId", sellerRoutes, markDeliveredOrder);
router.post("/place-withdraw", sellerRoutes, placeWithdraw);

router.get("/get-inventory/:playerId", sellerRoutes, getPlayerLimitedItems);

export default router;
