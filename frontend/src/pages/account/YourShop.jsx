import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import { FaUserSecret } from "react-icons/fa";
import { VscVerifiedFilled } from "react-icons/vsc";
import { IoSearch } from "react-icons/io5";
import LimitedCard from "../../components/utils/LimitedCard";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/utils/Loader";
import { FiltersProvider } from "../../context/FiltersContext";
import LimitedModal from "../../components/utils/LimitedModal";

const YourShop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { username } = useParams();
  const [selectedLimited, setSelectedLimited] = useState(null);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const { data: limiteds, isLoading } = useQuery({
    queryKey: ["shopLimiteds", username],
    queryFn: async () => {
      try {
        const res = await fetch(
          `/api/rumman/v1/utils/get-shop-limiteds/${username}`
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error);
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
    retry: false,
  });
  const { data: shopOwner, isLoadingShopOwner } = useQuery({
    queryKey: ["shopOwner", username],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/rumman/v1/utils/get-shop/${username}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error);
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
    retry: false,
  });

  const filteredLimiteds = limiteds?.filter((limited) =>
    limited.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <FiltersProvider>
      <Layout>
        <div className="pt-10 md:pt-16 pb-20 lg:pb-0 bg-main min-h-screen text-dryGray ">
          <div className="container mx-auto px-2 mt-5">
            <div className="w-full bg-dry h-48 rounded-md overflow-hidden">
              <img
                src="https://4kwallpapers.com/images/wallpapers/roblox-character-3840x2160-20149.jpg"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-4 -mt-12 md:px-10">
              <div className="w-40 h-40 rounded-full bg-dry border-4 border-main flex items-center justify-center">
                <FaUserSecret className="w-20 h-20 text-subMain" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{shopOwner?.username}</span>
                {shopOwner?.verified && (
                  <div
                    className="tooltip tooltip-accent tooltip-right"
                    data-tip="Trusted Seller"
                  >
                    <VscVerifiedFilled className="text-[#ECBE07] w-5 h-5" />
                  </div>
                )}
              </div>
            </div>

            <div className="py-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 relative">
              <div className="w-full col-span-2 md:col-span-3 lg:col-span-4">
                <div className="float-end w-full md:w-max">
                  {/* search bar  */}
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex items-center w-full"
                  >
                    <input
                      type="text"
                      disabled={limiteds?.length === 0}
                      placeholder="Search limited here"
                      className="px-3 h-10 2xl:h-12 outline-none text-sm md:text-base 2xl:text-lg rounded-l-md w-full md:w-[265px] bg-dry text-text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    <button className="px-3 h-10 2xl:h-12 rounded-r-md bg-subMain text-dry flex items-center justify-center">
                      <IoSearch className=" size-5 2xl:size-6 text-white" />
                    </button>
                  </form>
                </div>
              </div>
              {isLoading ? (
                <div className=" absolute inset-0 mt-20 h-40 w-full flex items-center justify-center">
                  <Loader />
                </div>
              ) : limiteds?.length === 0 ? (
                <div className=" absolute inset-0 mt-20 h-40 w-full flex items-center justify-center">
                  <p className="text-zinc-400">No limiteds found</p>
                </div>
              ) : (
                filteredLimiteds.map((limited) => (
                  <LimitedCard
                    key={limited._id}
                    setSelectedLimited={setSelectedLimited}
                    limited={limited}
                  />
                ))
              )}
            </div>
            {selectedLimited && <LimitedModal limited={selectedLimited} />}
          </div>
        </div>
      </Layout>
    </FiltersProvider>
  );
};

export default YourShop;
