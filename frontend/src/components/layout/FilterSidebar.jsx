import React, { useEffect, useState } from "react";
import BuyRobux from "../home/BuyRobux";
import { CiDollar } from "react-icons/ci";
import { FaSort } from "react-icons/fa6";
import { Radio } from "@mantine/core";

const FilterSidebar = ({
  classes,
  taxModalId,
  modalId,
  urlModalId,
  setFilters,
  summaryModalId,
}) => {
  const [filters, setLocalFilters] = useState({
    minPrice: "",
    maxPrice: "",
    paymentMethod: "all",
    sort: "default",
  });

  const handleChange = (field, value) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        minPrice: filters.minPrice ? Number(filters.minPrice) : "",
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : "",
      }));
    }, 500); // Debounce to avoid excessive re-renders

    return () => clearTimeout(delay);
  }, [filters, setFilters]);

  return (
    <div className={`${classes} sticky top-4 sm:top-20`}>
      <div className="md:pr-5">
        <h1 className="text-text text-2xl font-extrabold">FILTERS</h1>
        <div className="border-t border-subMain border-dashed mt-2"></div>

        {/* price */}
        <div className="mt-4 flex items-center gap-1">
          <span className="text-text 2xl:text-lg">Price</span>
          <CiDollar className="mt-[2px] text-dryGray w-5 h-5 2xl:size-6" />
        </div>

        {/* price range */}
        <div className="mt-2 flex items-center gap-3">
          <input
            type="number"
            placeholder="Min"
            min={0}
            value={filters.minPrice}
            onChange={(e) => handleChange("minPrice", e.target.value)}
            className="w-full bg-dry border border-zinc-800 py-1.5 md:py-2 2xl:py-2.5 px-3 text-text outline-none text-sm md:text-base 2xl:text-lg rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <input
            type="number"
            placeholder="Max"
            max={999999}
            value={filters.maxPrice}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
            className="w-full bg-dry border border-zinc-800 py-1.5 md:py-2 2xl:py-2.5 px-3 text-text outline-none text-sm md:text-base 2xl:text-lg rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        {/* payment method */}
        {/* <div className="mt-6">
          <span className="text-text">Payment Method</span>
          <div className="text-text mt-2">
            <Radio.Group
              value={filters.paymentMethod}
              onChange={(value) => handleChange("paymentMethod", value)}
            >
              <div className="mt-2 flex flex-col gap-2">
                <Radio color="#02b757" value="all" label="All" />
                <Radio color="#02b757" value="crypto" label="Crypto" />
                <Radio color="#02b757" value="card" label="Card" />
              </div>
            </Radio.Group>
          </div>
        </div> */}

        {/* sort */}
        <div className="mt-6">
          <div className="flex items-center gap-1">
            <span className="text-text 2xl:text-lg">Sort</span>
            <FaSort className="mt-[2px] text-dryGray w-4 h-4 2xl:size-5" />
          </div>
          <div className="text-text mt-2">
            <Radio.Group
              value={filters.sort}
              onChange={(value) => handleChange("sort", value)}
            >
              <div className="mt-2 flex flex-col gap-2 2xl:gap-3 text-2xl">
                <Radio color="#CF9FFF" value="default" label="Default" />
                <Radio color="#CF9FFF" value="rhtl" label="Rap (Low to High)" />
                <Radio color="#CF9FFF" value="rlth" label="Rap (High to Low)" />
                <Radio
                  color="#CF9FFF"
                  value="phtl"
                  label="Price (High to Low)"
                />
                <Radio
                  color="#CF9FFF"
                  value="plth"
                  label="Price (Low to High)"
                />
              </div>
            </Radio.Group>
          </div>
        </div>

        {/* title  */}
        <h1 className=" mt-4 text-text text-2xl font-extrabold">ROBUX</h1>

        <div className=" border-t border-subMain border-dashed mt-2"></div>

        {/* buy robux */}
        <BuyRobux
          modalId={modalId}
          taxModalId={taxModalId}
          urlModalId={urlModalId}
          summaryModalId={summaryModalId}
        />
      </div>
    </div>
  );
};

export default FilterSidebar;
