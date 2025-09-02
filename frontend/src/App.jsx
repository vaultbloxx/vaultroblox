import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import { MantineProvider } from "@mantine/core";
import Login from "./pages/Login";
import SellerDash from "./pages/dashboard/SellerDash";
import ListLimiteds from "./pages/dashboard/ListLimiteds";
import YourShop from "./pages/account/YourShop";
import Deposit from "./pages/account/Deposit";
import Withdrawal from "./pages/account/Withdrawal";
import Settings from "./pages/account/Settings";
import { useQuery } from "@tanstack/react-query";
import { BiWifiOff } from "react-icons/bi";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import ViewListings from "./pages/account/ViewListings";
import { FaTelegramPlane } from "react-icons/fa";
import AddRecentSold from "./pages/dashboard/AddRecentSold";
import Orders from "./pages/dashboard/Orders";
import Loader from "./components/utils/Loader";
import LitstingTheLimiteds from "./pages/dashboard/LitstingTheLimiteds";
import History from "./pages/dashboard/History";
import AllOrders from "./pages/dashboard/AllOrders";
import Stock from "./pages/dashboard/Stock";
import Users from "./pages/dashboard/Users";
import UserDetails from "./pages/dashboard/UserDetails";
import WithdrawalRequests from "./pages/dashboard/WithdrawalRequests";
import Register from "./pages/Register";
import ForgetPass from "./pages/ForgetPass";
import ResetPassword from "./pages/ResetPassword";
import AllLimiteds from "./pages/dashboard/AllLimiteds";
import AllBanner from "./pages/dashboard/AllBanners";
import LoginNew from "./pages/LoginNew";
import RobuxOrders from "./pages/dashboard/RobuxOrders";
import CreateLimited from "./pages/dashboard/CreateLimited";
import { AiOutlineDisconnect } from "react-icons/ai";
import Intercom from "@intercom/messenger-js-sdk";

