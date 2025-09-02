import express from "express";
import {
  checkRobloxItem,
  getAllBanners,
  getLimiteds,
  getRecentlySold,
  getRobux,
  getShop,
  getShopLimiteds,
} from "../controllers/utils.controller.js";

const router = express.Router();

router.get("/get-robux", getRobux);
router.get("/get-shop/:username", getShop);
router.get("/get-shop-limiteds/:username", getShopLimiteds);
router.get("/get-limiteds", getLimiteds);
router.get("/get-recently-sold", getRecentlySold);
router.get("/get-all-banner", getAllBanners);
router.post("/get-item-info", checkRobloxItem);

export default router;
