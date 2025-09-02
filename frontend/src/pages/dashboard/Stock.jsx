import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import DashSidebar from "../../components/layout/DashSidebar";
import { FaBitcoin, FaRegCreditCard } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ErrorResponseModal from "../../components/utils/ErrorResponseModal";
import Loader from "../../components/utils/Loader";
import { FiltersProvider } from "../../context/FiltersContext";

function Stock() {
  const [formData, setFormData] = useState({
    first: "",
    second: "",
    third: "",
    four: "",
    firstR: "",
    secondR: "",
    thirdR: "",
    fourR: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [robux, setRobux] = useState("");
  const queryClient = useQueryClient();
  const {
    mutate: updateRobux,
    isPending: updateRobuxPending,
    error: updateRobuxError,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/rumman/v1/admin/update-robux", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ robux }),
        });
      } catch (error) {
        throw error;
      }
    },
    onError: () => {
      document.getElementById("updateRobuxError").showModal();
    },
    onSuccess: () => {
      setRobux("");
      queryClient.invalidateQueries({ queryKey: ["robuxPrice"] });
    },
  });

  const { data: robuxPrice, isLoading: robuxPriceLoading } = useQuery({
    queryKey: ["robuxPrice"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/rumman/v1/utils/get-robux");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "An unknown error occurred");
        }
        return data;
      } catch (error) {
        logger.error(error);
        throw error;
      }
    },
  });

  const {
    mutate: updateRobuxPrice,
    isPending: updateRobuxPricePending,
    error: updateRobuxPriceError,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/rumman/v1/admin/update-robux-price", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
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
    onError: () => {
      document.getElementById("updateRobuxPriceError").showModal();
    },
    onSuccess: () => {
      setFormData({
        first: "",
        second: "",
        third: "",
        four: "",
        firstR: "",
        secondR: "",
        thirdR: "",
        fourR: "",
      });
      queryClient.invalidateQueries({ queryKey: ["robuxPrice"] });
    },
  });

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
                <div className="w-full">
                  <h1 className="text-lg font-medium text-zinc-200">
                    Robux Stock
                  </h1>
                  <p className="text-sm text-zinc-400">Manage Robux stock</p>
                </div>
                <div className=" flex flex-col items-center justify-center">
                  <div className=" mt-10 w-80 flex items-center justify-between gap-2">
                    <div className=" flex items-center gap-1">
                      <span className=" text-xl font-extrabold text-dryGray">
                        Stock
                      </span>
                      <div className=" w-5 h-5">
                        <img
                          src="/images/robux-green.png"
                          alt=""
                          className=" w-full h-full object-contain"
                        />
                      </div>
                      {robuxPriceLoading ? (
                        <Loader />
                      ) : (
                        <span className=" text-xl ml-1 text-subMain">
                          {robuxPrice?.robux}
                        </span>
                      )}
                    </div>
                    <div className="  px-3 py-[5px] rounded-full bg-zinc-800">
                      <div className=" flex items-center gap-2  ">
                        <FaRegCreditCard className=" w-4 h-4 text-subMain" />
                        <FaBitcoin className=" w-4 h-4 text-subMain" />
                      </div>
                    </div>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateRobux();
                    }}
                    className=" w-80 mt-4"
                  >
                    <input
                      type="text"
                      placeholder="e.g. 50K +"
                      value={robux}
                      onChange={(e) => setRobux(e.target.value)}
                      className="w-full rounded-md bg-dry px-2 py-1 border border-zinc-600 outline-none focus:border-zinc-400"
                    />
                    <button
                      disabled={updateRobuxPending || robux === ""}
                      className={`${
                        (updateRobuxPending || robux === "") &&
                        "cursor-not-allowed"
                      } w-full mt-3 py-1 bg-subMain hover:bg-subMain/90 transition rounded-md font-medium`}
                    >
                      {updateRobuxPending ? "Updating..." : "Update"}
                    </button>
                    <ErrorResponseModal
                      id={"updateRobuxError"}
                      message={updateRobuxError?.message}
                    />
                  </form>
                </div>
                <div className="w-full mt-10">
                  <h1 className="text-lg font-medium text-zinc-200">Price</h1>
                  <p className="text-sm text-zinc-400">Manage Robux price</p>
                </div>

                {/* placeholder start */}

                <div className=" mt-5 flex items-center justify-center">
                  <div className=" w-full ">
                    <div className=" flex items-center p-2 bg-dry rounded-2xl">
                      <div className=" md:w-2/3 p-2">
                        <h1 className=" text-zinc-200 text-2xl font-extrabold font-movie">
                          BUY ROBUX
                        </h1>
                        <p className=" py-4 text-sm text-zinc-300">
                          <span className=" font-normal">
                            Note: Buying Robux from our website is safe and
                            secure. We use industry-standard encryption to
                            protect your personal and payment information.
                            Additionally, we have a strict no-refund policy, so
                            make sure you are purchasing the correct amount of
                            Robux for your needs.
                          </span>
                        </p>

                        <div className=" w-full py-2">
                          <div className=" grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div className=" bg-black/60 rounded-md py-4 p-1 flex flex-col items-center justify-center">
                              <h1 className=" text-sm tracking-wide font-bold text-zinc-200 font-movie">
                                {robuxPrice?.first}$
                              </h1>
                              <span className=" font-medium text-sm">
                                {robuxPrice?.firstR} R$
                              </span>
                            </div>
                            <div className=" bg-black/60 rounded-md py-4 p-1 flex flex-col items-center justify-center">
                              <h1 className=" text-sm tracking-wide font-bold text-zinc-200 font-movie">
                                {robuxPrice?.second}$
                              </h1>
                              <span className=" font-medium text-sm">
                                {robuxPrice?.secondR} R$
                              </span>
                            </div>
                            <div className=" bg-black/60 rounded-md py-4 p-1 flex flex-col items-center justify-center">
                              <h1 className=" text-sm tracking-wide font-bold text-zinc-200 font-movie">
                                {robuxPrice?.third}$
                              </h1>
                              <span className=" font-medium text-sm">
                                {robuxPrice?.thirdR} R$
                              </span>
                            </div>
                            <div className=" bg-black/60 rounded-md py-4 p-1 flex flex-col items-center justify-center">
                              <h1 className=" text-sm tracking-wide font-bold text-zinc-200 font-movie">
                                {robuxPrice?.four}$
                              </h1>
                              <span className=" font-medium text-sm">
                                {robuxPrice?.fourR} R$
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="w-full">
                          <button
                            onClick={() =>
                              document
                                .getElementById("updateRobuxPriceModal")
                                .showModal()
                            }
                            className=" shadow-lg w-max flex items-center gap-2 px-6 py-2.5 rounded-full mt-2 bg-zinc-800"
                          >
                            <span className=" text-sm to-dry font-medium">
                              UPDATE
                            </span>
                            <div className=" w-5 h-5">
                              <img
                                src="/images/robux-green.png"
                                alt="buy robux"
                                className=" w-full h-full object-contain"
                              />
                            </div>
                          </button>
                        </div>
                      </div>
                      <div className=" md:w-1/3 p-3">
                        <img
                          src="/images/robux.webp"
                          alt=""
                          className=" w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* placeholder end */}

                {/* update modal */}

                <dialog id="updateRobuxPriceModal" className="modal">
                  <div className="modal-box max-w-3xl z-50 bg-[#1f1f1f] text-dryGray">
                    <div className=" mt-5 flex items-center justify-center">
                      <div className=" w-full ">
                        <div className=" flex items-center p-2 rounded-2xl">
                          <div className=" md:w-2/3 p-2">
                            <h1 className=" text-zinc-200 text-2xl font-extrabold font-movie">
                              BUY ROBUX
                            </h1>
                            <p className=" py-4 text-sm text-zinc-300">
                              <span className=" font-normal">
                                Note: Buying Robux from our website is safe and
                                secure. We use industry-standard encryption to
                                protect your personal and payment information.
                                Additionally, we have a strict no-refund policy,
                                so make sure you are purchasing the correct
                                amount of Robux for your needs.
                              </span>
                            </p>

                            <div className=" w-full py-2">
                              {robuxPriceLoading ? (
                                <Loader />
                              ) : (
                                <div className=" grid grid-cols-2 md:grid-cols-4 gap-2">
                                  <div className=" bg-black/60 rounded-md py-4 p-1 flex flex-col items-center justify-center">
                                    <div className=" flex items-center gap-1">
                                      <input
                                        type="text"
                                        placeholder={robuxPrice?.first}
                                        value={formData.first}
                                        name="first"
                                        onChange={handleInputChange}
                                        className=" w-full bg-dry border border-zinc-800 py-1 px-1.5 text-text outline-none text-sm rounded-md"
                                      />
                                      $
                                    </div>
                                    <div className=" flex items-center gap-1">
                                      <input
                                        type="text"
                                        placeholder={robuxPrice?.firstR}
                                        value={formData.firstR}
                                        name="firstR"
                                        onChange={handleInputChange}
                                        className=" w-full mt-1 bg-dry border border-zinc-800 py-1 px-1.5 text-text outline-none text-sm rounded-md"
                                      />
                                      R$
                                    </div>
                                  </div>
                                  <div className=" bg-black/60 rounded-md py-4 p-1 flex flex-col items-center justify-center">
                                    <div className=" flex items-center gap-1">
                                      <input
                                        type="text"
                                        placeholder={robuxPrice?.second}
                                        value={formData.second}
                                        name="second"
                                        onChange={handleInputChange}
                                        className=" w-full bg-dry border border-zinc-800 py-1 px-1.5 text-text outline-none text-sm rounded-md"
                                      />
                                      $
                                    </div>
                                    <div className=" flex items-center gap-1">
                                      <input
                                        type="text"
                                        placeholder={robuxPrice?.secondR}
                                        value={formData.secondR}
                                        name="secondR"
                                        onChange={handleInputChange}
                                        className=" w-full mt-1 bg-dry border border-zinc-800 py-1 px-1.5 text-text outline-none text-sm rounded-md"
                                      />
                                      R$
                                    </div>
                                  </div>
                                  <div className=" bg-black/60 rounded-md py-4 p-1 flex flex-col items-center justify-center">
                                    <div className=" flex items-center gap-1">
                                      <input
                                        type="text"
                                        placeholder={robuxPrice?.third}
                                        value={formData.third}
                                        name="third"
                                        onChange={handleInputChange}
                                        className=" w-full bg-dry border border-zinc-800 py-1 px-1.5 text-text outline-none text-sm rounded-md"
                                      />
                                      $
                                    </div>
                                    <div className=" flex items-center gap-1">
                                      <input
                                        type="text"
                                        placeholder={robuxPrice?.thirdR}
                                        value={formData.thirdR}
                                        name="thirdR"
                                        onChange={handleInputChange}
                                        className=" w-full mt-1 bg-dry border border-zinc-800 py-1 px-1.5 text-text outline-none text-sm rounded-md"
                                      />
                                      R$
                                    </div>
                                  </div>
                                  <div className=" bg-black/60 rounded-md py-4 p-1 flex flex-col items-center justify-center">
                                    <div className=" flex items-center gap-1">
                                      <input
                                        type="text"
                                        placeholder={robuxPrice?.four}
                                        value={formData.four}
                                        name="four"
                                        onChange={handleInputChange}
                                        className=" w-full bg-dry border border-zinc-800 py-1 px-1.5 text-text outline-none text-sm rounded-md"
                                      />
                                      $
                                    </div>
                                    <div className=" flex items-center gap-1">
                                      <input
                                        type="text"
                                        placeholder={robuxPrice?.fourR}
                                        value={formData.fourR}
                                        name="fourR"
                                        onChange={handleInputChange}
                                        className=" w-full mt-1 bg-dry border border-zinc-800 py-1 px-1.5 text-text outline-none text-sm rounded-md"
                                      />
                                      R$
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="w-full">
                              <button
                                onClick={() => updateRobuxPrice()}
                                className=" shadow-lg w-max flex items-center gap-2 px-6 py-2.5 rounded-full mt-2 bg-zinc-800"
                              >
                                <span className=" text-sm to-dry font-medium">
                                  {updateRobuxPricePending
                                    ? "Updating..."
                                    : "UPDATE"}
                                </span>
                                <div className=" w-5 h-5">
                                  <img
                                    src="/images/robux-green.png"
                                    alt="buy robux"
                                    className=" w-full h-full object-contain"
                                  />
                                </div>
                              </button>
                            </div>
                          </div>
                          <div className=" md:w-1/3 p-3">
                            <img
                              src="/images/robux.webp"
                              alt=""
                              className=" w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                  </form>
                </dialog>
                {/* update modal end */}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </FiltersProvider>
  );
}

export default Stock;
