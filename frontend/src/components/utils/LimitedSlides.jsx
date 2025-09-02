import React from "react";
import { Carousel } from "@mantine/carousel";
import { Link } from "react-router-dom";

const LimitedSlides = ({ items }) => {
  return (
    <Carousel
      height={250}
      slideSize={{ base: "38%", sm: "22%", md: "18%" }}
      slideGap={{ base: 5, sm: "md" }}
      align="start"
      className=" overflow-hidden"
    >
      {items.map((item) => (
        <Carousel.Slide key={item?._id}>
          <Link to={`/limiteds/${item?._id}`}>
            <div className=" relative w-full h-full bg-dryBlue group rounded-sm">
              <div className=" flex items-center justify-center p-4 w-full h-4/5  md:h-full">
                <img
                  src={item?.image}
                  alt={item?.name}
                  className=" w-full h-full object-contain"
                />
              </div>
              <div className=" hidden md:block absolute bottom-0 left-0 right-0  transition-all duration-300 h-0 group-hover:h-1/3 bg-dryGray backdrop-blur-md bg-opacity-20">
                <div className=" flex items-start justify-between p-3 gap-1">
                  <p className=" text-dry font-medium leading-none">
                    {item?.name}
                  </p>
                  <div className=" p-1.5 rounded-md bg-dry text-subMain">
                    <p className=" font-bold text-sm">{item?.price}$</p>
                  </div>
                </div>
              </div>
              <div className=" flex md:hidden items-start justify-between px-2 gap-1">
                <p className=" text-xs font-light tracking-wide text-dryGray">
                  {item?.name}
                </p>
                <p className=" text-subMain font-medium text-sm">
                  {item?.price}$
                </p>
              </div>
            </div>
          </Link>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
};

export default LimitedSlides;
