import React from "react";
import Layout from "../../components/layout/Layout";
import DashSidebar from "../../components/layout/DashSidebar";
import { IoIosNotificationsOutline } from "react-icons/io";
import { LuPackagePlus } from "react-icons/lu";
import { BsCashStack } from "react-icons/bs";
import OrdersTable from "../../components/dashboard/OrdersTable";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/utils/Loader";
import { MdOutlineCancel, MdOutlineMoneyOff } from "react-icons/md";
import { formatPostDate } from "../../components/utils/formatDate";
import { PiPiggyBank } from "react-icons/pi";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { GoPackage } from "react-icons/go";
import { FiltersProvider } from "../../context/FiltersContext";

const SellerDash = () => {
  const fetchNotifications = async ({ pageParam = 0 }) => {
    const { data } = await axios.get(
      `/api/rumman/v1/seller/notifications?skip=${pageParam}`
    );
    return data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["notifications"],
      queryFn: fetchNotifications,
      getNextPageParam: (lastPage, pages) => {
        return lastPage.length === 10 ? pages.length * 10 : undefined;
      },
    });

  const notifications = data?.pages.flat() || [];

  //----------------------------------recent order function start

  const { data: recentOrder, isLoading: recentOrderLoading } = useQuery({
    queryKey: ["recentOrder"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/rumman/v1/seller/recent-orders");
        const data = await res.json();
        if (!res.ok) {
          console.log(data);

          throw new Error(data.message || "An unknown error occurred");
        }
        return data;
      } catch (error) {
        console.log("Error recent order:", error);

        throw error;
      }
    },
  });

  //----------------------------------recent order function end

  //----------------------------------todays order function start

  const { data: todaysOrder, isLoading: todaysOrderLoading } = useQuery({
    queryKey: ["todaysOrder"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/rumman/v1/seller/todays-order");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "An unknown error occurred");
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
  });

  const { data: todaysRevenue, isLoading: todaysRevenueLoading } = useQuery({
    queryKey: ["todaysRevenue"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/rumman/v1/seller/todays-revenue");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "An unknown error occurred");
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
  });

  //----------------------------------todays order function end

  return (
    <FiltersProvider>
      <Layout>
        <div className="pb-20  lg:pb-0 bg-main min-h-screen text-dryGray pt-10 lg:pt-16">
          <div className=" container mx-auto px-2">
            <div className=" md:grid grid-cols-12 gap-12 pt-10">
              <div className=" col-span-3 relative  hidden lg:block">
                <DashSidebar />
              </div>
              <div className=" col-span-9">
                {/* states  */}
                <div className="grid grid-cols-12 grid-rows-4 gap-5">
                  <div className=" col-span-12 md:col-span-6 md:row-span-2">
                    <div className=" h-32 bg-dry rounded-md gap-4 flex flex-col items-center justify-center">
                      <h1 className=" text-text text-2xl font-bold">
                        Orders Today
                      </h1>
                      {todaysOrderLoading ? (
                        <Loader />
                      ) : (
                        <h1 className=" text-text text-4xl font-bold">
                          {todaysOrder}
                        </h1>
                      )}
                    </div>
                  </div>
                  <div className=" col-span-12 md:col-span-6 row-span-2 md:col-start-1 md:row-start-3">
                    <div className=" bg-dry h-32 rounded-md gap-4 flex flex-col items-center justify-center">
                      <h1 className=" text-text text-2xl font-bold">
                        Today's Revenue
                      </h1>
                      {todaysRevenueLoading ? (
                        <Loader />
                      ) : (
                        <h1 className=" text-text text-4xl font-bold">
                          ${todaysRevenue?.totalRevenue.toFixed(2)}
                        </h1>
                      )}
                    </div>
                  </div>

                  {/* notifications  */}
                  <div className=" col-span-12 md:col-span-6 row-span-4 md:col-start-7 row-start-1 ">
                    <div className=" bg-dry p-4  rounded-md  overflow-y-auto h-[280px]">
                      <div className=" flex items-center justify-between">
                        <span className=" text-text text-xl font-bold">
                          Notifications
                        </span>
                        <IoIosNotificationsOutline className=" w-6 h-6" />
                      </div>
                      <div className=" mt-3">
                        {notifications?.length === 0 ? (
                          <div className=" h-40 w-full flex items-center justify-center">
                            <p>No notifications</p>
                          </div>
                        ) : (
                          <div className=" flex flex-col gap-4">
                            {notifications?.map((notification) => (
                              <div
                                className=" flex items-center justify-between gap-3 text-sm 2xl:text-lg"
                                key={notification?._id}
                              >
                                <div className=" flex items-center gap-4">
                                  {notification?.type === "order" && (
                                    <>
                                      <LuPackagePlus className=" text-zinc-400 w-6 h-6" />
                                      <p className=" ">
                                        You got a new order of{" "}
                                        <span className=" font-medium">
                                          ${notification?.amount}
                                        </span>
                                      </p>
                                    </>
                                  )}
                                  {notification?.type === "withdrawal" && (
                                    <>
                                      <BsCashStack className=" w-6 h-6 text-zinc-400" />
                                      <p className=" ">
                                        Withdrawal of{" "}
                                        <span className=" font-medium">
                                          ${notification?.amount}
                                        </span>{" "}
                                        has been successful
                                      </p>
                                    </>
                                  )}
                                  {notification?.type === "orderRejected" && (
                                    <>
                                      <MdOutlineCancel className=" w-6 h-6 text-red-400" />
                                      <p className=" ">
                                        Order of{" "}
                                        <span className=" font-medium">
                                          {notification?.amount}
                                        </span>{" "}
                                        has been rejected
                                      </p>
                                    </>
                                  )}
                                  {notification?.type ===
                                    "withdrawalRejected" && (
                                    <>
                                      <MdOutlineMoneyOff className=" w-6 h-6 text-red-400" />
                                      <p className=" ">
                                        Withdrawal of{" "}
                                        <span className=" font-medium">
                                          ${notification?.amount}
                                        </span>{" "}
                                        has been rejected
                                      </p>
                                    </>
                                  )}
                                  {notification?.type === "deposit" && (
                                    <>
                                      <PiPiggyBank className=" w-6 h-6 text-zinc-400" />
                                      <p className=" ">
                                        Deposit of{" "}
                                        <span className=" font-medium">
                                          ${notification?.amount}
                                        </span>{" "}
                                        is successful
                                      </p>
                                    </>
                                  )}
                                  {notification?.type === "orderDelivered" && (
                                    <>
                                      <GoPackage className=" w-6 h-6 text-zinc-400" />
                                      <p className=" ">
                                        Order of{" "}
                                        <span className=" font-medium">
                                          {notification?.amount}
                                        </span>{" "}
                                        has delivered
                                      </p>
                                    </>
                                  )}
                                </div>

                                <div>
                                  <p className=" text-xs 2xl:text-sm whitespace-nowrap text-zinc-300">
                                    {formatPostDate(notification?.createdAt)}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {hasNextPage && notifications.length > 0 && (
                              <div className="w-full flex items-center justify-center">
                                <button
                                  className="w-28 h-8 bg-subMain text-main rounded-md text-sm"
                                  onClick={() => fetchNextPage()}
                                  disabled={isFetchingNextPage}
                                >
                                  {isFetchingNextPage
                                    ? "Loading..."
                                    : "Load More"}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* recent orders */}
                <h1 className=" text-text text-2xl font-bold mt-5 uppercase ">
                  Recent Orders
                </h1>
                <p className=" text-zinc-400">Most Recent Orders of Today</p>

                {/* orders table  */}
                <OrdersTable
                  items={recentOrder}
                  loading={recentOrderLoading}
                  location={"orders"}
                />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </FiltersProvider>
  );
};

export default SellerDash;
