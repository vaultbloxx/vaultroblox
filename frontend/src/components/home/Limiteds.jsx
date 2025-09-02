import React, { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import LimitedCard from "../utils/LimitedCard";
import { IoSearch } from "react-icons/io5";
import FilterSidebar from "../layout/FilterSidebar";
import axios from "axios";
import { debounce } from "lodash";
import Loader from "../utils/Loader";
import { useFilters } from "../../context/FiltersContext";
import LimitedModal from "../utils/LimitedModal";

const fetchLimiteds = async ({ pageParam = 0, queryKey }) => {
  const [_key, filters] = queryKey;

  // Avoid sending empty values in the request
  const params = {
    skip: pageParam,
    min: filters.minPrice || undefined, // Don't send if empty
    max: filters.maxPrice || undefined,
    sort: filters.sort !== "default" ? filters.sort : undefined,
    search: filters.search || undefined,
  };

  const { data } = await axios.get(`/api/rumman/v1/utils/get-limiteds`, {
    params,
  });
  return data;
};

const Limiteds = () => {
  const { filters, setFilters } = useFilters();
  const observer = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLimited, setSelectedLimited] = useState(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["limiteds", filters],
    queryFn: fetchLimiteds,
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === 10 ? pages.length * 10 : undefined,
  });

  useEffect(() => {
    refetch();
  }, [filters, refetch]);

  const lastLimitedRef = (node) => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    if (node) observer.current.observe(node);
  };

  const handleSearch = debounce((value) => {
    setFilters((prev) => ({ ...prev, search: value }));
  }, 500);

  return (
    <div className="bg-main py-10">
      <div className="container mx-auto px-2 md:px-1">
        <h1 className=" text-center text-4xl font-bold mb-4 block lg:hidden">
          Explore
        </h1>
        <div className="lg:grid grid-cols-12 gap-3">
          {/* sidebar */}
          <div className="col-span-3 p-2 relative">
            <FilterSidebar
              classes="hidden lg:block"
              modalId="filter_big_screen"
              taxModalId="tax_big_screen"
              urlModalId="url_big_screen"
              summaryModalId="summary_big_screen"
              setFilters={setFilters}
            />
          </div>

          {/* all limiteds */}
          <div className="col-span-9 relative">
            <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3">
              <div className="w-full col-span-2 md:col-span-3 2xl:col-span-4">
                <div className=" w-full lg:w-max lg:float-end">
                  {/* search bar */}
                  <form
                    className="flex items-center w-full"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <input
                      type="text"
                      placeholder="Search limited here"
                      className="px-3 h-10 2xl:h-12 outline-none text-sm 2xl:text-lg  rounded-l-md w-full md:w-[265px] 2xl:w-[350px] bg-dry text-text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handleSearch(e.target.value);
                      }}
                    />
                    <button className="px-3 h-10 2xl:h-12 w-10 2xl:w-14 rounded-r-md bg-subMain text-dry flex items-center justify-center">
                      <IoSearch className=" text-white size-6 " />
                    </button>
                  </form>
                </div>
              </div>
              {isLoading ? (
                <div className=" absolute inset-0 mt-20 w-full h-60 flex items-center justify-center">
                  <Loader />
                </div>
              ) : (
                <>
                  {data?.pages.map((page, pageIndex) =>
                    page.map((limited, index) => {
                      if (
                        pageIndex === data.pages.length - 1 &&
                        index === page.length - 1
                      ) {
                        return (
                          <LimitedCard
                            key={limited?._id}
                            setSelectedLimited={setSelectedLimited}
                            limited={limited}
                            ref={lastLimitedRef}
                          />
                        );
                      }
                      return (
                        <LimitedCard
                          key={limited?._id}
                          limited={limited}
                          setSelectedLimited={setSelectedLimited}
                        />
                      );
                    })
                  )}
                  {isFetchingNextPage && (
                    <p className="text-center text-white">Loading more...</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {selectedLimited && <LimitedModal limited={selectedLimited} />}
    </div>
  );
};

export default Limiteds;
