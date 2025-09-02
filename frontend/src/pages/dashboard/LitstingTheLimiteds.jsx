import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import DashSidebar from "../../components/layout/DashSidebar";
import { FaBitcoin, FaRegCreditCard } from "react-icons/fa6";
import CountFormatter from "../../components/utils/formatNumber";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Loader from "../../components/utils/Loader";
import ErrorResponseModal from "../../components/utils/ErrorResponseModal";
import SuccessResponseModal from "../../components/utils/SuccessResponseModal";
import { FiltersProvider } from "../../context/FiltersContext";

function LitstingTheLimiteds() {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [selectedItem, setSelectedItem] = useState({
    assetId: "",
    name: "",
    rap: "",
    price: "",
    image: "",
  });

  const openModal = (item) => {
    setSelectedItem({
      assetId: item?.assetId,
      name: item?.name,
      rap: item?.rap,
      price: item?.price,
      image: item?.imageUrl,
    });

    setTimeout(() => {
      const modal = document.getElementById(`modal-${item.assetId}`);
      modal.showModal(); // Open modal
    }, 100);
  };

  const closeModal = (assetId) => {
    setSelectedItem({
      name: "",
      rap: "",
      price: "",
      image: "",
    });

    setTimeout(() => {
      const modal = document.getElementById(`modal-${assetId}`);
      modal.close(); // Close modal after animation
    }, 100);
  };

  const { playerId } = useParams();

  //---------------------get invertory---------------------//

  const {
    data: limiteds,
    isLoading: limitedsLoading,
    isError: isLimitedsError,
    error: limitedsError,
  } = useQuery({
    queryKey: ["inventory", playerId],
    queryFn: async () => {
      try {
        const res = await fetch(
          `/api/rumman/v1/seller/get-inventory/${playerId}`
        );
        const data = await res.json();
        if (!res.ok) {
          console.log(data.error || "An unknown error occurred");
          throw new Error(data.error || "An unknown error occurred");
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
    retry: false,
  });

  //---------------------get invertory end---------------------//

  const {
    mutate: listLimited,
    isPending: listLimitedPending,
    error: listLimitedError,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(
          `/api/rumman/v1/seller/list-limited/${playerId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(selectedItem),
          }
        );
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
      document.getElementById("list_limited_success_modal").showModal();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    },
    onError: () => {
      document.getElementById("list_limited_error_modal").showModal();
    },
  });

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
                <div className=" w-full p-5 bg-dry rounded-md">
                  <div className="  flex items-center gap-4 justify-between">
                    <div>
                      <h1 className=" text-lg 2xl:text-2xl font-medium text-zinc-200">
                        List Limited
                      </h1>
                      <p className=" text-sm 2xl:text-xl text-zinc-400">
                        List your limiteds to sell on our marketplace.
                      </p>
                    </div>
                  </div>

                  {/* limiteds start */}
                  {limitedsLoading ? (
                    <div className=" mt-5 h-64 flex items-center justify-center">
                      <Loader />
                    </div>
                  ) : isLimitedsError ? (
                    <div className=" mt-5 h-64 flex items-center justify-center text-zinc-400">
                      {limitedsError?.message}
                    </div>
                  ) : limiteds?.length === 0 ? (
                    <div className=" mt-5 h-64 flex items-center justify-center text-zinc-400">
                      Sorry no limiteds found
                    </div>
                  ) : (
                    <div className="mt-5">
                      {limiteds?.map((limited) => (
                        <div key={limited?.assetId}>
                          <div
                            className="w-full py-2 px-5 rounded-md bg-lightDark mb-3 border border-transparent hover:border-zinc-500 cursor-pointer"
                            onClick={() => {
                              openModal(limited);
                            }}
                          >
                            <div className="flex gap-4 items-center">
                              <div className="w-20 h-20 rounded-md overflow-hidden">
                                <img
                                  src={limited?.imageUrl}
                                  alt={limited?.name}
                                  title={limited?.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <h1 className="text-lg font-medium">
                                  {limited?.name}
                                </h1>
                                <div className="flex items-center gap-3">
                                  <h1>
                                    <span className="font-medium">RAP:</span>{" "}
                                    <span className="text-subMain">
                                      {limited?.rap}
                                    </span>
                                  </h1>
                                  <h1>
                                    <span className="font-medium">Value:</span>{" "}
                                    <span className="text-subMain">
                                      {limited?.defaultValue} R$
                                    </span>
                                  </h1>
                                </div>
                              </div>
                            </div>
                          </div>

                          <ErrorResponseModal
                            id={"list_limited_error_modal"}
                            message={listLimitedError?.message}
                          />

                          <SuccessResponseModal
                            id={"list_limited_success_modal"}
                            message={"Listed successfully"}
                          />

                          {/* Modal for this item */}
                          <dialog
                            id={`modal-${limited?.assetId}`}
                            className=" rounded-md bg-dry shadow-2xl text-center"
                          >
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                              }}
                            >
                              {/* limited card start */}
                              <div className=" w-full bg-dry rounded-md mt-3">
                                <div className="  w-96 px-3 ">
                                  <div className=" float-end px-3 py-1.5 rounded-full bg-zinc-800">
                                    <div className=" flex items-center gap-2  ">
                                      <FaRegCreditCard className=" w-4 h-4 text-subMain" />
                                      <FaBitcoin className=" w-4 h-4 text-subMain" />
                                    </div>
                                  </div>
                                  <div className=" w-full h-40  flex items-center justify-center">
                                    <img
                                      src={limited?.imageUrl}
                                      alt={limited?.name}
                                      title={limited?.name}
                                      className=" w-full h-full object-contain"
                                    />
                                  </div>

                                  <div className=" mt-1">
                                    <h1 className=" text-text text-lg text-center font-medium">
                                      {limited?.name}
                                    </h1>
                                  </div>

                                  <div className=" flex items-center py-4 gap-2">
                                    <div className=" w-full flex items-center justify-center flex-col">
                                      <h1 className=" leading-4 text-text text-lg text-center font-medium">
                                        RAP
                                      </h1>
                                      <h1 className=" text-subMain text-lg text-center font-medium">
                                        <CountFormatter value={limited?.rap} />
                                      </h1>
                                    </div>
                                    <div className=" w-full flex items-center justify-center flex-col">
                                      <h1 className=" leading-4 text-text text-lg text-center font-medium">
                                        Price
                                      </h1>
                                      <div className=" text-subMain text-lg mt-1 gap-2 text-center font-medium flex items-center ">
                                        <input
                                          type="number"
                                          step="1"
                                          min="0"
                                          placeholder="0"
                                          className=" w-24 text-sm h-9 md:h-10 2xl:h-12 rounded-md font-light px-2 bg-main text-text border border-zinc-700 outline-none  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                          inputMode="numeric"
                                          pattern="[0-9]*"
                                          title="Only numbers are allowed"
                                          value={selectedItem?.price ?? ""} // ensures it's never undefined
                                          onChange={(e) => {
                                            setSelectedItem((prev) => ({
                                              ...prev,
                                              price: e.target.value,
                                            }));
                                          }}
                                        />
                                        <span>$</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* limited card end */}
                              <div className=" flex items-center gap-3 float-end px-3 pb-4">
                                <button
                                  disabled={
                                    listLimitedPending ||
                                    selectedItem?.name === "" ||
                                    selectedItem?.price === "" ||
                                    selectedItem?.rap === "" ||
                                    selectedItem?.image === ""
                                  }
                                  onClick={() => {
                                    console.log(selectedItem);
                                    listLimited();
                                  }}
                                  className=" bg-subMain text-white py-2 px-4 rounded-md hover:bg-subMain/90"
                                >
                                  {listLimitedPending
                                    ? "Uploading..."
                                    : "Upload"}
                                </button>

                                <div
                                  onClick={() => {
                                    closeModal(limited?.assetId);
                                  }}
                                  className=" cursor-pointer bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                                >
                                  Close
                                </div>
                              </div>
                            </form>
                          </dialog>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* limiteds end */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </FiltersProvider>
  );
}

export default LitstingTheLimiteds;