function App() {
  //intercom
  Intercom({
    app_id: "t38y6tv2",
  });

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/rumman/v1/auth/me");
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error);
        }
        console.log("Auth user is here:", data);
        return data;
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },

    retry: false,
  });

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const [isOnline, setOnline] = useState(true);
  useEffect(() => {
    function handleOnlineStatus() {
      setOnline(true);
    }

    function handleOfflineStatus() {
      setOnline(false);
    }

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOfflineStatus);

    return () => {
      window.addEventListener("online", handleOnlineStatus);
      window.addEventListener("offline", handleOfflineStatus);
    };
  }, []);

  if (!isOnline) {
    return (
      <div>
        <div className=" flex-wrap overflow-hidden flex items-center justify-center flex-col text-white h-screen bg-black">
          <BiWifiOff className=" w-64 h-64 text-zinc-200" />
          <em>" Check your internet connection and try again "</em>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className=" w-full h-screen flex items-center justify-center bg-main">
        <Loader />
      </div>
    );
  }

  if (authUser?.role === "banned") {
    return (
      <div className=" flex-wrap overflow-hidden flex items-center justify-center flex-col text-white h-screen bg-main">
        <AiOutlineDisconnect className=" w-64 h-64 text-zinc-200" />
        <h1 className=" text-center text-lg md:text-xl 2xl:text-2xl font-medium mb-3 break-all">
          Account: {authUser?.email}
        </h1>
        <p className=" text-center text-base 2xl:text-lg">
          You has been banned from using <br /> our services.
        </p>
      </div>
    );
  }
  return (
    <div className=" bg-main relative text-white min-h-screen">
      {/* <a
        href="https://t.me/vaultlimited"
        className=" fixed bottom-16 lg:bottom-4 left-4 shadow-lg z-50"
      >
        <div className=" w-10 h-10 bg-[#0088CC] rounded-full flex items-center justify-center">
          <FaTelegramPlane className=" -ml-1 w-6 h-6 text-white" />
        </div>
      </a> */}
      <MantineProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={authUser ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/newlogin"
            element={authUser ? <Navigate to="/" /> : <LoginNew />}
          />
          <Route
            path="/register"
            element={authUser ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/forget-password"
            element={authUser ? <Navigate to="/" /> : <ForgetPass />}
          />
          <Route
            path="/reset-password/:token"
            element={authUser ? <Navigate to="/" /> : <ResetPassword />}
          />
          <Route
            path="/dashboard"
            element={!authUser ? <Navigate to="/login" /> : <SellerDash />}
          />
          <Route
            path="/list-limiteds"
            element={
              !authUser ? (
                <Navigate to="/login" />
              ) : (
                <ListLimiteds authUser={authUser} />
              )
            }
          />
          <Route path="/shop/:username" element={<YourShop />} />
          <Route
            path="/transactions/deposit"
            element={!authUser ? <Navigate to="/login" /> : <Deposit />}
          />
          <Route
            path="/transactions/withdrawal"
            element={!authUser ? <Navigate to="/login" /> : <Withdrawal />}
          />
          <Route
            path="/settings"
            element={!authUser ? <Navigate to="/login" /> : <Settings />}
          />
          <Route
            path="/listings/:accountId"
            element={!authUser ? <Navigate to="/login" /> : <ViewListings />}
          />
          <Route
            path="/orders"
            element={
              !authUser ? (
                <Navigate to="/login" />
              ) : (
                <Orders authUser={authUser} />
              )
            }
          />
          <Route
            path="/list/:playerId"
            element={
              !authUser ? <Navigate to="/login" /> : <LitstingTheLimiteds />
            }
          />
          <Route
            path="/history"
            element={
              !authUser ? (
                <Navigate to="/login" />
              ) : (
                <History authUser={authUser} />
              )
            }
          />
          <Route
            path="/recently-sold"
            element={
              !authUser ||
              (authUser.role !== "admin" && authUser.role !== "owner") ? (
                <Navigate to="/" />
              ) : (
                <AddRecentSold />
              )
            }
          />
          <Route
            path="/all-banner"
            element={
              !authUser ||
              (authUser.role !== "admin" && authUser.role !== "owner") ? (
                <Navigate to="/" />
              ) : (
                <AllBanner />
              )
            }
          />
          <Route
            path="/create-limited"
            element={
              !authUser ||
              (authUser.role !== "admin" && authUser.role !== "owner") ? (
                <Navigate to="/" />
              ) : (
                <CreateLimited />
              )
            }
          />
          <Route
            path="/robux-orders"
            element={
              !authUser ||
              (authUser.role !== "admin" && authUser.role !== "owner") ? (
                <Navigate to="/" />
              ) : (
                <RobuxOrders authUser={authUser} />
              )
            }
          />
          <Route
            path="/all-limiteds"
            element={
              !authUser ||
              (authUser.role !== "admin" && authUser.role !== "owner") ? (
                <Navigate to="/" />
              ) : (
                <AllLimiteds />
              )
            }
          />
          <Route
            path="/all-orders"
            element={
              !authUser ||
              (authUser.role !== "admin" && authUser.role !== "owner") ? (
                <Navigate to="/" />
              ) : (
                <AllOrders authUser={authUser} />
              )
            }
          />
          <Route
            path="/withdrawal-requests"
            element={
              !authUser ||
              (authUser.role !== "admin" && authUser.role !== "owner") ? (
                <Navigate to="/" />
              ) : (
                <WithdrawalRequests authUser={authUser} />
              )
            }
          />
          <Route
            path="/stock"
            element={
              !authUser ||
              (authUser.role !== "admin" && authUser.role !== "owner") ? (
                <Navigate to="/" />
              ) : (
                <Stock />
              )
            }
          />
          <Route
            path="/users"
            element={
              !authUser ||
              (authUser.role !== "admin" && authUser.role !== "owner") ? (
                <Navigate to="/" />
              ) : (
                <Users authUser={authUser} />
              )
            }
          />
          <Route
            path="/user-details/:userId"
            element={
              !authUser ||
              (authUser.role !== "admin" && authUser.role !== "owner") ? (
                <Navigate to="/" />
              ) : (
                <UserDetails />
              )
            }
          />
        </Routes>
        <Toaster position="bottom-right" reverseOrder={false} />
      </MantineProvider>
    </div>
  );
}

export default App;
