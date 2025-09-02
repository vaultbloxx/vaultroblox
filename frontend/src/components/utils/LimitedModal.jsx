import React, { useEffect } from "react";
import { LuClipboardMinus } from "react-icons/lu";

import { useState } from "react";
import clasess from "./Modal.module.css";
import { Stepper, Button, Group } from "@mantine/core";
import { VscVerifiedFilled } from "react-icons/vsc";
import { FaHeart } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "./Loader";
import CountFormatter from "./formatNumber";
import { Link } from "react-router-dom";
import ErrorResponseModal from "./ErrorResponseModal";
import { PiWarningCircleBold } from "react-icons/pi";
import { BsStripe } from "react-icons/bs";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import SuccessResponseModal from "./SuccessResponseModal";
import ObjectId from "bson-objectid";

const LimitedModal = ({ limited }) => {
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  const queryClient = useQueryClient();

  //-----------------------------------Like and Unlike start -------------------------------------
  const { mutate: likeUnlike, isPending: isLikePending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(
          `/api/rumman/v1/user/like-unlike/${limited._id}`,
          {
            method: "POST",
          }
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error);
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const alreadyLiked = authUser?.likedLimiteds?.some(
    (likedLimited) => likedLimited?._id === limited?._id
  );

  //-----------------------------------Like and Unlike end -------------------------------------

  //-----------------------------------Check eligibility start -------------------------------------

  const [username, setUsername] = useState("");
  const [userImage, setUserImage] = useState("");
  const {
    mutate: checkEligibility,
    isPending: isEligibilityPending,
    error: EligibilityError,
    isError: isEligibilityError,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/rumman/v1/user/check-eligibility`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error);
        }
        return data;
      } catch (error) {
        throw error;
      }
    },

    onError: () => {
      setUsername("");
    },
    onSuccess: (data) => {
      if (data.success) {
        nextStep();
        setUsername(data?.username);
        setUserImage(data?.avatarUrl);
      }
    },
  });
  //-----------------------------------Check eligibility end -------------------------------------

  const [orderForm, setOrderForm] = useState({
    orderId: "",
    gameUsername: "",
    amount: parseFloat(limited?.price),
    payMethod: "",
  });

  useEffect(() => {
    if (active === 2 && !orderForm.orderId) {
      const newOrderId = ObjectId().toHexString();
      setOrderForm((prev) => ({
        ...prev,
        orderId: newOrderId,
      }));
    }
  }, [active, orderForm.orderId]);

  const {
    mutate: placeOrderCrypto,
    isPending: placeOrderCryptoPending,
    error: placeOrderCryptoError,
  } = useMutation({
    mutationFn: async (limitedId) => {
      try {
        const res = await fetch(
          `/api/rumman/v1/user/crypto-place-order/${limitedId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: orderForm.amount,
              gameUsername: orderForm.gameUsername,
            }),
          }
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error);
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      window.location.href = data?.paymentLink;
    },
    onError: () => {
      document.getElementById("place_order_error_modal").showModal();
    },
  });

  const {
    mutate: placeOrderByBalance,
    isPending: placeOrderByBalancePending,
    error: placeOrderByBalanceError,
  } = useMutation({
    mutationFn: async (limitedId) => {
      try {
        const res = await fetch(
          `/api/rumman/v1/user/balance-place-order/${limitedId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderForm),
          }
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error);
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      document.getElementById("place_order_success_modal").showModal();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: () => {
      document.getElementById("place_order_error_modal").showModal();
    },
  });

  return (
    <dialog id={limited?._id} className="modal">
      <div className="modal-box max-w-4xl 2xl:max-w-5xl no-scrollbar md:px-10 bg-dry text-dryGray">
        <Stepper
          active={active}
          onStepClick={setActive}
          allowNextStepsSelect={false}
          classNames={{
            separator: clasess.separator,
            stepIcon: clasess.stepIcon,
            stepCompletedIcon: clasess.stepCompletedIcon,
            stepLabel: clasess.stepLabel,
            stepDescription: clasess.stepDescription,
          }}
        >
          {/* 1st step  */}
          <Stepper.Step label="Account" description="Find roblox account">
            <div className=" w-full ">
              <div className=" flex flex-col md:flex-row items-center justify-between gap-2">
                <div className=" flex flex-col md:flex-row items-center gap-5">
                  <div className=" w-40 2xl:w-56 h-full flex items-center justify-center ">
                    <img
                      src={limited?.image}
                      alt={limited?.name}
                      title={limited?.name}
                      className=" w-full h-full object-contain"
                    />
                  </div>
                  <div className=" -mt-3">
                    <h1 className=" text-lg md:text-xl 2xl:text-2xl ">
                      {limited?.name}
                    </h1>
                    <h2 className=" font-light text-sm 2xl:text-lg md:text-sm ">
                      RAP:{" "}
                      <span className=" font-medium">
                        {" "}
                        <CountFormatter value={limited?.rap} />
                      </span>
                    </h2>
                    <div className=" flex items-center gap-1">
                      <h2 className=" font-light text-sm 2xl:text-lg md:text-sm">
                        Seller:{" "}
                        <Link
                          to={`/shop/${limited?.sellerId?.username}`}
                          className=" font-medium hover:underline"
                        >
                          {limited?.sellerId?.username || "Unknown"}
                        </Link>
                      </h2>
                      {limited?.sellerId?.verified && (
                        <div
                          className="tooltip tooltip-accent tooltip-right"
                          data-tip="Trusted Seller"
                        >
                          <VscVerifiedFilled className=" text-[#ECBE07] w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <h2 className=" font-light 2xl:text-lg">
                      Tracking ID:{" "}
                      <span className=" font-medium text-sm 2xl:text-lg md:text-sm">
                        {" "}
                        {limited?._id}
                      </span>
                    </h2>
                  </div>
                </div>

                <div className=" flex flex-row md:flex-col gap-2 items-end justify-between mb-2 md:mb-0">
                  <div>
                    {authUser && (
                      <button
                        onClick={() => likeUnlike()}
                        className=" bg-subMain  hover:text-red-500 text-dryGray text-sm px-2 py-[7px] rounded-[4px]"
                      >
                        {isLikePending ? (
                          <Loader height={"16px"} width={"16px"} />
                        ) : alreadyLiked ? (
                          <FaHeart className=" text-red-500" />
                        ) : (
                          <FaHeart />
                        )}
                      </button>
                    )}
                  </div>
                  <div className=" flex flex-row md:flex-col items-center gap-1 ">
                    <h1 className=" text-end 2xl:text-lg">Total Price</h1>
                    <h1 className=" text-xl 2xl:text-2xl font-bold text-end">
                      ${limited?.price.toFixed(2)}
                    </h1>
                  </div>
                </div>
              </div>

              <div className="w-full border-b border-border border-dashed mb-3" />

              <div>
                <span className=" text-sm 2xl:text-lg font-medium">
                  Your In-Game Username *
                </span>
                {/* if error */}
                {isEligibilityError && (
                  <p className=" text-sm text-red-500 mt-2 px-1">
                    {EligibilityError?.message}
                  </p>
                )}

                <div className=" w-full my-2">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      checkEligibility();
                    }}
                    className=" flex items-center gap-3 "
                  >
                    <input
                      type="text"
                      placeholder="Username"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className=" w-full bg-main border border-zinc-800 h-12 2xl:h-14 px-3 text-text outline-none text-sm 2xl:text-lg rounded-md"
                    />

                    <button
                      disabled={isEligibilityPending || username === ""}
                      className=" w-32 flex items-center justify-center  h-[46px] xl:h-[46px] 2xl:h-[54px] xl:text-lg text-myWhite bg-subMain hover:bg-subMain/90 transition font-medium rounded-md"
                    >
                      {isEligibilityPending ? <Loader /> : "Search"}
                    </button>
                  </form>
                </div>

                <div className=" w-full mt-5 mb-2">
                  <p className=" tracking-wide text-center 2xl:text-xl">
                    Account Requirements
                  </p>
                  <p className=" text-center text-sm 2xl:text-base 2xl:leading-none tracking-wide font-light text-text/70">
                    Please ensure your account follows <br /> our requirements
                    to receive your limited item
                  </p>
                </div>

                <div className=" flex items-center justify-between">
                  <div className=" p-3">
                    <h1 className=" text-nowrap text-xs md:text-sm 2xl:text-lg  font-medium text-center leading-none ">
                      Account Has
                      <br />
                      Premium
                    </h1>
                  </div>

                  <div className=" w-full border-b-2 border-subMain border-dashed" />

                  <div className=" p-3">
                    <h1 className=" text-nowrap text-xs md:text-sm 2xl:text-lg  font-medium text-center leading-none ">
                      Owns Small <br />
                      (Under 1.5k)
                    </h1>
                  </div>

                  <div className="  w-full border-b-2 border-subMain border-dashed" />

                  <div className=" p-3">
                    <h1 className=" text-nowrap text-xs md:text-sm 2xl:text-lg font-medium text-center leading-none ">
                      Public Trades <br />& Inventory
                    </h1>
                  </div>
                </div>

                <div>
                  <p className=" text-text/50 text-xs 2xl:text-base text-center tracking-wide">
                    Vault.com isn’t connected to Roblox in any way. We’re not
                    sponsored, partnered, or approved by Roblox Corporation. All
                    trades are done player-to-player, not through Roblox
                    directly.
                  </p>
                </div>
              </div>
            </div>
          </Stepper.Step>

          {/* 2nd step  */}
          <Stepper.Step label="Overview" description="Verify order">
            <div className=" flex flex-col items-center justify-center">
              <h1 className=" mb-3 text-lg font-medium text-zinc-50">
                Make sure this is your account!
              </h1>
              <div className=" w-24 h-24 md:w-40 md:h-40 rounded-full border border-subMain">
                <img
                  src={userImage && userImage}
                  alt=""
                  className=" w-full h-full rounded-full object-cover"
                />
              </div>
              <h1 className=" text-lg font-medium mt-2">{username}</h1>
              <p className=" text-center my-2 text-zinc-400 font-light ">
                Make sure this account is yours otherwise you will not receive
                the item you ordered. Public your inventory and trades until you
                receive the item.
              </p>
              <div className=" flex items-center gap-3">
                <button
                  onClick={() => {
                    document
                      .getElementById("account_confirm_modal")
                      .showModal();
                  }}
                  className=" w-36 text-sm flex items-center justify-center h-9 text-myWhite bg-subMain hover:bg-subMain/90 transition font-medium rounded-md"
                >
                  Yes, Confirm
                </button>
                <button
                  onClick={() => {
                    prevStep();
                    setUsername("");
                    setUserImage("");
                  }}
                  className=" w-20 h-9 text-sm bg-main/60 text-text rounded-md font-medium"
                >
                  No
                </button>

                {/* account confirm modal  */}
                <dialog id="account_confirm_modal" className="modal">
                  <div className="modal-box bg-dry">
                    <div className=" flex flex-col items-center justify-between gap-4">
                      <h3 className=" font-bold text-xl text-red-600">
                        Notice!
                      </h3>
                      <p className=" text-center text-sm text-zinc-400">
                        Public your inventory and trades until you receive the
                        item
                      </p>
                      <div className=" flex items-center gap-3 ">
                        <button
                          onClick={() => {
                            setOrderForm({
                              ...orderForm,
                              gameUsername: username,
                            });
                            nextStep();
                          }}
                          className=" w-28 h-8 text-sm bg-subMain text-myWhite rounded-md"
                        >
                          Ok
                        </button>
                        <button
                          onClick={() =>
                            document
                              .getElementById("account_confirm_modal")
                              .close()
                          }
                          className=" w-20 h-8 text-sm bg-main/60 text-text rounded-md"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                  <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                  </form>
                </dialog>
              </div>
            </div>
          </Stepper.Step>

          {/* 3rd step  */}
          <Stepper.Step label="Payment" description="Complete the payment">
            {!authUser ? (
              <div className="flex flex-col items-center justify-center gap-3">
                <PiWarningCircleBold className=" w-20 h-20 text-red-600 my-5" />
                <h1 className=" text-lg font-medium text-zinc-50">
                  Please login to continue
                </h1>
                <Link
                  to="/login"
                  className=" w-36 text-sm flex items-center justify-center h-9 text-main bg-subMain hover:bg-subMain/90 transition font-medium rounded-md"
                >
                  Login
                </Link>
              </div>
            ) : (
              <div className=" md:grid grid-cols-12 gap-2">
                {/* order details  */}
                <div className=" col-span-6">
                  <div className=" w-full flex flex-col items-center gap-2 py-5">
                    <h1 className=" text-lg 2xl:text-2xl font-medium">
                      Overview
                    </h1>
                    <div className=" h-20 md:h-32 ">
                      <img
                        src={limited?.image}
                        className=" w-full h-full object-contain"
                        alt=""
                      />
                    </div>
                    <h1 className=" text-lg 2xl:text-2xl font-medium">
                      {limited?.name}
                    </h1>
                    <h3 className=" text-sm 2xl:text-base text-center font-light text-zinc-300">
                      You will get your order after successful payment
                    </h3>
                    <h3 className=" text-sm 2xl:text-base text-center font-light text-zinc-300">
                      Your Order ID:{" "}
                      <span className="font-mono break-all">
                        {orderForm.orderId}
                      </span>
                    </h3>
                  </div>
                </div>
                {/* order details end */}

                {/* select payment  */}

                <div className=" col-span-6">
                  <div className="flex flex-col items-center justify-center gap-3 py-5">
                    <h1 className=" text-lg font-medium text-zinc-50">
                      Select Payment Method
                    </h1>
                    <div className=" cursor-default w-full px-3 md:px-0 md:w-96 flex flex-col items-center justify-center gap-4">
                      {/* stripe payment  */}
                      {/* <div
                      onClick={() => {
                        setOrderForm((prevForm) => ({
                          ...prevForm,
                          payMethod:
                            prevForm.payMethod === "stripe" ? "" : "stripe",
                        }));
                      }}
                      className={` w-full p-3 bg-main rounded-md flex items-center gap-[22px] border ${
                        orderForm.payMethod === "stripe"
                          ? "border-subMain"
                          : "border-transparent"
                      } `}
                    >
                      <BsStripe className=" w-11 h-11" />
                      <div>
                        <h1 className=" text- font-medium">Stripe</h1>
                        <p className=" text-sm font-light text-zinc-400">
                          ( e.g. Visa, Mastercard )
                        </p>
                      </div>
                    </div> */}

                      {/* crypto payment  */}

                      <div
                        onClick={() => {
                          setOrderForm((prevForm) => ({
                            ...prevForm,
                            payMethod:
                              prevForm.payMethod === "crypto" ? "" : "crypto",
                          }));
                        }}
                        className={` w-full p-3 bg-main rounded-md flex items-center gap-[22px] border ${
                          orderForm.payMethod === "crypto"
                            ? "border-subMain"
                            : "border-transparent"
                        } `}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 80 80"
                          width={50}
                          height={50}
                          className="guide-line_brandmark__rxb4Y"
                        >
                          <path
                            fill="currentColor"
                            d="M72.47 18.908 42.076 1.362a4.47 4.47 0 0 0-4.454 0L7.231 18.908A4.46 4.46 0 0 0 5 22.77v35.092a4.48 4.48 0 0 0 2.23 3.861L37.624 79.27a4.44 4.44 0 0 0 2.23.592c.785 0 1.555-.207 2.232-.592l30.392-17.547a4.46 4.46 0 0 0 2.23-3.861V22.77a4.48 4.48 0 0 0-2.23-3.862zm-31.931 19.23a1.38 1.38 0 0 1-1.378 0L9.615 21.086 39.161 4.031a1.42 1.42 0 0 1 1.377 0l29.547 17.054zM37.623 40.8c.216.123.446.231.692.316V76.1L8.77 59.054a1.39 1.39 0 0 1-.692-1.192V23.747z"
                          ></path>
                        </svg>
                        <div>
                          <h1 className=" text- font-medium">Cryptomus</h1>
                          <p className=" text-sm font-light text-zinc-400">
                            ( e.g. BTC, ETH, USDT, LTC )
                          </p>
                        </div>
                      </div>
                      {/* wallet payment  */}

                      <div
                        onClick={() => {
                          setOrderForm((prevForm) => ({
                            ...prevForm,
                            payMethod:
                              prevForm.payMethod === "balance" ? "" : "balance",
                          }));
                        }}
                        className={` w-full p-3 bg-main rounded-md flex items-center gap-[22px] border ${
                          orderForm.payMethod === "balance"
                            ? "border-subMain"
                            : "border-transparent"
                        } `}
                      >
                        <MdOutlineAccountBalanceWallet className=" w-12 h-12" />
                        <div>
                          <h1 className=" text- font-medium">Wallet</h1>
                          <p className=" text-sm font-light text-zinc-400">
                            From your deposit money
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (orderForm.payMethod === "balance") {
                            placeOrderByBalance(limited?._id);
                          }
                          if (orderForm.payMethod === "crypto") {
                            placeOrderCrypto(limited?._id);
                          }
                        }}
                        disabled={
                          orderForm.payMethod === "" ||
                          placeOrderByBalancePending ||
                          placeOrderCryptoPending
                        }
                        className={` ${
                          orderForm.payMethod === ""
                            ? "opacity-50 cursor-not-allowed"
                            : " hover:bg-subMain/90"
                        } w-full text-sm flex items-center justify-center h-9 text-myWhite bg-subMain  transition font-medium rounded-md`}
                      >
                        {placeOrderByBalancePending || placeOrderCryptoPending
                          ? "Loading..."
                          : "Continue"}
                      </button>
                    </div>
                    <ErrorResponseModal
                      id={"place_order_error_modal"}
                      message={
                        placeOrderCryptoError?.message ||
                        placeOrderByBalanceError?.message
                      }
                    />
                    <SuccessResponseModal
                      id={"place_order_success_modal"}
                      message={"Order placed successfully"}
                    />
                  </div>
                </div>
                {/* select payment end */}
              </div>
            )}
          </Stepper.Step>

          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default LimitedModal;
