import { NavLink } from "react-router-dom";
import { LuClipboardMinus } from "react-icons/lu";
import {
  MdOutlineSpaceDashboard,
  MdHistory,
  MdOutlineWorkHistory,
  MdOutlineSell,
} from "react-icons/md";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { TbFileShredder } from "react-icons/tb";
import { LuBookMarked, LuUsersRound } from "react-icons/lu";
import { SiRoblox } from "react-icons/si";
import { useQuery } from "@tanstack/react-query";
import { IoCashOutline } from "react-icons/io5";
import { BsApp } from "react-icons/bs";
import { PiFlagBannerFold } from "react-icons/pi";

const DashSidebar = () => {
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });
  return (
    <div className=" sticky top-20 bg-dry p-3 rounded-md text-dryGray">
      <div className=" flex flex-col gap-3">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? " text-subMain bg-lightDark rounded-md font-semibold"
              : " text-dryGray hover:bg-lightDark rounded-md"
          }
        >
          <div className=" py-2 px-3 flex items-center gap-2 2xl:text-xl">
            <MdOutlineSpaceDashboard className=" w-5 h-5 2xl:size-7" />
            <span>Dashboard</span>
          </div>
        </NavLink>
        <NavLink
          to="/list-limiteds"
          className={({ isActive }) =>
            isActive
              ? " text-subMain bg-lightDark rounded-md font-semibold"
              : " text-dryGray hover:bg-lightDark rounded-md"
          }
        >
          <div className=" py-2 px-3 flex items-center gap-2 2xl:text-xl">
            <AiOutlineCloudUpload className=" w-5 h-5 2xl:size-7" />
            <span>List Limited</span>
          </div>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive
              ? " text-subMain bg-lightDark rounded-md font-semibold"
              : " text-dryGray hover:bg-lightDark rounded-md"
          }
        >
          <div className=" py-2 px-3 flex items-center gap-2 2xl:text-xl">
            <TbFileShredder className=" w-5 h-5 2xl:size-7" />
            <span>Orders</span>
          </div>
        </NavLink>
        {(authUser?.role === "admin" || authUser?.role === "owner") && (
          <>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                isActive
                  ? " text-subMain bg-lightDark rounded-md font-semibold"
                  : " text-dryGray hover:bg-lightDark rounded-md"
              }
            >
              <div className=" py-2 px-3 flex items-center gap-2 2xl:text-xl">
                <LuUsersRound className=" w-5 h-5 2xl:size-7" />
                <span>Users</span>
              </div>
            </NavLink>
            <NavLink
              to="/all-banner"
              className={({ isActive }) =>
                isActive
                  ? " text-subMain bg-lightDark rounded-md font-semibold"
                  : " text-dryGray hover:bg-lightDark rounded-md"
              }
            >
              <div className=" py-2 px-3 flex items-center gap-2 2xl:text-xl">
                <PiFlagBannerFold className=" w-5 h-5 2xl:size-7" />
                <span>Banners</span>
              </div>
            </NavLink>
            <NavLink
              to="/create-limited"
              className={({ isActive }) =>
                isActive
                  ? " text-subMain bg-lightDark rounded-md font-semibold"
                  : " text-dryGray hover:bg-lightDark rounded-md"
              }
            >
              <div className=" py-2 px-3 flex items-center gap-2 2xl:text-xl">
                <LuClipboardMinus className=" w-5 h-5 2xl:size-7" />
                <span>Create Limited</span>
              </div>
            </NavLink>
            <NavLink
              to="/all-limiteds"
              className={({ isActive }) =>
                isActive
                  ? " text-subMain bg-lightDark rounded-md font-semibold"
                  : " text-dryGray hover:bg-lightDark rounded-md"
              }
            >
              <div className=" py-2 px-3 flex items-center gap-2 2xl:text-xl">
                <BsApp className=" w-5 h-5 2xl:size-7" />
                <span>Limiteds</span>
              </div>
            </NavLink>
            <NavLink
              to="/recently-sold"
              className={({ isActive }) =>
                isActive
                  ? " text-subMain bg-lightDark rounded-md font-semibold"
                  : " text-dryGray hover:bg-lightDark rounded-md"
              }
            >
              <div className=" py-2 px-3 flex items-center gap-2 2xl:text-xl">
                <MdOutlineSell className=" w-5 h-5 2xl:size-7" />
                <span>Recently Sold</span>
              </div>
            </NavLink>
            <NavLink
              to="/all-orders"
              className={({ isActive }) =>
                isActive
                  ? " text-subMain bg-lightDark rounded-md font-semibold"
                  : " text-dryGray hover:bg-lightDark rounded-md"
              }
            >
              <div className=" py-2 px-3 flex items-center gap-2 2xl:text-xl">
                <LuBookMarked className=" w-5 h-5 2xl:size-7" />
                <span>All Orders</span>
              </div>
            </NavLink>
            <NavLink
              to="/stock"
              className={({ isActive }) =>
                isActive
                  ? " text-subMain bg-lightDark rounded-md font-semibold"
                  : " text-dryGray hover:bg-lightDark rounded-md"
              }
            >
              <div className=" py-2 px-3 flex items-center gap-2 2xl:text-xl">
                <SiRoblox className=" w-5 h-5 2xl:size-7" />
                <span>Stock</span>
              </div>
            </NavLink>
            <NavLink
              to="/robux-orders"
              className={({ isActive }) =>
                isActive
                  ? " text-subMain bg-lightDark rounded-md font-semibold"
                  : " text-dryGray hover:bg-lightDark rounded-md"
              }
            >
              <div className=" py-2 px-3 flex items-center gap-2 2xl:text-xl">
                <SiRoblox className=" w-5 h-5 2xl:size-7" />
                <span>Robux Orders</span>
              </div>
            </NavLink>
            <NavLink
              to="/withdrawal-requests"
              className={({ isActive }) =>
                isActive
                  ? " text-subMain bg-lightDark rounded-md font-semibold"
                  : " text-dryGray hover:bg-lightDark rounded-md"
              }
            >
              <div className=" py-2 px-3 flex items-center gap-2 2xl:text-xl">
                <IoCashOutline className=" w-5 h-5 2xl:size-7" />
                <span>Withdrawal</span>
              </div>
            </NavLink>
          </>
        )}
        <NavLink
          to="/history"
          className={({ isActive }) =>
            isActive
              ? " text-subMain bg-lightDark rounded-md font-semibold"
              : " text-dryGray hover:bg-lightDark rounded-md"
          }
        >
          <div className=" py-2 px-3 flex items-center gap-2 2xl:text-xl">
            <MdHistory className=" w-5 h-5 2xl:size-7" />
            <span>History</span>
          </div>
        </NavLink>
        <NavLink
          to="/transactions/deposit"
          className={({ isActive }) =>
            isActive
              ? " text-subMain bg-lightDark rounded-md font-semibold"
              : " text-dryGray hover:bg-lightDark rounded-md"
          }
        >
          <div className=" py-2 px-3 flex items-center gap-2 2xl:text-xl">
            <MdOutlineWorkHistory className=" w-5 h-5 2xl:size-7" />
            <span>Transactions</span>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default DashSidebar;
