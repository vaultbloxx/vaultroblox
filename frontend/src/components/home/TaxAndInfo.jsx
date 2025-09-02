import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

function TaxAndInfo({
  clasess,
  taxModalId,
  modalId,
  formData,
  setFormData,
  urlModalId,
}) {
  const [currentTab, setCurrentTab] = useState("gamepass");

  // Update formData with after-tax value
  useEffect(() => {
    if (formData?.robuxAmount) {
      const afterTaxValue = Math.ceil(formData.robuxAmount / 0.7);
      setFormData((prev) => ({
        ...prev,
        robuxAfterTaxAmount: afterTaxValue, // optional: store in separate key
      }));
    }
  }, [formData.robuxAmount]);
  return (
    <div className={`${clasess} `}>
      <h1 className=" text-center text-zinc-200 text-2xl 2xl:text-3xl font-extrabold font-movie tracking-wide mb-3">
        CREATE GAMEPASS
      </h1>

      <div className=" mb-2 flex items-center justify-center text-lg xl:text-xl 2xl:text-2xl ">
        <div
          className={` border-b-2 2xl:border-b-[3px] cursor-pointer px-4 ${
            currentTab === "gamepass"
              ? "border-b-2 border-subMain"
              : "border-border"
          }`}
          onClick={() => setCurrentTab("gamepass")}
        >
          <p>Gamepass</p>
        </div>
        <div
          className={` border-b-2 cursor-pointer  px-4 ${
            currentTab === "product"
              ? "border-b-2 2xl:border-b-[3px] border-subMain"
              : "border-border"
          }`}
          onClick={() => setCurrentTab("product")}
        >
          <p>Product</p>
        </div>
      </div>
      {currentTab === "gamepass" && (
        <div className="relative w-full pb-[50%] md:pb-[50%] overflow-hidden rounded-lg">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/Hl9QPHIXWHk?si=tMk_qTsBKxpLMfEf"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {currentTab === "product" && (
        <div className="relative w-full pb-[50%] md:pb-[50%] overflow-hidden rounded-lg">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/5k_ZysjSZB0?si=oUSDmZdd7thiP_Dq"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      )}

      <div className=" w-full mt-5 xl:mt-6 2xl:mt-8 flex items-center justify-between px-5 md:px-7 lg:px-10 2xl:px-14">
        <div>
          <h3 className=" text-sm lg:text-base 2xl:text-xl text-zinc-300">
            After Tax
          </h3>
          <h1 className=" text-lg xl:text-2xl 2xl:text-3xl font-bold">
            Total Price:
          </h1>
        </div>

        <div className=" flex items-center gap-2">
          <div className=" size-10">
            <img
              src="/images/robux-green.png"
              className=" w-full h-full object-contain"
              alt=""
            />
          </div>
          <h1 className="text-xl font-bold md:text-2xl 2xl:text-3xl">
            {formData?.robuxAmount
              ? Math.ceil(formData.robuxAmount / 0.7).toLocaleString()
              : "0"}
          </h1>
        </div>
      </div>

      <h4 className=" text-sm lg:text-base 2xl:text-xl text-center mt-4 text-zinc-300 underline">
        This is very crucial to <br /> get the exact amount you have purchased.
      </h4>

      <div className=" flex items-center gap-3 md:gap-4 mt-3">
        <button
          onClick={() => {
            document.getElementById(`${taxModalId}`).close();
            document.getElementById(`${modalId}`).showModal();
          }}
          className=" w-full flex items-center justify-center gap-1 bg-lightDark hover:bg-lightDark/80 duration-200 h-9 md:h-10 2xl:h-12 rounded-full shadow-lg"
        >
          <div>
            <IoIosArrowBack className=" size-5 2xl:size-6" />
          </div>
          <h3 className=" leading-3 text-base md:text-lg 2xl:text-xl font-medium">
            Back
          </h3>
        </button>
        <button
          onClick={() => {
            document.getElementById(`${taxModalId}`).close();
            document.getElementById(`${urlModalId}`).showModal();
          }}
          className=" w-full flex items-center justify-center gap-1 bg-lightDark hover:bg-lightDark/80 duration-200 h-9 md:h-10 2xl:h-12 rounded-full shadow-lg"
        >
          <h3 className=" leading-3 text-base md:text-lg 2xl:text-xl font-medium">
            Next
          </h3>
          <div>
            <IoIosArrowForward className=" size-5 2xl:size-6" />
          </div>
        </button>
      </div>
    </div>
  );
}

export default TaxAndInfo;
