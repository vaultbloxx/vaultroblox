import express from "express";
import { protectedRoutes } from "../middleware/protectedRoutes.js";
import {
  checkEligibility,
  createDeposit,
  depositSuccess,
  getDepositTransactions,
  getWithdrawTransactions,
  likeUnlikeLimited,
  markReceived,
  paymentSuccess,
  payNowCallback,
  placeOrder,
  placeOrderByBalance,
  qrImg,
  set2Fa,
  updateBtcAddy,
  updateLtcAddy,
  updateUsdtAddy,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/update-btc-addy", protectedRoutes, updateBtcAddy);
router.post("/update-ltc-addy", protectedRoutes, updateLtcAddy);
router.post("/update-usdt-addy", protectedRoutes, updateUsdtAddy);

router.post("/two-factor-qr", protectedRoutes, qrImg);
router.post("/set-two-factor", protectedRoutes, set2Fa);

router.post("/check-eligibility", checkEligibility);
router.post("/like-unlike/:limitedId", protectedRoutes, likeUnlikeLimited);

router.post("/crypto-place-order/:limitedId", protectedRoutes, placeOrder);
router.post(
  "/balance-place-order/:limitedId",
  protectedRoutes,
  placeOrderByBalance
);
router.post("/crypto-payment-success", paymentSuccess);
router.post("/paynow", payNowCallback);
router.post("/crypto-create-deposit", protectedRoutes, createDeposit);
router.post("/crypto-deposit-success", depositSuccess);
router.post("/received-order/:orderId", protectedRoutes, markReceived);

router.get("/deposit-transactions", protectedRoutes, getDepositTransactions);
router.get(
  "/withdrawal-transactions",
  protectedRoutes,
  getWithdrawTransactions
);

export default router;
