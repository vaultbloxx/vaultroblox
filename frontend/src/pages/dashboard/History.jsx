import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/layout/Layout";
import OrdersTable from "../../components/dashboard/OrdersTable";
import DashSidebar from "../../components/layout/DashSidebar";
import debounce from "lodash.debounce";
import { useQuery } from "@tanstack/react-query";
import { FiltersProvider } from "../../context/FiltersContext";

function History({ authUser }) {
  const USERS_PER_PAGE = 10;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  //----------------------get all order start---------------------//
  const fetchOrders = async ({ queryKey }) => {
    const [, page, search] = queryKey;
    const skip = (page - 1) * USERS_PER_PAGE;

    try {
      const res = await fetch(
        `/api/rumman/v1/seller/get-buyer-orders?skip=${skip}&search=${search.trim()}`
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
    queryKey: ["buyerOrders", page, search, authUser?._id],
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
                    Placed Orders
                  </h1>
                  <p className="text-sm 2xl:text-xl text-zinc-400">
                    View and manage orders you have placed
                  </p>
                  <input
                    type="text"
                    placeholder="By Id, Name or Game Username"
                    onChange={(e) => debouncedSetSearch(e.target.value)}
                    className="px-3 py-2.5 md:py-2 2xl:py-3 outline-none text-sm 2xl:text-lg rounded-md w-full lg:w-1/3 mt-2 bg-dry"
                  />
                  <OrdersTable
                    authUser={authUser}
                    items={data?.orders}
                    totalCars={data?.total}
                    page={page}
                    setPage={setPage}
                    USERS_PER_PAGE={USERS_PER_PAGE}
                    loading={isLoading}
                    location={"history"}
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

export default History;
