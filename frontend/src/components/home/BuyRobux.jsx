import React, { useState } from "react";
import { FaBitcoin, FaRegCreditCard } from "react-icons/fa";
import RobuxAd from "./RobuxAd";
import { useQuery } from "@tanstack/react-query";
import Loader from "../utils/Loader";
import TaxAndInfo from "./TaxAndInfo";
import UrlVerification from "./UrlVerification";
import SummaryModal from "./SummaryModal";
import CountFormatter from "../utils/formatNumber";

const BuyRobux = ({ modalId, taxModalId, urlModalId, summaryModalId }) => {
  const [formData, setFormData] = useState({
    activeTab: "",
    total: "",
    robuxAmount: "",
    robuxAfterTaxAmount: "",
    paymentMethod: "",
    email: "",
    url: "",
    payMethod: "",
  });

  const { data: robuxStock, isLoading: robuxStockLoading } = useQuery({
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
        throw error;
      }
    },
  });

  return (
    <div className=" w-full ">
      <div className=" mt-4 flex items-center justify-between gap-2">
        <div className=" flex items-center gap-2">
          <span className=" text-xl 2xl:text-3xl font-extrabold text-dryGray">
            Stock
          </span>
          <div className=" w-5 h-5 2xl:size-6">
            <img
              src="/images/robux-green.png"
              alt=""
              className=" w-full h-full object-contain"
            />
          </div>
          {robuxStockLoading ? (
            <Loader />
          ) : (
            <span className=" text-xl 2xl:text-2xl ml-1 text-white">
              <CountFormatter value={robuxStock?.robux} />
            </span>
          )}
        </div>
        <div className="  px-3 py-[5px] rounded-full bg-zinc-800">
          <div className=" flex items-center gap-2  ">
            <FaRegCreditCard className=" w-4 h-4 2xl:size-6 text-white" />
            <FaBitcoin className=" w-4 h-4 2xl:size-6 text-white" />
          </div>
        </div>
      </div>
      <button
        onClick={() => document.getElementById(`${modalId}`).showModal()}
        className=" w-full mt-3 h-9 md:h-10 2xl:h-12  flex items-center justify-center text-base lg:text-lg 2xl:text-xl bg-subMain hover:bg-subMain/90 transition rounded-lg font-medium text-white"
      >
        BUY R$
      </button>

      {/* purchase dialog  */}
      <dialog id={modalId} className="modal no-scrollbar">
        <div className="modal-box max-w-4xl 2xl:max-w-5xl  bg-[#1f1f1f] text-dryGray">
          <RobuxAd
            robuxdetails={robuxStock}
            modalId={modalId}
            taxModalId={taxModalId}
            formData={formData}
            setFormData={setFormData}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* tax and instructions  */}
      <dialog id={taxModalId} className="modal no-scrollbar">
        <div className="modal-box max-w-lg 2xl:max-w-2xl bg-[#1f1f1f] text-dryGray">
          <TaxAndInfo
            taxModalId={taxModalId}
            modalId={modalId}
            urlModalId={urlModalId}
            formData={formData}
            setFormData={setFormData}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* url of the product  */}
      <dialog id={urlModalId} className="modal no-scrollbar">
        <div className="modal-box max-w-lg 2xl:max-w-2xl bg-[#1f1f1f] text-dryGray">
          <UrlVerification
            urlModalId={urlModalId}
            summaryModalId={summaryModalId}
            taxModalId={taxModalId}
            formData={formData}
            setFormData={setFormData}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* order summary  */}
      <dialog id={summaryModalId} className="modal no-scrollbar">
        <div className="modal-box max-w-4xl 2xl:max-w-5xl  bg-[#1f1f1f] text-dryGray">
          <SummaryModal
            summaryModalId={summaryModalId}
            urlModalId={urlModalId}
            formData={formData}
            setFormData={setFormData}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default BuyRobux;
