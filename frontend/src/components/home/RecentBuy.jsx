import React from "react";
import Title from "../utils/Title";
import { Carousel } from "@mantine/carousel";
import { useQuery } from "@tanstack/react-query";
import BuyRobux from "./BuyRobux";

const RecentBuy = () => {
  const { data: recentSold, isLoading: recentlySoldLoading } = useQuery({
    queryKey: ["recently_sold"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/rumman/v1/utils/get-recently-sold`);
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
    <div className=" bg-main pt-8 pb-5">
      <div className=" container mx-auto px-2">
        <Title title="RECENTLY SOLD" />
        <div className=" pt-4 px-2 md:px-0">
          <Carousel
            withControls={false}
            slideSize={{ base: "60%", sm: "22%", md: "18%", lg: "20%" }}
            slideGap={{ base: 5, sm: "md" }}
            align="start"
            className=" overflow-hidden"
          >
            {recentlySoldLoading ? (
              <>
                <div className="max-w-sm animate-pulse mr-8">
                  <div className="h-24 w-52 bg-dry rounded-md"></div>
                </div>
                <div className="max-w-sm animate-pulse mr-8">
                  <div className="h-24 w-52 bg-dry rounded-md"></div>
                </div>
                <div className="max-w-sm animate-pulse mr-8">
                  <div className="h-24 w-52 bg-dry rounded-md"></div>
                </div>
                <div className="max-w-sm animate-pulse mr-8">
                  <div className="h-24 w-52 bg-dry rounded-md"></div>
                </div>
                <div className="max-w-sm animate-pulse mr-8">
                  <div className="h-24 w-52 bg-dry rounded-md"></div>
                </div>
                <div className="max-w-sm animate-pulse mr-8">
                  <div className="h-24 w-52 bg-dry rounded-md"></div>
                </div>
              </>
            ) : (
              recentSold?.map((item) => (
                <Carousel.Slide key={item?._id}>
                  <div className="  shadow-lg rounded-md overflow-hidden h-24 2xl:h-28 w-full bg-dry">
                    <div className=" flex items-center gap-2 w-full h-full lg:pr-1">
                      <div className=" h-full w-1/3 pl-1 2xl:pl-2 flex items-center justify-center ">
                        <img
                          src={item?.image}
                          alt={item?.name}
                          title={item?.name}
                          className=" w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className=" ">
                          <h1 className=" text-dryGray text-[14px] lg:text-base 2xl:text-lg leading-0  font-medium leading-4">
                            {item?.name}
                          </h1>
                        </div>
                        <div className=" ">
                          <p className=" text-dryGray opacity-80 text-[13px] lg:text-sm 2xl:text-lg leading-0 font-light">
                            Sold for{" "}
                            <span className=" font-medium ">
                              ${parseFloat(item?.price).toFixed(2)}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Carousel.Slide>
              ))
            )}
          </Carousel>
        </div>

        <div className=" md:hidden">
          <div className=" mt-8">
            <BuyRobux
              modalId={"filter_small_screen"}
              taxModalId={"tax_small_screen"}
              urlModalId={"url_small_screen"}
              summaryModalId={"summary_small_screen"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentBuy;
