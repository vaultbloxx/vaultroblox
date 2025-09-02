import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import ErrorResponseModal from "../utils/ErrorResponseModal";
import SuccessResponseModal from "../utils/SuccessResponseModal";
import { CiCreditCard1 } from "react-icons/ci";
import { GrCircleInformation } from "react-icons/gr";
import { useEffect } from "react";

const Wallet = ({
  buyerBalance,
  sellerBalance,
  role,
  isTwoFa,
  frozenBalanceAmount,
  clientHoldUntil,
}) => {
  const [currentTab, setCurrentTab] = useState("crypto");
  const [activeTab, setActiveTab] = useState("deposit");
  const [amount, setAmount] = useState("");
  const [withdrawForm, setWithdrawForm] = useState({
    network: "",
    address: "",
    amount: "",
    code: "",
  });
  const handleWithdrawInputChange = (e) => {
    const { name, value } = e.target;
    setWithdrawForm({ ...withdrawForm, [name]: value });
  };

  //----------------- CREATE WITHDRAW START ------------------//
  const {
    mutate: placeWithdraw,
    isPending: placeWithdrawPending,
    error: placeWithdrawError,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/rumman/v1/seller/place-withdraw", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(withdrawForm),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "An unknown error occurred");
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
    onError: () => {
      document.getElementById("place_withdraw_error_modal").showModal();
    },
    onSuccess: () => {
      document.getElementById("place_withdraw_success_modal").showModal();
      setWithdrawForm({ network: "", address: "", amount: "", code: "" });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
  });

  //----------------- CREATE WITHDRAW END ------------------//

  //----------------- CREATE deposit START ------------------//
  const {
    mutate: placeDeposit,
    isPending: placeDepositPending,
    error: placeDepositError,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/rumman/v1/user/crypto-create-deposit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "An unknown error occurred");
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
    onError: () => {
      document.getElementById("place_deposit_error_modal").showModal();
    },
    onSuccess: (data) => {
      window.location.href = data?.paymentLink;
    },
  });

  //----------------- CREATE deposit END ------------------//

  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!clientHoldUntil) {
      setCountdown("No frozen balance");
      return;
    }

    const targetTime = new Date(clientHoldUntil).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0) {
        setCountdown("Hold expired");
        clearInterval(interval);
        return;
      }

      // Calculate hours, minutes, seconds
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [clientHoldUntil]);

  // Calculate total hours remaining (for tooltip main info)
  const totalHours = clientHoldUntil
    ? Math.max(
        0,
        Math.floor((new Date(clientHoldUntil) - new Date()) / (1000 * 60 * 60))
      )
    : 0;

  return (
    <div>
      <div className="flex items-center text-dryGray">
        <div className=" px-3 h-10 2xl:h-12 bg-dry rounded-l-md flex items-center justify-center text-lg 2xl:text-2xl">
          ${(buyerBalance + sellerBalance).toFixed(2)}
        </div>
        <div
          onClick={() => document.getElementById("wallet_modal").showModal()}
          className=" w-12 2xl:w-14 h-10 2xl:h-12 flex items-center justify-center rounded-r-md bg-subMain cursor-pointer"
        >
          <img
            src="/images/wallet.png"
            className=" w-full h-full object-contain p-1 2xl:p-1.5"
            alt=""
          />
        </div>

        {/* wallet modal  */}
        <dialog
          id="wallet_modal"
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box bg-dry no-scrollbar">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            {/* modal content  */}
            <div className=" mt-2 w-full flex  flex-col items-center">
              <div className=" pb-2 flex items-center justify-center">
                <MdOutlineAccountBalanceWallet className=" w-10 h-10 2xl:size-12 text-zinc-300" />
              </div>
              <div className=" mt-2 w-full">
                <div className=" flex items-center justify-center text-lg xl:text-xl 2xl:text-2xl ">
                  <div
                    className={` border-b-2 2xl:border-b-[3px] cursor-pointer px-4 ${
                      activeTab === "deposit"
                        ? "border-b-2 border-subMain"
                        : "border-border"
                    }`}
                    onClick={() => setActiveTab("deposit")}
                  >
                    <p>Deposit</p>
                  </div>
                  <div
                    className={` border-b-2 cursor-pointer  px-4 ${
                      activeTab === "withdraw"
                        ? "border-b-2 2xl:border-b-[3px] border-subMain"
                        : "border-border"
                    }`}
                    onClick={() => setActiveTab("withdraw")}
                  >
                    <p>Withdraw</p>
                  </div>
                </div>
                {/* deposit start  */}
                {activeTab === "deposit" && (
                  <div className=" pt-3">
                    <h1 className=" mt-2 text-center 2xl:text-lg">
                      Buyer Balance:{" "}
                      <span className=" font-medium  ">
                        ${buyerBalance.toFixed(2)}
                      </span>
                    </h1>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        placeDeposit();
                      }}
                    >
                      <div className=" w-full flex items-center gap-1 mt-3">
                        {/* icons  */}
                        <div className="avatar-group -space-x-6 rtl:space-x-reverse">
                          <div className="avatar border-dry">
                            <div className="w-12">
                              <img src="/images/btc-logo.png" />
                            </div>
                          </div>
                          <div className="avatar border-dry">
                            <div className="w-12">
                              <img src="/images/usdt-logo.png" />
                            </div>
                          </div>
                          <div className="avatar border-dry">
                            <div className="w-12">
                              <img src="/images/ltc-logo.png" />
                            </div>
                          </div>
                          <div className="avatar border-dry placeholder">
                            <div className="bg-neutral text-neutral-content w-12">
                              <span>+3</span>
                            </div>
                          </div>
                        </div>
                        {/* icons end  */}
                        <div className=" relative w-full">
                          <input
                            type="text"
                            placeholder="Minimum $10.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className=" w-full bg-main border border-zinc-800 h-10 2xl:h-12 px-3 text-text outline-none text-sm 2xl:text-lg rounded-md"
                          />
                          <span className=" absolute right-3 top-1/2 -translate-y-1/2 text-lg 2xl:text-xl">
                            $
                          </span>
                        </div>
                      </div>

                      {placeDepositError?.message && (
                        <p className=" text-sm text-red-400 text-center px-14 mt-2">
                          {placeDepositError?.message}
                        </p>
                      )}

                      <button
                        // disabled={amount.length < 2 ? true : false}
                        className={`${
                          amount.length < 2 && " opacity-60 cursor-not-allowed"
                        } w-full mt-3 py-2 bg-subMain hover:bg-subMain/90 transition rounded-lg font-medium text-white text-lg `}
                      >
                        {placeDepositPending ? "Processing..." : "Deposit"}
                      </button>
                      {/* <button
                      disabled={amount.length < 2 ? true : false}
                      className={`${
                        amount.length < 2 && " opacity-60 cursor-not-allowed"
                      } w-full mt-3 py-2 bg-subMain hover:bg-subMain/90 transition rounded-lg font-medium text-white text-lg flex items-center justify-center gap-2 `}
                    >
                      <div>
                        <CiCreditCard1 className=" size-6 2xl:size-7 text-white" />
                      </div>
                      <p>
                        {placeDepositPending ? "Processing..." : "With Card"}
                      </p>
                    </button> */}
                    </form>
                    <p className=" text-center text-sm 2xl:text-base mt-4 font-light opacity-70 leading-4">
                      As soon as Cryptomus confirms your transaction, it will be
                      added to your balance immediately.
                    </p>
                  </div>
                )}

                {/* withdraw start */}
                {activeTab === "withdraw" && (
                  <div className=" pt-3">
                    <div className=" flex items-center justify-between px-3">
                      <h1 className=" mt-1 2xl:text-lg">
                        Available Balance <br />
                        <span className=" font-medium">
                          ${sellerBalance.toFixed(2)}
                        </span>
                      </h1>

                      <div>
                        <div className="flex items-center gap-1">
                          <div
                            className="tooltip tooltip-left tooltip-accent"
                            data-tip={
                              clientHoldUntil
                                ? `On hold for ${totalHours} hours | ${countdown}`
                                : "No frozen balance"
                            }
                          >
                            <GrCircleInformation className="text-white size-5 2xl:size-5 cursor-pointer" />
                          </div>
                          <h3 className="2xl:text-lg">On hold</h3>
                        </div>
                        <div className="">
                          <p className="font-medium text-end 2xl:text-lg">
                            {frozenBalanceAmount
                              ? `$${frozenBalanceAmount.toFixed(2)}`
                              : "$0.00"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="px-12 my-2 flex items-center justify-center text-base 2xl:text-lg ">
                      <div
                        className={` border-b-2 2xl:border-b-[3px] cursor-pointer px-4 ${
                          currentTab === "crypto"
                            ? "border-b-2 border-subMain"
                            : "border-border"
                        }`}
                        onClick={() => {
                          setCurrentTab("crypto");
                          setWithdrawForm((prevForm) => ({
                            ...prevForm,
                            network: "",
                          }));
                        }}
                      >
                        <p>Crypto</p>
                      </div>
                      <div
                        className={` border-b-2 cursor-pointer  px-4 ${
                          currentTab === "fiat"
                            ? "border-b-2 2xl:border-b-[3px] border-subMain"
                            : "border-border"
                        }`}
                        onClick={() => {
                          setCurrentTab("fiat");
                          setWithdrawForm((prevForm) => ({
                            ...prevForm,
                            network: "paypal",
                          }));
                        }}
                      >
                        <p>Fiat</p>
                      </div>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        console.log(withdrawForm);
                        placeWithdraw();
                      }}
                      className=" w-full mt-4"
                    >
                      {/* crypto icons */}
                      {currentTab === "crypto" && (
                        <div className=" grid grid-cols-3 px-3 gap-3">
                          <div
                            onClick={() =>
                              setWithdrawForm((prevForm) => ({
                                ...prevForm,
                                network:
                                  prevForm.network === "btc" ? "" : "btc",
                              }))
                            }
                            className={`border  ${
                              withdrawForm.network === "btc"
                                ? " border-subMain"
                                : "border-transparent"
                            }  h-24 bg-main rounded-md flex items-center justify-center`}
                          >
                            <div className=" flex flex-col items-center">
                              <div className=" w-9 h-9">
                                <img
                                  src="/images/btc-logo.png"
                                  alt="btc"
                                  className=" w-full h-full object-cover"
                                />
                              </div>
                              <p className=" cursor-default mt-2 text-xs 2xl:text-sm opacity-70">
                                BTC
                              </p>
                            </div>
                          </div>
                          <div
                            onClick={() => {
                              setWithdrawForm((prevForm) => ({
                                ...prevForm,
                                network:
                                  prevForm.network === "usdt" ? "" : "usdt",
                              }));
                            }}
                            className={` border ${
                              withdrawForm.network === "usdt"
                                ? " border-subMain"
                                : "border-transparent"
                            }    h-24 bg-main rounded-md flex items-center justify-center`}
                          >
                            <div className=" flex flex-col items-center">
                              <div className=" w-9 h-9">
                                <img
                                  src="/images/usdt-logo.png"
                                  alt="usdt"
                                  className=" w-full h-full object-cover"
                                />
                              </div>
                              <p className="cursor-default mt-2 text-xs  2xl:text-sm opacity-70">
                                USDT (ERC20)
                              </p>
                            </div>
                          </div>
                          <div
                            onClick={() => {
                              setWithdrawForm((prevForm) => ({
                                ...prevForm,
                                network:
                                  prevForm.network === "ltc" ? "" : "ltc",
                              }));
                            }}
                            className={`border ${
                              withdrawForm.network === "ltc"
                                ? " border-subMain"
                                : "border-transparent"
                            }  h-24 bg-main rounded-md flex items-center justify-center`}
                          >
                            <div className=" flex flex-col items-center">
                              <div className=" w-9 h-9">
                                <img
                                  src="/images/ltc-logo.png"
                                  alt="btc"
                                  className=" w-full h-full object-cover"
                                />
                              </div>
                              <p className="cursor-default mt-2 2xl:text-sm text-xs opacity-70">
                                LTC
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* crypto icons end */}

                      {/* fiat start  */}
                      {currentTab === "fiat" && (
                        <div className=" w-full px-3">
                          <div className=" w-full h-24  bg-main rounded-md flex flex-col items-center justify-center">
                            <div className="size-14">
                              <img
                                src="/images/pp.png"
                                alt=""
                                className=" w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      {/* fiat start end */}

                      {/* crypto address start */}
                      <div className=" w-full px-3">
                        <h1 className=" mt-4 text-sm 2xl:text-lg font-medium">
                          {currentTab === "crypto"
                            ? "Address *"
                            : "Email/Mobile *"}
                        </h1>
                        <input
                          type="text"
                          placeholder={
                            currentTab === "crypto"
                              ? "Your crypto wallet address"
                              : "Your paypal email or mobile"
                          }
                          name="address"
                          value={withdrawForm.address}
                          onChange={handleWithdrawInputChange}
                          className=" mt-1 w-full bg-main border border-zinc-800 h-12 2xl:h-14 2xl:text-base px-3 text-text outline-none text-sm rounded-md"
                        />
                      </div>
                      {/* crypto address end */}

                      {/* amount start  */}
                      <div className=" w-full px-3">
                        <div className=" mt-2 flex items-center justify-between">
                          <h1 className=" text-sm 2xl:text-lg font-medium">
                            Amount *
                          </h1>
                          <p className=" text-xs 2xl:text-base opacity-90 text-subMain">
                            No Commission
                          </p>
                        </div>
                        <input
                          type="text"
                          placeholder="Minimum $10.00"
                          name="amount"
                          minLength={2}
                          value={withdrawForm.amount}
                          onChange={handleWithdrawInputChange}
                          className=" mt-1 w-full bg-main border border-zinc-800 h-12 2xl:h-14 2xl:text-base px-3 text-text outline-none text-sm rounded-md"
                        />
                      </div>
                      {/* amount end  */}

                      {/* code start  */}
                      <div className=" w-full px-3">
                        <h1 className=" mt-2 text-sm 2xl:text-lg font-medium">
                          Code *
                        </h1>
                        <input
                          type="text"
                          placeholder="2FA code"
                          name="code"
                          maxLength={6}
                          value={withdrawForm.code}
                          onChange={handleWithdrawInputChange}
                          className=" mt-1 w-full bg-main border border-zinc-800 h-12 2xl:h-14 px-3 text-text outline-none text-sm 2xl:text-base rounded-md"
                        />
                      </div>
                      {/* code end  */}
                      {parseFloat(withdrawForm.amount) > sellerBalance && (
                        <p className=" text-sm text-red-400 px-14 mt-2">
                          You don't have enough seller balance to withdraw
                        </p>
                      )}

                      {withdrawForm.network === "" && (
                        <p className=" text-center text-sm 2xl:text-base text-red-400 px-14 mt-2">
                          Please select a network
                        </p>
                      )}

                      <div className=" w-full px-3">
                        <button
                          disabled={
                            withdrawForm.amount.length < 2 ||
                            withdrawForm.code.length < 6 ||
                            (role !== "seller" &&
                              role !== "admin" &&
                              role !== "owner") ||
                            !isTwoFa ||
                            sellerBalance === 0 ||
                            placeWithdrawPending ||
                            withdrawForm.network === "" ||
                            parseFloat(withdrawForm.amount) > sellerBalance
                              ? true
                              : false
                          }
                          className={`${
                            (withdrawForm.amount.length < 2 ||
                              withdrawForm.code.length < 6 ||
                              sellerBalance === 0 ||
                              (role !== "seller" &&
                                role !== "admin" &&
                                role !== "owner") ||
                              !isTwoFa ||
                              placeWithdrawPending ||
                              withdrawForm.network === "" ||
                              parseFloat(withdrawForm.amount) >
                                sellerBalance) &&
                            "cursor-not-allowed opacity-60"
                          } w-full mt-3 h-10 2xl:h-12 2xl:text-lg bg-subMain hover:bg-subMain/90 transition rounded-lg font-medium text-myWhite`}
                        >
                          {placeWithdrawPending
                            ? "Processing..."
                            : !isTwoFa
                            ? "2FA is not enabled"
                            : role !== "seller" &&
                              role !== "admin" &&
                              role !== "owner"
                            ? "You are not a seller"
                            : "Submit"}
                        </button>
                      </div>

                      <ErrorResponseModal
                        id={"place_withdraw_error_modal"}
                        message={placeWithdrawError?.message}
                      />
                      <SuccessResponseModal
                        id={"place_withdraw_success_modal"}
                        message={"Withdrawal request sent successfully"}
                      />
                    </form>
                  </div>
                )}
              </div>
            </div>
            {/* modal content End  */}
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default Wallet;
