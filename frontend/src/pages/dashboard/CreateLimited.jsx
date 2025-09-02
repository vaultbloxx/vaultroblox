import React, { useEffect, useRef, useState } from "react";
import DashSidebar from "../../components/layout/DashSidebar";
import Layout from "../../components/layout/Layout";
import { FiltersProvider } from "../../context/FiltersContext";
import { useQueryClient } from "@tanstack/react-query";
import ErrorResponseModal from "../../components/utils/ErrorResponseModal";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa6";
import { useUtilsStore } from "../../store/useUtilsStore";
import toast from "react-hot-toast";
import Loader from "../../components/utils/Loader";

function CreateLimited() {
  const {
    getShops,
    shops,
    isGettingShopForLimitedUpload,
    createNewLimited,
    isCreatingNewLimited,

    getLimitedByAssetId,
    limited,
    isGettingLimited,
  } = useUtilsStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [searchLimited, setSearchLimited] = useState("");

  const [formData, setFormData] = useState({
    assetId: "",
    sellerId: "",
    name: "",
    rap: "",
    price: "",
    image: "",
  });

  const dropdownRef = useRef(null);

  // Fetch 10 users on mount
  useEffect(() => {
    const delay = setTimeout(() => {
      getShops();
    }, 2000);
    return () => clearTimeout(delay);
  }, [getShops]);

  // Search with debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      getShops(searchTerm);
    }, 700);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (user) => {
    setSelectedUser(user.username);
    setFormData({
      ...formData,
      sellerId: user?._id,
    });
    setIsOpen(false);
    setSearchTerm("");
  };

  const validateFormData = () => {
    if (!formData.sellerId.trim()) return toast.error("Please select shop");
    if (!formData.price.trim()) return toast.error("Price is required");
    if (!formData.rap.trim()) return toast.error("Rap is required");
    if (!formData.name.trim()) return toast.error("Name is required");

    return true;
  };

  const queryClient = useQueryClient();

  useEffect(() => {
    if (limited) {
      setFormData((prev) => ({
        ...prev,
        assetId: limited.assetId || "",
        name: limited.name || "",
        rap: limited.rap?.toString() || "",
        image: limited.image || "",
      }));
    }
  }, [limited]);

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
                    Create Limited
                  </h1>
                  <p className="text-sm 2xl:text-lg text-zinc-400">
                    Create limited with selecting shops.
                  </p>

                  <div className=" mt-5 2xl:mt-10 w-full flex items-center justify-center ">
                    <div className=" bg-dry rounded-lg p-6 w-[450px]">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const success = validateFormData();
                          if (success !== true) return;
                          createNewLimited({ ...formData });
                        }}
                      >
                        {/* Dropdown */}
                        <div className=" mb-3">
                          <div
                            className=" relative w-full max-w-full "
                            ref={dropdownRef}
                          >
                            <h3 className="text-base 2xl:text-lg font-light text-zinc-100 mb-1">
                              Choose shop
                            </h3>

                            {/* Dropdown Trigger */}
                            <div
                              className="border rounded-lg px-3 py-3 flex justify-between items-center border-border bg-dry cursor-pointer select-none w-full"
                              onClick={() => setIsOpen((prev) => !prev)}
                            >
                              <span className="truncate text-gray-100 text-base 2xl:text-lg">
                                {selectedUser || "Select shop"}
                              </span>
                              <FaChevronDown
                                className={`w-4 h-4 text-gray-100 transition-transform duration-200 ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              />
                            </div>

                            {/* Dropdown List */}
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: -6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -6 }}
                                  transition={{ duration: 0.2 }}
                                  className="absolute left-0 z-30 mt-2 w-full rounded-md border border-border bg-dry shadow-sm max-h-80 overflow-y-auto custom-scrollbar"
                                >
                                  {/* Search input */}
                                  <div className="p-2 border-b border-border sticky top-0 bg-dry">
                                    <input
                                      type="text"
                                      placeholder="Search user..."
                                      value={searchTerm}
                                      onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                      }
                                      className="w-full px-3 py-1.5 bg-transparent 2xl:py-2.5 border border-border rounded-md focus:outline-none text-sm 2xl:text-lg"
                                    />
                                  </div>

                                  {/* Option list */}
                                  {isGettingShopForLimitedUpload ? (
                                    <div className="p-4 text-gray-100">
                                      Loading...
                                    </div>
                                  ) : shops?.length > 0 ? (
                                    shops?.map((shop) => (
                                      <div
                                        key={shop?._id}
                                        onClick={() => handleSelect(shop)}
                                        className="px-4 text-base 2xl:text-lg py-2 hover:bg-lightDark cursor-pointer"
                                      >
                                        {shop?.username}
                                      </div>
                                    ))
                                  ) : (
                                    <div className="p-4 text-gray-100">
                                      No shops found.
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        {/* dropdown end  */}

                        <div>
                          <h3 className="text-base 2xl:text-lg font-light text-zinc-100 mb-1">
                            Search limited
                          </h3>
                          <input
                            type="text"
                            value={searchLimited}
                            onChange={(e) => setSearchLimited(e.target.value)}
                            className=" w-full h-10 px-3 rounded-md bg-transparent border border-border outline-none"
                          />
                          <button
                            type="button"
                            onClick={async () => {
                              if (!searchLimited.trim()) {
                                return toast.error("Please enter assetId");
                              }
                              await getLimitedByAssetId(searchLimited.trim());
                            }}
                            className=" bg-lightDark rounded-md mt-2 w-full h-10 flex items-center justify-center"
                          >
                            {isGettingLimited ? "Searching..." : "Search"}
                          </button>
                        </div>
                        {formData.image.length > 0 && (
                          <div className=" w-full py-3 px-3 bg-lightDark mt-3 rounded-md">
                            <div className=" grid grid-cols-12 gap-3">
                              <div className=" col-span-4">
                                <div className=" w-full h-20">
                                  <img
                                    src={formData.image}
                                    className=" w-full h-full object-contain"
                                    alt=""
                                  />
                                </div>
                              </div>
                              <div className=" col-span-8">
                                <h1 className=" text-lg 2xl:text-2xl font-medium break-all">
                                  {formData.name}
                                </h1>
                                <h1 className=" text-lg 2xl:text-2xl font-medium break-all">
                                  <span className=" text-subMain">RAP: </span>
                                  {formData.rap} R$
                                </h1>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className=" mt-3">
                          <h3 className="text-base 2xl:text-lg font-light text-zinc-100 mb-1">
                            Price
                          </h3>
                          <input
                            type="number"
                            value={formData.price}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                price: e.target.value,
                              })
                            }
                            className=" w-full h-10 px-3 rounded-md bg-transparent border border-border outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className={`${
                            (formData.name === "" || formData.price === "") &&
                            " cursor-not-allowed"
                          } flex items-center justify-center gap-2 mt-6 text-white font-medium w-full bg-subMain h-10 2xl:h-12 rounded-md`}
                        >
                          {isCreatingNewLimited ? (
                            <Loader />
                          ) : (
                            <div className=" flex items-center gap-2">
                              <p>Upload</p>
                              <MdOutlineFileUpload className=" w-5 h-5" />
                            </div>
                          )}
                        </button>

                        <ErrorResponseModal id={"create_limited_error_modal"} />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </FiltersProvider>
  );
}

export default CreateLimited;
