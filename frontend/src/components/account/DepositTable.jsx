import React from "react";
import Loader from "../utils/Loader";
import { format } from "date-fns";

const DepositTable = ({ items, loading }) => {
  return (
    <div className=" w-full h-[70vh] relative overflow-scroll no-scrollbar">
      <div className=" font-semibold sticky top-0 left-0 w-full py-5 px-6 bg-dry rounded-md">
        <div className="grid grid-cols-4 grid-rows-1 gap-2">
          <div className="">Deposit ID</div>
          <div className="">Amount</div>
          <div className="">Status</div>
          <div className="">Date</div>
        </div>
      </div>

      {/* table data  */}
      {loading ? (
        <div className=" flex items-center justify-center h-40">
          <Loader />
        </div>
      ) : (
        <div className=" mt-4">
          {items.length === 0 ? (
            <div className=" flex items-center justify-center h-40">
              No data found
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item?._id}
                className="py-3 mt-3 border-b border-dry px-6 "
              >
                <div className="grid grid-cols-4 grid-rows-1 gap-2">
                  <div>
                    <span className=" text-sm">{item?._id}</span>
                  </div>
                  <div>${item?.amount.toFixed(2)}</div>
                  <div className=" capitalize">{item?.status}</div>
                  <div>{format(new Date(item?.createdAt), "yyyy-MM-dd")}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DepositTable;
