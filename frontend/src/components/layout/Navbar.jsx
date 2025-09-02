import React, { useEffect, useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { Link, NavLink, useLocation } from "react-router-dom";
import Wallet from "../navbar/Wallet";
import { RxDashboard } from "react-icons/rx";
import { IoIosArrowDown } from "react-icons/io";
import { FaRegCircleUser } from "react-icons/fa6";
import { RxExit } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import { IoMdHeartEmpty } from "react-icons/io";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import MobileWallet from "../navbar/MobileWallet";
import FilterSidebar from "./FilterSidebar";
import { FaDiscord } from "react-icons/fa";
import { debounce } from "lodash";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { MdHeartBroken } from "react-icons/md";
import Loader from "../utils/Loader";
import { useFilters } from "../../context/FiltersContext";

const Navbar = ({ authUser }) => {
  const { setFilters } = useFilters();
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = useLocation();

  const handleSearch = debounce((value) => {
    setFilters((prev) => ({ ...prev, search: value }));
  }, 500);

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

  //get liked items
  // const { mutate: likeUnlike, isPending: isLikePending } = useMutation({
  //   mutationFn: async (limitedId) => {
  //     try {
  //       const res = await fetch(
  //         `/api/rumman/v1/user/like-unlike/${limitedId}`,
  //         {
  //           method: "POST",
  //         }
  //       );
  //       const data = await res.json();
  //       if (!res.ok) {
  //         throw new Error(data.error);
  //       }
  //       return data;
  //     } catch (error) {
  //       throw error;
  //     }
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["authUser"] });
  //   },
  // });

  return (
    <div className=" bg-main w-full text-dryGray fixed top-0 z-50">
      <div className=" container mx-auto px-2 pt-3 pb-2 md:py-4 ">
        <div className=" lg:grid grid-cols-9 justify-between items-center">
          {/* search bar  */}
          <div className=" col-span-4 w-full flex items-center gap-1 md:gap-5">
            {/* logo */}
            <div className=" block ">
              <Link to="/">
                <div className=" w-12 2xl:w-14 2xl:h-12">
                  <img
                    src="/images/vault_logo.webp"
                    alt="vault logo"
                    className=" w-full h-full object-cover"
                  />
                </div>
              </Link>
            </div>
            <div className=" w-full flex items-center gap-1">
              <form
                onSubmit={(e) => e.preventDefault()}
                className=" w-full flex items-center"
              >
                <button className=" px-2 md:px-3  h-10 2xl:h-12 rounded-l-md bg-subMain text-dry flex items-center justify-center ">
                  <IoSearch className=" text-myWhite size-5 2xl:size-6" />
                </button>
                <input
                  type="text"
                  placeholder="Search limited"
                  className=" px-3 h-10 2xl:h-12 outline-none  text-sm 2xl:text-lg rounded-r-md w-full lg:w-4/5 bg-dry "
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearch(e.target.value);
                  }}
                />
              </form>

              {authUser && (
                <div className=" block lg:hidden">
                  <MobileWallet
                    frozenBalanceAmount={authUser?.frozenBalance}
                    clientHoldUntil={authUser?.frozenEnd}
                    role={authUser?.role}
                    buyerBalance={authUser?.buyerBalance}
                    sellerBalance={authUser?.sellerBalance}
                    isTwoFa={authUser?.twoFa}
                  />
                </div>
              )}

              {!authUser && (
                <NavLink to="/login" className={" block lg:hidden"}>
                  <button className=" px-3 h-10 rounded-md bg-subMain hover:bg-opacity-95 transition-all font-medium text-myWhite">
                    Login
                  </button>
                </NavLink>
              )}

              {/* filter drawer */}
              {pathname.pathname === "/" && (
                <div className="drawer drawer-end w-max">
                  <input
                    id="filter_drawer"
                    type="checkbox"
                    className="drawer-toggle"
                  />
                  <div className="drawer-content w-10 h-10">
                    {/* Button to open drawer */}
                    <label htmlFor="filter_drawer">
                      <div className=" lg:hidden w-full h-full rounded-md border flex items-center justify-center border-subMain">
                        <TbAdjustmentsHorizontal className=" size-6 text-subMain" />
                      </div>
                    </label>
                  </div>

                  <div className="drawer-side z-50">
                    <label
                      htmlFor="filter_drawer"
                      aria-label="close sidebar"
                      className="drawer-overlay "
                    ></label>
                    <div className="menu bg-dry text-dryGray min-h-full w-2/3 p-5">
                      {/* filter content here */}
                      <FilterSidebar
                        classes={"lg:hidden block"}
                        modalId={"filter_small_screen"}
                        taxModalId={"tax_small_screen"}
                        urlModalId={"url_small_screen"}
                        summaryModalId={"summary_small_screen"}
                        setFilters={setFilters}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* navlinks  */}
          <div className=" col-span-5 text-sm justify-end hidden lg:flex items-center gap-6 xl:gap-8 2xl:gap-10">
            {authUser ? (
              <>
                <Wallet
                  frozenBalanceAmount={authUser?.frozenBalance}
                  clientHoldUntil={authUser?.frozenEnd}
                  role={authUser?.role}
                  buyerBalance={authUser?.buyerBalance}
                  sellerBalance={authUser?.sellerBalance}
                  isTwoFa={authUser?.twoFa}
                />
                {/* wishlist */}
                {
                  // <div className="">
                  //   <div className="drawer drawer-end">
                  //     <input
                  //       id="my-drawer-4"
                  //       type="checkbox"
                  //       className="drawer-toggle"
                  //     />
                  //     <div className="drawer-content">
                  //       {/* Button to open drawer */}
                  //       <label htmlFor="my-drawer-4">
                  //         <div className=" cursor-pointer">
                  //           <div className=" relative px-2 py-2 rounded-md bg-subMain">
                  //             <IoMdHeartEmpty className=" w-5 h-5 text-myWhite" />
                  //             {authUser?.likedLimiteds?.length > 0 && (
                  //               <div className=" absolute top-1.5 right-[2px] w-[13px] h-[13px] flex items-center justify-center bg-main rounded-full text-[10px] leading-3">
                  //                 {authUser?.likedLimiteds?.length}
                  //               </div>
                  //             )}
                  //           </div>
                  //         </div>
                  //       </label>
                  //     </div>
                  //     <div className="drawer-side z-50">
                  //       <label
                  //         htmlFor="my-drawer-4"
                  //         aria-label="close sidebar"
                  //         className="drawer-overlay "
                  //       ></label>
                  //       <ul className="menu bg-lightDark text-dryGray min-h-full w-1/3 p-5">
                  //         {/* Sidebar content here */}
                  //         {authUser?.likedLimiteds?.length > 0 ? (
                  //           <>
                  //             {/* wishlist */}
                  //             {authUser?.likedLimiteds.map((item) => (
                  //               <div
                  //                 key={item?._id}
                  //                 className=" w-full mt-3 pt-2 px-3 border-t  border-zinc-700"
                  //               >
                  //                 <div className=" w-full flex items-center justify-between">
                  //                   <div className=" flex items-center gap-5">
                  //                     <div className=" w-14 h-14">
                  //                       <img
                  //                         src={item?.image}
                  //                         alt={item?.name}
                  //                         title={item?.name}
                  //                         className=" w-full h-full object-contain"
                  //                       />
                  //                     </div>
                  //                     <div className="">
                  //                       <h1 className=" text-sm font-medium">
                  //                         {item?.name}
                  //                       </h1>
                  //                       <p className=" text-sm tracking-wide text-zinc-300">
                  //                         {item?.price}$
                  //                       </p>
                  //                     </div>
                  //                   </div>
                  //                   {/* delete button  */}
                  //                   <div>
                  //                     <button
                  //                       onClick={() => {
                  //                         likeUnlike(item?._id);
                  //                       }}
                  //                       className=" p-1"
                  //                     >
                  //                       {isLikePending ? (
                  //                         <Loader />
                  //                       ) : (
                  //                         <RxCross2 className=" w-5 h-5 text-subMain hover:text-subMain/70" />
                  //                       )}
                  //                     </button>
                  //                   </div>
                  //                 </div>
                  //               </div>
                  //             ))}
                  //           </>
                  //         ) : (
                  //           <div className=" w-full h-[70vh] flex flex-col items-center justify-center">
                  //             <MdHeartBroken className=" w-20 h-20 text-subMain opacity-40 mb-3" />
                  //             <span>No liked items yet</span>
                  //           </div>
                  //         )}
                  //       </ul>
                  //     </div>
                  //   </div>
                  // </div>
                }

                <Link to="" target="_blank">
                  <div className=" w-14 h-10 2xl:h-12 rounded-md bg-subMain  flex items-center justify-center">
                    <FaDiscord className="size-9" />
                  </div>
                </Link>

                <div className="dropdown dropdown-hover dropdown-end">
                  <Link to="/dashboard">
                    <div tabIndex={0} className=" cursor-pointer">
                      <div className=" px-2 w-20 h-10 2xl:h-12 rounded-md bg-subMain  flex items-center justify-center gap-1">
                        <RxDashboard className=" size-7 text-myWhite" />
                        <IoIosArrowDown className=" size-5 text-myWhite" />
                      </div>
                    </div>
                  </Link>
                  <ul tabIndex={0} className=" pt-4 dropdown-content menu ">
                    <div className=" relative bg-lightDark  rounded-md z-[1] w-52 2xl:w-64 p-2 mt- shadow">
                      {/* Triangle arrow */}
                      <div className="absolute 2xl:-top-2.5 -top-2 right-7 size-4 2xl:w-5 2xl:h-5 bg-lightDark dark:bg-lightDark rotate-45"></div>

                      <Link to="/dashboard">
                        <li className=" hover:bg-[#414141] rounded-md 2xl:text-xl">
                          <span>Dashboard</span>
                        </li>
                      </Link>
                      <Link to="/list-limiteds">
                        <li className=" hover:bg-[#414141] rounded-md 2xl:text-xl">
                          <span>List Limiteds</span>
                        </li>
                      </Link>
                      <Link to="/orders">
                        <li className=" hover:bg-[#414141] rounded-md 2xl:text-xl">
                          <span>Orders</span>
                        </li>
                      </Link>
                      {(authUser?.role === "admin" ||
                        authUser?.role === "owner") && (
                        <>
                          <Link to="/users">
                            <li className=" hover:bg-[#414141] rounded-md 2xl:text-xl">
                              <span>Users</span>
                            </li>
                          </Link>
                          <Link to="/all-limiteds">
                            <li className=" hover:bg-[#414141] rounded-md 2xl:text-xl">
                              <span>All Limiteds</span>
                            </li>
                          </Link>
                          <Link to="/all-banner">
                            <li className=" hover:bg-[#414141] rounded-md 2xl:text-xl">
                              <span>Banners</span>
                            </li>
                          </Link>
                          <Link to="/recently-sold">
                            <li className=" hover:bg-[#414141] rounded-md 2xl:text-xl">
                              <span>Recently Sold</span>
                            </li>
                          </Link>

                          <Link to="/all-orders">
                            <li className=" hover:bg-[#414141] rounded-md 2xl:text-xl">
                              <span>All Orders</span>
                            </li>
                          </Link>
                          <Link to="/stock">
                            <li className=" hover:bg-[#414141] rounded-md 2xl:text-xl">
                              <span>Stock</span>
                            </li>
                          </Link>
                          <Link to="/withdrawal-requests">
                            <li className=" hover:bg-[#414141] rounded-md 2xl:text-xl">
                              <span>Withdrawal</span>
                            </li>
                          </Link>
                        </>
                      )}
                      <Link to="/history">
                        <li className=" hover:bg-[#414141] rounded-md 2xl:text-xl">
                          <span>History</span>
                        </li>
                      </Link>
                      <Link to="/transactions/deposit">
                        <li className=" hover:bg-[#414141] rounded-md 2xl:text-xl">
                          <span>Transactions</span>
                        </li>
                      </Link>
                    </div>
                  </ul>
                </div>

                <div className="dropdown dropdown-hover dropdown-end">
                  <Link to={`/shop/${authUser?.username}`}>
                    <div tabIndex={0} className=" cursor-pointer">
                      <div className=" px-2 w-14 flex items-center justify-center h-10 2xl:h-12 rounded-md bg-subMain ">
                        <FaRegCircleUser className="size-7 text-myWhite" />
                      </div>
                    </div>
                  </Link>
                  <ul tabIndex={0} className=" pt-4 dropdown-content menu ">
                    <div className=" relative bg-lightDark  rounded-md z-[1] w-52 2xl:w-64 p-2 mt- shadow">
                      {/* Triangle arrow */}
                      <div className="absolute 2xl:-top-2.5 -top-2 right-5 size-4 2xl:w-5 2xl:h-5 rounded-tl-[3px] bg-lightDark dark:bg-lightDark rotate-45"></div>

                      <Link to={`/shop/${authUser?.username}`}>
                        <li className=" hover:bg-[#414141] rounded-md 2xl:text-xl">
                          <span>Your Shop</span>
                        </li>
                      </Link>
                      <Link to="/transactions/deposit">
                        <li className=" hover:bg-[#414141] rounded-md 2xl:text-xl">
                          <span>Transactions</span>
                        </li>
                      </Link>
                      <Link to="/settings">
                        <li className=" hover:bg-[#414141] rounded-md 2xl:text-xl">
                          <span>Settings</span>
                        </li>
                      </Link>

                      <li
                        onClick={() => logoutMutation()}
                        className={`${
                          isLogoutPending && "cursor-not-allowed"
                        } hover:bg-[#414141] rounded-md `}
                      >
                        <span className=" flex items-center gap-2 2xl:text-xl">
                          <p>Logout</p>
                          <RxExit className=" w-4 h-4 2xl:size-5 text-myWhite " />
                        </span>
                      </li>
                    </div>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/">
                  <div className="group">
                    <p className=" text-lg 2xl:text-xl">Market</p>
                    <div className=" h-[2px] bg-subMain w-0 group-hover:w-full duration-300 transition-all" />
                  </div>
                </NavLink>

                <div
                  onClick={() =>
                    document.getElementById("filter_big_screen").showModal()
                  }
                  className="group cursor-pointer"
                >
                  <p className=" text-lg 2xl:text-xl">Buy Robux</p>
                  <div className=" h-[2px] bg-subMain w-0 group-hover:w-full duration-300 transition-all" />
                </div>

                <NavLink to="/">
                  <div className="group">
                    <p className=" text-lg 2xl:text-xl">Become seller</p>
                    <div className=" h-[2px] bg-subMain w-0 group-hover:w-full duration-300 transition-all" />
                  </div>
                </NavLink>
                <NavLink to="/">
                  <div className="group">
                    <p className=" text-lg 2xl:text-xl">About</p>
                    <div className=" h-[2px] bg-subMain w-0 group-hover:w-full duration-300 transition-all" />
                  </div>
                </NavLink>

                <div className=" flex items-center gap-4">
                  <NavLink to="/login">
                    <button className=" text-lg 2xl:text-xl px-5 h-10 2xl:h-12 rounded-md bg-subMain hover:bg-opacity-95 transition-all font-medium text-myWhite">
                      Login
                    </button>
                  </NavLink>

                  <Link to="" target="_blank">
                    <div className=" w-14 h-10 2xl:h-12 rounded-md bg-subMain  flex items-center justify-center">
                      <FaDiscord className="size-9" />
                    </div>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
