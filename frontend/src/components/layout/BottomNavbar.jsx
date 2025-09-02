import { GrHomeRounded } from "react-icons/gr";
import { NavLink } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { TbFileShredder, TbLayoutGridFilled } from "react-icons/tb";
import { CiSettings } from "react-icons/ci";
import { HiOutlineUpload } from "react-icons/hi";
import { AiOutlineCloudUpload, AiOutlineShop } from "react-icons/ai";
import {
  MdHistory,
  MdOutlineSell,
  MdOutlineSpaceDashboard,
  MdOutlineWorkHistory,
} from "react-icons/md";
import { IoCashOutline } from "react-icons/io5";
import { LuBookMarked, LuClipboardMinus, LuUsersRound } from "react-icons/lu";
import { BsApp } from "react-icons/bs";
import { PiFlagBannerFold } from "react-icons/pi";
import { RxExit } from "react-icons/rx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SiRoblox } from "react-icons/si";

function BottomNavbar({ authUser }) {
  const queryClient = useQueryClient();

  //logout mutation
  const { mutate: logoutMutation, isPending: isLogoutPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/rumman/v1/auth/logout", {
          method: "POST",
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
  return (
    <div className=" px-5 fixed flex items-center justify-between lg:hidden bottom-0 w-full h-16 bg-main border-t border-t-lightDark z-50">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive
            ? " text-subMain bg-dry rounded-md font-semibold"
            : " text-dryGray hover:bg-lightDark rounded-md"
        }
      >
        <div className=" h-12 w-12 flex items-center justify-center gap-2">
          <GrHomeRounded className=" size-6" />
        </div>
      </NavLink>

      <NavLink
        to="/orders"
        className={({ isActive }) =>
          isActive
            ? " text-subMain bg-dry rounded-md font-semibold"
            : " text-dryGray hover:bg-lightDark rounded-md"
        }
      >
        <div className="h-12 w-12 flex items-center justify-center gap-2">
          <TbFileShredder className=" size-7" />
        </div>
      </NavLink>

      <div className="dropdown dropdown-top">
        <div
          tabIndex={0}
          role="button"
          className="h-12 w-12 border rounded-md border-border flex items-center justify-center "
        >
          <TbLayoutGridFilled className=" size-7 text-dryGray hover:text-subMain" />
        </div>
        <ul
          tabIndex={0}
          className="relative dropdown-content menu mb-5 border border-lightDark bg-dry dark:bg-main rounded-box z-[1] w-60 p-2 shadow transform -translate-x-1/2 left-1/2"
        >
          {/* Triangle arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-dry dark:bg-main rotate-45 border-r border-b border-lightDark "></div>

          {authUser ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? " text-subMain bg-lightDark rounded-md font-semibold"
                    : " text-dryGray hover:bg-lightDark rounded-md"
                }
              >
                <div className=" py-2 px-3 flex items-center gap-2 text-lg">
                  <MdOutlineSpaceDashboard className=" size-7" />
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
                <div className=" py-2 px-3 flex items-center gap-2 text-lg">
                  <AiOutlineCloudUpload className=" size-7" />
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
                <div className=" py-2 px-3 flex items-center gap-2 text-lg">
                  <TbFileShredder className=" size-7" />
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
                    <div className=" py-2 px-3 flex items-center gap-2 text-lg">
                      <LuUsersRound className=" size-7" />
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
                    <div className=" py-2 px-3 flex items-center gap-2 text-lg">
                      <PiFlagBannerFold className=" size-7" />
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
                    <div className=" py-2 px-3 flex items-center gap-2 text-lg">
                      <LuClipboardMinus className=" size-7" />
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
                    <div className=" py-2 px-3 flex items-center gap-2 text-lg">
                      <BsApp className=" size-7" />
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
                    <div className=" py-2 px-3 flex items-center gap-2 text-lg">
                      <MdOutlineSell className=" size-7" />
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
                    <div className=" py-2 px-3 flex items-center gap-2 text-lg">
                      <LuBookMarked className=" size-7" />
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
                    <div className=" py-2 px-3 flex items-center gap-2 text-lg">
                      <SiRoblox className=" size-7" />
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
                    <div className=" py-2 px-3 flex items-center gap-2 text-lg">
                      <SiRoblox className="size-7" />
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
                    <div className=" py-2 px-3 flex items-center gap-2 text-lg">
                      <IoCashOutline className=" size-7" />
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
                <div className=" py-2 px-3 flex items-center gap-2 text-lg">
                  <MdHistory className=" size-7" />
                  <span>History</span>
                </div>
              </NavLink>
              <NavLink
                to="/transactions/deposit"
                className={({ isActive }) =>
                  isActive
                    ? " text-subMain bg-lightDark rounded-md font-semibold z-20"
                    : " text-dryGray hover:bg-lightDark rounded-md z-20"
                }
              >
                <div className=" py-2 px-3 flex items-center gap-2 text-lg">
                  <MdOutlineWorkHistory className="size-7" />
                  <span>Transactions</span>
                </div>
              </NavLink>
            </>
          ) : (
            <div className=" px-2 py-4">
              <p className=" text-dryGray text-lg text-center font-medium">
                Login First
              </p>
              <p className=" text-zinc-400 text-sm text-center">
                To use all features
              </p>
            </div>
          )}
        </ul>
      </div>

      <NavLink
        to="/list-limiteds"
        className={({ isActive }) =>
          isActive
            ? " text-subMain bg-dry rounded-md font-semibold"
            : " text-dryGray hover:bg-lightDark rounded-md"
        }
      >
        <div className=" h-12 w-12 flex items-center justify-center gap-2  text-lg">
          <HiOutlineUpload className=" size-7" />
        </div>
      </NavLink>

      <div className="dropdown dropdown-top dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className=" h-16  w-12  rounded-md r flex items-center justify-center "
        >
          <FaRegUserCircle className=" size-6 text-dryGray hover:text-subMain" />
        </div>
        <ul
          tabIndex={0}
          className=" relative dropdown-content menu mb-5 border border-lightDark bg-dry dark:bg-main rounded-box z-[1] w-52 p-2 shadow "
        >
          {/* Triangle arrow */}
          <div className="absolute -bottom-2 right-7 w-4 h-4 bg-dry dark:bg-main rotate-45 border-r border-b border-lightDark "></div>

          <NavLink
            to={`${authUser ? `/shop/${authUser?.username}` : "/login"}`}
            className={({ isActive }) =>
              isActive
                ? " text-subMain bg-lightDark rounded-md font-semibold"
                : " text-dryGray hover:bg-lightDark rounded-md"
            }
          >
            <div className=" py-2 px-3 flex items-center gap-2  text-lg">
              <AiOutlineShop className="size-7" />
              <span>Your Shop</span>
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
            <div className=" py-2 px-3 flex items-center gap-2  text-lg">
              <MdOutlineWorkHistory className=" size-7" />
              <span>Transactions</span>
            </div>
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive
                ? " text-subMain bg-lightDark rounded-md font-semibold"
                : " text-dryGray hover:bg-lightDark rounded-md"
            }
          >
            <div className=" py-2 px-3 flex items-center gap-2  text-lg">
              <CiSettings className=" size-7" />
              <span>Settings</span>
            </div>
          </NavLink>

          {authUser && (
            <div
              onClick={() => logoutMutation()}
              className=" py-1 px-[15px] flex items-center gap-2 z-20"
            >
              <div>
                <RxExit className=" size-6" />
              </div>
              <p className=" text-lg">
                {isLogoutPending ? "Logging out..." : "Logout"}
              </p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}

export default BottomNavbar;
