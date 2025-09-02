import { useState } from "react";
import { Link } from "react-router-dom";
import CountFormatter from "../utils/formatNumber";

const RobuxAd = ({
  robuxdetails,
  modalId,
  taxModalId,
  formData,
  setFormData,
}) => {
  const BASE_PRICE = 5.5; // $5.50
  const BASE_ROBUX = 1000;

  return (
    <div className=" w-full ">
      <div className=" flex flex-col-reverse md:flex-row items-center px-2">
        <div className=" md:w-2/3 p-2">
          <h1 className=" text-zinc-200 text-2xl 2xl:text-3xl font-extrabold font-movie">
            BUY ROBUX
          </h1>
          <p className=" py-4 text-sm text-zinc-300">
            <span className=" font-normal 2xl:text-lg">
              Note: Buying Robux from our website is safe and secure. We use
              industry-standard encryption to protect your personal and payment
              information.
            </span>
          </p>

          <div className=" flex items-center gap-2">
            <span className=" text-xl 2xl:text-3xl font-extrabold text-dryGray">
              Stock
            </span>
            <div className=" w-5 h-5 2xl:size-6">
              <img
                src="/images/robux-green.png"
                alt=""
                className=" w-full h-full object-contain"
              />
            </div>

            <span className=" text-xl 2xl:text-2xl ml-1 text-white">
              <CountFormatter value={robuxdetails?.robux} />
            </span>
          </div>

          <div className=" w-full py-2">
            <div className=" grid grid-cols-2 md:grid-cols-4 gap-2">
              <div
                onClick={() => {
                  setFormData((prevData) => ({
                    total: robuxdetails?.first,
                    robuxAmount: robuxdetails?.firstR,
                    activeTab: prevData.activeTab === "first" ? "" : "first",
                  }));
                }}
                className={`${
                  formData.activeTab === "first"
                    ? "border-subMain"
                    : "border-transparent"
                } border cursor-pointer bg-black/60 rounded-md py-4 2xl:py-5 p-1 flex flex-col items-center justify-center`}
              >
                <h1 className=" text-sm lg:text-base 2xl:text-xl tracking-wide font-bold text-zinc-200 font-movie">
                  ${robuxdetails?.first}
                </h1>
                <span className=" font-medium text-sm lg:text-base 2xl:text-xl">
                  {robuxdetails?.firstR} R$
                </span>
              </div>
              <div
                onClick={() => {
                  setFormData((prevData) => ({
                    total: robuxdetails?.second,
                    robuxAmount: robuxdetails?.secondR,
                    activeTab: prevData.activeTab === "second" ? "" : "second",
                  }));
                }}
                className={`${
                  formData.activeTab === "second"
                    ? "border-subMain"
                    : "border-transparent"
                } border cursor-pointer bg-black/60 rounded-md py-4 2xl:py-5 p-1 flex flex-col items-center justify-center`}
              >
                <h1 className=" text-sm lg:text-base 2xl:text-xl tracking-wide font-bold text-zinc-200 font-movie">
                  ${robuxdetails?.second}
                </h1>
                <span className=" font-medium text-sm lg:text-base 2xl:text-xl">
                  {robuxdetails?.secondR} R$
                </span>
              </div>
              <div
                onClick={() => {
                  setFormData((prevData) => ({
                    total: robuxdetails?.third,
                    robuxAmount: robuxdetails?.thirdR,
                    activeTab: prevData.activeTab === "third" ? "" : "third",
                  }));
                }}
                className={`${
                  formData.activeTab === "third"
                    ? "border-subMain"
                    : "border-transparent"
                } border cursor-pointer bg-black/60 rounded-md py-4 2xl:py-5 p-1 flex flex-col items-center justify-center`}
              >
                <h1 className=" text-sm lg:text-base 2xl:text-xl tracking-wide font-bold text-zinc-200 font-movie">
                  ${robuxdetails?.third}
                </h1>
                <span className=" font-medium text-sm lg:text-base 2xl:text-xl">
                  {robuxdetails?.thirdR} R$
                </span>
              </div>
              <div
                onClick={() => {
                  setFormData((prevData) => ({
                    ...prevData,
                    activeTab:
                      prevData.activeTab === "fourth" ? "fourth" : "fourth",
                  }));
                }}
                className={`${
                  formData.activeTab === "fourth"
                    ? "border-subMain"
                    : "border-transparent"
                } border cursor-pointer bg-black/60 rounded-md py-4 2xl:py-5 p-1 flex flex-col items-center justify-center`}
              >
                {/* 👇 dynamic total */}
                <h1 className="text-sm lg:text-base 2xl:text-xl tracking-wide font-bold text-zinc-200 font-movie">
                  {formData.activeTab === "fourth" && formData.robuxAmount
                    ? `$${(
                        (parseFloat(formData.robuxAmount) / BASE_ROBUX) *
                        BASE_PRICE
                      ).toFixed(2)}`
                    : "$5.50/1K"}
                </h1>

                <div className="text-sm lg:text-base 2xl:text-xl tracking-wide font-bold text-zinc-200 px-2">
                  <input
                    type="number"
                    placeholder="Amount"
                    value={
                      (formData.activeTab === "fourth" &&
                        formData.robuxAmount) ||
                      ""
                    }
                    onChange={(e) => {
                      if (formData.activeTab === "fourth") {
                        let robuxAmount = e.target.value;

                        // ✅ Parse stock to number
                        const stock = parseFloat(robuxdetails?.robux) || 0;

                        // ✅ Prevent typing more than stock
                        if (parseFloat(robuxAmount) > stock) {
                          robuxAmount = stock.toString();
                        }

                        const total =
                          robuxAmount && !isNaN(robuxAmount)
                            ? (
                                (parseFloat(robuxAmount) / BASE_ROBUX) *
                                BASE_PRICE
                              ).toFixed(2)
                            : "";

                        setFormData({
                          ...formData,
                          robuxAmount,
                          total,
                        });
                      }
                    }}
                    className="w-full text-center rounded-md border border-border px-2 h-8 2xl:h-9 bg-dry outline-none font-medium text-sm lg:text-lg 2xl:text-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div onClick={() => console.log(formData)} className="w-full">
            <button
              onClick={() => {
                document.getElementById(`${taxModalId}`).showModal();
                document.getElementById(`${modalId}`).close();
              }}
              disabled={formData.activeTab === ""}
              title={
                formData.activeTab === "" ? "Please select a package" : "Next"
              }
              className={`${
                formData.activeTab === "" && "cursor-not-allowed"
              } shadow-lg w-full lg:w-max flex items-center justify-center gap-2 px-6 py-3 lg:py-2.5 2xl:py-3 rounded-full mt-2 bg-zinc-800`}
            >
              <span className=" text-sm lg:text-base 2xl:text-lg to-dry font-medium">
                NEXT
              </span>
              <div className=" w-5 h-5">
                <img
                  src="/images/robux-green.png"
                  alt="buy robux"
                  className=" w-full h-full object-contain"
                />
              </div>
            </button>
          </div>
        </div>
        <div className=" w-1/2 md:w-1/3 p-3">
          <img
            src="/images/robux.webp"
            alt=""
            className=" w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default RobuxAd;
