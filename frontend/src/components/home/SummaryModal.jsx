import React from "react";
import { useUtilsStore } from "../../store/useUtilsStore";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { BsStripe } from "react-icons/bs";

function SummaryModal({ summaryModalId, urlModalId, formData, setFormData }) {
  const { item } = useUtilsStore();
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });
  return (
    <div className=" w-full">
      <div className=" md:grid grid-cols-12 gap-5">
        <div className=" col-span-7 2xl:col-span-8 ">
          <h1 className=" text-2xl 2xl:text-3xl text-center font-extrabold text-zinc-200 font-movie tracking-wide">
            ITEM OVERVIEW
          </h1>
          <div className=" flex items-center justify-center h-full w-full">
            <div className=" w-32 md:w-40 lg:w-72 2xl:w-96">
              <img
                src={item?.thumbnail}
                className=" w-full h-full object-contain"
                alt=""
              />
            </div>

            <div className=" w-full ">
              <div>
                <h3 className=" text-lg 2xl:text-xl font-semibold text-zinc-400">
                  Name:{" "}
                  <span className=" font-medium text-zinc-100 capitalize">
                    {item?.name}
                  </span>
                </h3>
              </div>
              <div className=" w-56 md:w-96 mt-1">
                <h3 className=" w-56 md:w-80 2xl:w-96 truncate whitespace-nowrap text-lg 2xl:text-xl font-semibold text-zinc-400">
                  Creator:{" "}
                  <span className=" font-medium text-zinc-100 capitalize">
                    {item?.creator?.name}
                  </span>
                </h3>
              </div>
              <div className=" mt-1 flex items-center gap-2">
                <h3 className=" text-lg 2xl:text-xl font-semibold text-zinc-400">
                  Price:{" "}
                  <span className=" font-medium text-zinc-100 capitalize">
                    {item?.price}
                  </span>
                </h3>
                <div className="w-4 md:w-6 2xl:size-8">
                  <img
                    src="/images/robux-green.png"
                    className=" w-full h-full object-contain"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" col-span-5 2xl:col-span-4 mt-5 md:mt-0">
          <h1 className=" text-2xl 2xl:text-3xl text-center font-extrabold text-zinc-200 font-movie tracking-wide">
            PAYMENT
          </h1>
          <div className=" cursor-default w-full px-3 md:px-0 mt-5 mb-5 flex flex-col items-center justify-center gap-4">
            {/* stripe payment  */}
            {/* <div
              onClick={() => {
                setFormData((prevForm) => ({
                  ...prevForm,
                  payMethod: prevForm.payMethod === "stripe" ? "" : "stripe",
                }));
              }}
              className={` w-full p-3 bg-main rounded-md flex items-center gap-[22px] border ${
                formData.payMethod === "stripe"
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
                setFormData((prevForm) => ({
                  ...prevForm,
                  payMethod: prevForm.payMethod === "crypto" ? "" : "crypto",
                }));
              }}
              className={` w-full p-3 bg-main rounded-md flex items-center gap-[22px] border ${
                formData.payMethod === "crypto"
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
                setFormData((prevForm) => ({
                  ...prevForm,
                  payMethod: prevForm.payMethod === "balance" ? "" : "balance",
                }));
              }}
              className={` w-full p-3 bg-main rounded-md flex items-center gap-[22px] border ${
                formData.payMethod === "balance"
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
          </div>
        </div>
      </div>

      <div className=" w-full flex flex-col md:flex-row gap-2 md:gap-4 2xl:gap-5">
        <div className=" w-full md:w-1/3"></div>

        <div className=" w-full  md:w-2/3 flex items-center gap-3 md:gap-4 mt-3">
          <button
            onClick={() => {
              document.getElementById(`${summaryModalId}`).close();
              document.getElementById(`${urlModalId}`).showModal();
            }}
            className=" w-full flex items-center justify-center gap-1 bg-lightDark hover:bg-lightDark/80 duration-200 h-9 md:h-10 2xl:h-12 rounded-full shadow-lg"
          >
            <div>
              <IoIosArrowBack className=" size-5 2xl:size-6" />
            </div>
            <h3 className=" leading-3 text-base md:text-lg 2xl:text-xl font-medium">
              Back
            </h3>
          </button>
          {authUser ? (
            <button
              onClick={() => {
                console.log(formData);
              }}
              className=" w-full flex items-center justify-center gap-1 bg-lightDark hover:bg-lightDark/80 duration-200 h-9 md:h-10 2xl:h-12 rounded-full shadow-lg"
            >
              <h3 className=" leading-3 text-base md:text-lg 2xl:text-xl font-medium">
                Checkout (${formData.total})
              </h3>
              <div>
                <IoIosArrowForward className=" size-5 2xl:size-6" />
              </div>
            </button>
          ) : (
            <Link to="/login" className=" w-full">
              <button className=" w-full flex items-center justify-center gap-1 bg-lightDark hover:bg-lightDark/80 duration-200 h-9 md:h-10 2xl:h-12 rounded-full shadow-lg">
                <h3 className=" leading-3 text-base md:text-lg 2xl:text-xl font-medium">
                  Login Please
                </h3>
                <div>
                  <IoIosArrowForward className=" size-5 2xl:size-6" />
                </div>
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default SummaryModal;
