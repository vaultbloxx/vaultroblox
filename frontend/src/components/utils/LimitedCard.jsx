import React, { forwardRef } from "react";
import { FaRegCreditCard } from "react-icons/fa6";
import { FaBitcoin } from "react-icons/fa";
import LimitedModal from "./LimitedModal";
import CountFormatter from "./formatNumber";

const LimitedCard = forwardRef(({ limited, setSelectedLimited }, ref) => {
  return (
    <div
      ref={ref}
      className="border hover:border-zinc-800 border-main w-full bg-dry rounded-md mt-3"
    >
      <div
        onClick={() => {
          setSelectedLimited(null);
          setTimeout(() => {
            setSelectedLimited(limited);
          }, 100);
          setTimeout(() => {
            document.getElementById(`${limited?._id}`).showModal();
          }, 150);
        }}
        className=" cursor-pointer w-full px-3 pt-2 "
      >
        <div className=" flex items-center justify-between">
          {limited?.sold ? (
            <div className=" px-3 py-1.5 rounded-full bg-zinc-800 shadow-md">
              <h1 className=" text-subMain text-sm font-medium">Sold</h1>
            </div>
          ) : (
            <div></div>
          )}
          <div className=" px-3 py-1.5 rounded-full bg-zinc-800">
            <div className=" flex items-center gap-2  ">
              <FaRegCreditCard className=" w-4 h-4 text-subMain" />
              <FaBitcoin className=" w-4 h-4 text-subMain" />
            </div>
          </div>
        </div>
        <div className=" w-full h-40  flex items-center justify-center">
          <img
            src={limited?.image}
            alt={limited?.name}
            className=" w-full h-full object-contain"
          />
        </div>

        <div className=" mt-1">
          <h1 className=" text-text text-lg text-center font-medium">
            {limited?.name}
          </h1>
        </div>

        <div className=" flex items-center py-4 gap-2">
          <div className=" w-full flex items-center justify-center flex-col">
            <h1 className=" leading-4 text-text text-lg text-center font-medium">
              RAP
            </h1>
            <h1 className=" text-subMain text-lg text-center font-medium">
              <CountFormatter value={limited?.rap} />
            </h1>
          </div>
          <div className=" w-full flex items-center justify-center flex-col">
            <h1 className=" leading-4 text-text text-lg text-center font-medium">
              Price
            </h1>
            <h1 className=" text-subMain text-lg text-center font-medium">
              ${limited?.price}
            </h1>
          </div>
        </div>
      </div>

      {/* <LimitedModal limited={limited} /> */}
    </div>
  );
});

export default LimitedCard;
