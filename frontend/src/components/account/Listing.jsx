import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { FaBitcoin, FaRegCreditCard } from "react-icons/fa6";
import { GoTrash } from "react-icons/go";
import ErrorResponseModal from "../utils/ErrorResponseModal";
import SuccessResponseModal from "../utils/SuccessResponseModal";
import Loader from "../utils/Loader";
import CountFormatter from "../utils/formatNumber";

function Listing({ limited }) {
  const queryClient = useQueryClient();
  const {
    mutate: deleteListing,
    isPending: isDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(
          `/api/rumman/v1/seller/delete-listing/${limited?._id}`,
          {
            method: "DELETE",
          }
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
    onError: (error) => {
      console.log(error);
      document.getElementById("delete_listing_error_modal").showModal();
    },
    onSuccess: () => {
      document.getElementById("delete_listing_success_modal").showModal();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    },
  });
  return (
    <div className="border group hover:border-zinc-800 border-main w-full bg-dry rounded-md mt-3">
      <div className="relative w-full px-3 pt-2">
        {/* delete listings button  */}
        {limited?.sold && (
          <div className=" inset-0 absolute bg-main/80 rounded-md border border-zinc-800">
            <div className=" w-full h-full flex flex-col items-center justify-center">
              <h1 className=" font-bold text-3xl text-zinc-300">SOLD</h1>
              <p className=" text-sm mt-10">ID: {limited?._id}</p>
            </div>
          </div>
        )}
        {!limited?.sold && (
          <div className=" absolute inset-0 bg-main/80 group-hover:block hidden rounded-md">
            <div className=" w-full h-full flex flex-col items-center justify-center">
              <button
                onClick={() => deleteListing()}
                className=" p-3 rounded-full bg-zinc-700 hover:bg-zinc-600"
              >
                {isDeleting ? (
                  <Loader />
                ) : (
                  <GoTrash className=" text-white w-5 h-5" />
                )}
              </button>
              <p className=" text-sm mt-10">ID: {limited?._id}</p>
            </div>
          </div>
        )}

        <ErrorResponseModal
          id={"delete_listing_error_modal"}
          message={deleteError?.message}
        />
        <SuccessResponseModal
          id={"delete_listing_success_modal"}
          message={"Listing deleted successfully"}
        />

        <div className=" float-end px-3 py-1.5 rounded-full bg-zinc-800">
          <div className=" flex items-center gap-2  ">
            <FaRegCreditCard className=" w-4 h-4 text-subMain" />
            <FaBitcoin className=" w-4 h-4 text-subMain" />
          </div>
        </div>
        <div className=" w-full h-40  flex items-center justify-center">
          <img
            src={limited?.image}
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
            <h1 className=" text-subMain text-lg text-center font-medium">
              {limited?.price}$
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Listing;
