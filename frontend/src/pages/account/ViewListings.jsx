import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { IoSearch } from "react-icons/io5";
import Loader from "../../components/utils/Loader";
import Listing from "../../components/account/Listing";
import { FiltersProvider } from "../../context/FiltersContext";

function ViewListings() {
  const { accountId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  //--------------------------------view listings start
  const { data: listings, isLoading: isListingsLoading } = useQuery({
    queryKey: ["listings", accountId],
    queryFn: async () => {
      const res = await fetch(`/api/rumman/v1/seller/listings/${accountId}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      return data;
    },
    retry: false,
  });
  //--------------------------------view listings end

  const filteredListings = listings?.filter((listing) =>
    listing.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <FiltersProvider>
      <Layout>
        <div className="pt-10 md:pt-16 pb-20 lg:pb-0 min-h-screen text-dryGray ">
          <div className="container mx-auto px-2 mt-5">
            {/* topbars */}
            <div className=" flex-col-reverse md:flex-row flex items-end gap-2 justify-between">
              <div className=" w-full">
                <h1 className=" py-3 pt-10 text-xl md:text-2xl font-bold uppercase tracking-wide">
                  Listings of this account
                </h1>
                {/* search input  */}
                <div className=" md:w-2/6 w-full flex items-center">
                  <button className=" px-3 py-2.5 rounded-l-md bg-subMain text-dry flex items-center justify-center ">
                    <IoSearch />
                  </button>
                  <input
                    type="text"
                    placeholder="Search listings here"
                    className=" px-3 py-2 outline-none  text-sm rounded-r-md w-full lg:w-4/5 bg-dry "
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {/* listings  */}
            <div className=" mt-5">
              {isListingsLoading && (
                <div className=" w-full flex items-center justify-center h-52">
                  <Loader />
                </div>
              )}
              {!isListingsLoading &&
                (filteredListings?.length === 0 ? (
                  <div className=" w-full flex items-center justify-center">
                    <h1 className=" mt-5 md:mt-20 text-text opacity-30 text-2xl font-semibold">
                      No listings found
                    </h1>
                  </div>
                ) : (
                  <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredListings?.map((listing) => (
                      <Listing key={listing?._id} limited={listing} />
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Layout>
    </FiltersProvider>
  );
}

export default ViewListings;
