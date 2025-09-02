import React, { useCallback, useState } from "react";
import Layout from "../../components/layout/Layout";
import DashSidebar from "../../components/layout/DashSidebar";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import LimitedsTable from "../../components/dashboard/LimitedsTable";
import { FiltersProvider } from "../../context/FiltersContext";

function AllLimiteds() {
  const USERS_PER_PAGE = 10;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  //----------------------get all users start---------------------//
  const fetchLimiteds = async ({ queryKey }) => {
    const [, page, search] = queryKey;
    const skip = (page - 1) * USERS_PER_PAGE;

    try {
      const res = await fetch(
        `/api/rumman/v1/admin/get-all-limiteds?skip=${skip}&search=${search.trim()}`
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

  const { data, isLoading } = useQuery({
    queryKey: ["allUsers", page, search],
    queryFn: fetchLimiteds,
    keepPreviousData: true,
  });
  //----------------------get all users end---------------------//

  const debouncedSetSearch = useCallback(debounce(setSearch, 500), []);

  return (
    <FiltersProvider>
      <Layout>
        <div className="pb-20  lg:pb-0 bg-main min-h-screen text-dryGray pt-10 lg:pt-16 ">
          <div className="container mx-auto px-2">
            <div className="md:grid grid-cols-12 gap-12 pt-10">
              <div className="col-span-3 relative  hidden lg:block">
                <DashSidebar />
              </div>
              <div className="col-span-9">
                <div className="w-full">
                  <h1 className="text-lg 2xl:text-2xl font-medium text-zinc-200">
                    Limiteds
                  </h1>
                  <p className="text-sm 2xl:text-lg text-zinc-400">
                    View & Manage all limiteds
                  </p>
                  <input
                    type="text"
                    placeholder="Search by Limited Id or Name"
                    onChange={(e) => debouncedSetSearch(e.target.value)}
                    className="px-3 py-2.5 md:py-2 2xl:py-3 outline-none text-sm 2xl:text-base  rounded-md w-full lg:w-1/3 mt-2 bg-dry"
                  />
                  <LimitedsTable
                    data={data?.limiteds}
                    totalCars={data?.totalLimiteds}
                    page={page}
                    setPage={setPage}
                    USERS_PER_PAGE={USERS_PER_PAGE}
                    isLoading={isLoading}
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

export default AllLimiteds;
