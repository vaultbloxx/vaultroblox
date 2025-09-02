import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/layout/Layout";
import OrdersTable from "../../components/dashboard/OrdersTable";
import DashSidebar from "../../components/layout/DashSidebar";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { FiltersProvider } from "../../context/FiltersContext";

function Orders({ authUser }) {
  const USERS_PER_PAGE = 10;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  //----------------------get all order start---------------------//
  const fetchOrders = async ({ queryKey }) => {
    const [, page, search] = queryKey;
    const skip = (page - 1) * USERS_PER_PAGE;

    try {
      const res = await fetch(
        `/api/rumman/v1/seller/get-seller-orders?skip=${skip}&search=${search.trim()}`
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.error);

        throw new Error(data.error);
      }
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  //----------------------get all order end---------------------//

  const { data, isLoading } = useQuery({
    queryKey: ["orders", page, search, authUser?._id],
    queryFn: fetchOrders,
    keepPreviousData: true,
  });
  const debouncedSetSearch = useCallback(debounce(setSearch, 500), []);

  return (
    <FiltersProvider>
      <Layout>
        <div className="pb-20  lg:pb-0 bg-main min-h-screen text-dryGray pt-10 lg:pt-16">
          <div className="container mx-auto px-2">
            <div className="md:grid grid-cols-12 gap-12 pt-10">
              <div className="col-span-3 relative  hidden lg:block">
                <DashSidebar />
              </div>
              <div className="col-span-9">
                <div className="w-full rounded-md">
                  <h1 className="text-lg 2xl:text-2xl font-medium text-zinc-200">
                    Orders
                  </h1>
                  <p className="text-sm 2xl:text-lg text-zinc-400">
                    View and manage your orders
                  </p>
                  <input
                    type="text"
                    placeholder="Search by Id or Buyer Email"
                    onChange={(e) => debouncedSetSearch(e.target.value)}
                    className="px-3 py-2.5 md:py-2 2xl:py-3 outline-none text-sm 2xl:text-base rounded-md w-full lg:w-1/3 mt-2 bg-dry"
                  />
                  <OrdersTable
                    authUser={authUser}
                    items={data?.orders}
                    totalCars={data?.total}
                    page={page}
                    setPage={setPage}
                    USERS_PER_PAGE={USERS_PER_PAGE}
                    loading={isLoading}
                    location={"orders"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </FiltersProvider>
  );
}

export default Orders;
