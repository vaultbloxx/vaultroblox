import React from "react";
import { NavLink } from "react-router-dom";
import { MdOutlineHistory } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { BsCashStack } from "react-icons/bs";

const TransSidebar = () => {
  return (
    <div className=" sticky top-20 bg-dry p-3 rounded-md text-dryGray">
      <div className=" flex flex-col gap-3">
        <NavLink
          to="/transactions/deposit"
          className={({ isActive }) =>
            isActive
              ? " text-subMain bg-lightDark rounded-md font-semibold"
              : " text-dryGray hover:bg-lightDark rounded-md"
          }
        >
          <div className=" py-2 px-3 flex items-center gap-2">
            <IoMdAdd className=" w-5 h-5" />
            <span>Deposits</span>
          </div>
        </NavLink>
        <NavLink
          to="/transactions/withdrawal"
          className={({ isActive }) =>
            isActive
              ? " text-subMain bg-lightDark rounded-md font-semibold"
              : " text-dryGray hover:bg-lightDark rounded-md"
          }
        >
          <div className=" py-2 px-3 flex items-center gap-2">
            <BsCashStack className=" w-5 h-5" />
            <span>Withdrawals</span>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default TransSidebar;
