import React from "react";
import { Carousel } from "@mantine/carousel";
import { FaBitcoin, FaHeart, FaRegCreditCard } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import CountFormatter from "../../utils/formatNumber";
import LimitedModal from "../../utils/LimitedModal";

const Hero = () => {
  const { data: sliders, isLoading: allBannersLoading } = useQuery({
    queryKey: ["all_banners"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/rumman/v1/utils/get-all-banner`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "An unknown error occurred");
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
  });

  return (
    <div className=" w-full  text-dryGray bg-main ">
      <div className=" container mx-auto px-2 py-5">
        <div className=" w-full h-full">
          <Carousel
            withIndicators
            loop
            className="h-[30vh] sm:h-[40vh] md:h-80 rounded-md overflow-hidden bg-dry"
          >
            {sliders?.map((slider) => (
              <Carousel.Slide key={slider?._id}>
                <div className=" relative w-full h-[30vh] sm:h-[40vh] md:h-80 px-2 flex justify-between">
                  <div className=" hidden md:flex">
                    {/* trending card */}
                    <div className=" md:h-52 2xl:h-56 flex flex-col -mt-5 border-transparent w-40 md:w-64 bg-gradient-to-t to-slate-400 from-[#FFD93D]  rounded-3xl shadow-lg ml-10 lg:ml-[10%] 2xl:ml-[17%]">
                      <div className="  2xl:h-5" />
                      <div className="  w-full px-3 pt-2 flex items-center justify-center flex-grow">
                        <div className=" flex flex-col items-center">
                          <div className="md:w-20  2xl:w-20">
                            <img
                              src="/images/coupon.webp"
                              className=" w-full h-full object-cover"
                              alt=""
                            />
                          </div>
                          <h1 className=" 2xl:text-xl font-semibold text-zinc-800">
                            Featured
                          </h1>
                        </div>
                      </div>
                    </div>
                    {/* trending card end */}
                    {/* trending card */}
                    <div className="md:h-52 2xl:h-56 flex flex-col -mt-5 w-40 md:w-64 bg-gradient-to-t  from-subMain to-slate-400 rounded-3xl shadow-lg ml-10 md:ml-5">
                      <div className="  2xl:h-5" />
                      <div className="  w-full px-3 pt-2 flex items-center justify-center flex-grow">
                        <div className=" flex flex-col items-center">
                          <div className=" md:w-20 2xl:w-20 -mt-3">
                            <img
                              src="/images/increase.webp"
                              className=" w-full h-full object-contain mb-2"
                              alt=""
                            />
                          </div>
                          <h1 className=" 2xl:text-xl font-semibold text-zinc-100">
                            Trending
                          </h1>
                        </div>
                      </div>
                    </div>
                    {/* trending card end */}

                    {/* limited card */}
                    <div className="md:h-52 2xl:h-56 flex flex-col border -mt-5 hover:border-zinc-800 border-transparent w-40 md:w-64 bg-[#222] rounded-3xl shadow-lg ml-10 md:ml-5">
                      <div className=" flex-grow" />
                      <div
                        onClick={() =>
                          document.getElementById(`${slider?._id}`).showModal()
                        }
                        className=" cursor-pointer w-full px-3 pt-2"
                      >
                        <div className="">
                          <h1 className=" text-text text-xl 2xl:text-[25px] text-center font-medium">
                            {slider?.name}
                          </h1>
                        </div>

                        <div className=" flex items-center pt-4 pb-2 gap-2">
                          <div className=" w-full flex items-center justify-center flex-col">
                            <h1 className=" leading-4 text-text text-lg 2xl:text-xl text-center font-medium">
                              RAP
                            </h1>
                            <h1 className=" text-subMain text-lg 2xl:text-2xl text-center font-medium">
                              <CountFormatter value={slider?.rap} />
                            </h1>
                          </div>
                          <div className=" w-full flex items-center justify-center flex-col">
                            <h1 className=" leading-4 text-text text-lg 2xl:text-xl text-center font-medium">
                              Price
                            </h1>
                            <h1 className=" text-subMain text-lg 2xl:text-2xl text-center font-medium">
                              ${slider?.price}
                            </h1>
                          </div>
                        </div>

                        <div className=" w-full px-6 2xl:px-4 pb-6">
                          <button className=" text-dry font-semibold w-full flex items-center justify-center h-8 bg-gradient-to-b from-slate-300 to-subMain rounded-lg">
                            Buy now
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* limited card end */}
                  </div>

                  {/* for small screen  */}
                  <div className=" w-full h-[30vh] sm:h-[40vh] md:h-80 px-2 md:hidden flex justify-between">
                    <div className=" w-1/2 flex flex-col justify-center pl-5">
                      <div className=" w-full">
                        <h1 className=" whitespace-nowrap w-40 truncate text-text text-xl 2xl:text-[25px] text-center font-medium">
                          {slider?.name}
                        </h1>
                      </div>

                      <div className=" flex items-center pt-4 pb-2 gap-2">
                        <div className=" w-full flex items-center justify-center flex-col">
                          <h1 className=" leading-4 text-text text-lg 2xl:text-xl text-center font-medium">
                            RAP
                          </h1>
                          <h1 className=" text-subMain text-lg 2xl:text-2xl text-center font-medium">
                            <CountFormatter value={slider?.rap} />
                          </h1>
                        </div>
                        <div className=" w-full flex items-center justify-center flex-col">
                          <h1 className=" leading-4 text-text text-lg 2xl:text-xl text-center font-medium">
                            Price
                          </h1>
                          <h1 className=" text-subMain text-lg 2xl:text-2xl text-center font-medium">
                            ${slider?.price}
                          </h1>
                        </div>
                      </div>

                      <div
                        onClick={() =>
                          document.getElementById(`${slider?._id}`).showModal()
                        }
                        className=" w-full px-3 pb-6"
                      >
                        <button className=" text-dry font-semibold w-full flex items-center justify-center h-8 bg-gradient-to-b from-slate-300 to-subMain rounded-lg">
                          Buy now
                        </button>
                      </div>
                    </div>
                    <div className=" w-1/2 relative">
                      <div className=" absolute  top-[40%] -translate-y-1/2 right-8 md:right-24 2xl:right-40 w-28 h-28 md:w-60 md:h-40 bg-white bg-opacity-20 rounded-full blur-3xl"></div>
                      <div className=" mt-[8%]  mr-5 flex items-center justify-center h-40 w-40 md:w-72 md:h-72 ">
                        <img
                          src={slider?.image}
                          alt=""
                          className=" w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                  {/* for small screen end  */}

                  <LimitedModal limited={slider} />

                  <div className=" hidden md:block absolute  top-[50%] -translate-y-1/2 right-8 md:right-24 2xl:right-40 w-28 h-28 md:w-60 md:h-40 bg-white bg-opacity-20 rounded-full blur-3xl"></div>
                  <div className="hidden md:flex  top-[50%] translate-y-1/3 md:-translate-y-0 mr-5 md:mr-24 2xl:mr-40   items-center justify-center h-40 w-40 md:w-72 md:h-72 ">
                    <img
                      src={slider?.image}
                      alt=""
                      className=" w-full h-full object-contain"
                    />
                  </div>
                </div>
              </Carousel.Slide>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Hero;
