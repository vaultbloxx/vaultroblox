import React, { useState } from "react";
import Loader from "../utils/Loader";
import { IoEyeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoCheckmarkCircle } from "react-icons/io5";
import { formatPostDate } from "../utils/formatDate";
import { useMutation } from "@tanstack/react-query";
import ErrorResponseModal from "../utils/ErrorResponseModal";
import SuccessResponseModal from "../utils/SuccessResponseModal";

const LimitedsTable = ({
  data,
  totalCars,
  page,
  setPage,
  USERS_PER_PAGE,
  isLoading,
}) => {
  const totalPages = Math.ceil(totalCars / USERS_PER_PAGE);

  const {
    mutate: deleteLimited,
    isPending: deleteLimitedPending,
    error: deleteLimitedError,
  } = useMutation({
    mutationFn: async (limitedId) => {
      try {
        const res = await fetch(
          `/api/rumman/v1/admin/delete-limiteds/${limitedId}`,
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
    onError: () => {
      document.getElementById("delete_limited_error_modal").showModal();
    },
    onSuccess: () => {
      document.getElementById("delete_limited_success_modal").showModal();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    },
  });

  const {
    mutate: promoteLimited,
    isPending: promoteLimitedPending,
    error: promoteLimitedError,
  } = useMutation({
    mutationFn: async (limitedId) => {
      try {
        const res = await fetch(
          `/api/rumman/v1/admin/create-banner/${limitedId}`,
          {
            method: "POST",
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
    onError: () => {
      document.getElementById("promote_limited_error_modal").showModal();
    },
    onSuccess: () => {
      document.getElementById("promote_limited_success_modal").showModal();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    },
  });

  return (
    <div className=" w-full mt-5 h-[70vh] relative overflow-scroll no-scrollbar">
      <div className=" sticky top-0 left-0 w-full py-5 px-4 bg-dry rounded-md">
        <div className=" font-semibold grid grid-cols-12 grid-rows-1 gap-2">
          <div className="col-span-4">Limited ID</div>
          <div className="col-span-1 col-start-5">Image</div>
          <div className="col-span-2 col-start-6 flex items-center justify-center">
            Sold
          </div>
          <div className="col-start-8">Name</div>
          <div className="col-start-10">Price</div>

          <div className="col-span-2 col-start-11 flex items-center justify-center">
            Action
          </div>
        </div>
      </div>

      {/* table data  */}
      <div className=" mt-4">
        {isLoading ? (
          <div className=" flex items-center justify-center h-40">
            <Loader />
          </div>
        ) : (
          <>
            {data?.length === 0 ? (
              <div className=" opacity-70 flex items-center justify-center h-40">
                No Users Yet
              </div>
            ) : (
              data?.map((item) => (
                <div
                  key={item?._id}
                  className="py-3 mt-3 border-b border-dry px-4 "
                >
                  <div className="grid grid-cols-12 grid-rows-1 gap-2">
                    <div className="col-span-3 flex items-center justify-center">
                      <span className=" text-sm 2xl:text-lg">{item?._id}</span>
                    </div>
                    <div className="col-span-1 col-start-5 ">
                      <div className=" w-14 h-14">
                        <img
                          src={item?.image}
                          alt={item?.name}
                          className=" w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    <div className="col-span-2 col-start-6 flex items-center justify-center">
                      {!item?.sold ? (
                        <div>-</div>
                      ) : (
                        <div>
                          <IoCheckmarkCircle className=" text-green-500 2xl:size-6" />
                        </div>
                      )}
                    </div>
                    <div className="col-span-2 col-start-8 whitespace-nowrap truncate flex items-center 2xl:text-lg">
                      {item?.name}
                    </div>
                    <div className="col-start-10 flex items-center 2xl:text-lg">
                      ${item?.price.toFixed(2)}
                    </div>

                    <div className="col-span-2 col-start-11 flex items-center justify-center">
                      <div className=" flex items-center justify-between gap-2">
                        {/* <p>{format(new Date(item?.createdAt), "yyyy-MM-dd")}</p> */}

                        <button
                          onClick={() =>
                            document
                              .getElementById(`limited-${item?._id}`)
                              .showModal()
                          }
                          className=" py-1 px-1.5 hover:bg-subMain/90 rounded-md bg-subMain"
                        >
                          <IoEyeOutline className=" text-white 2xl:size-6" />
                        </button>
                      </div>
                      <dialog id={`limited-${item?._id}`} className="modal">
                        <div className=" modal-box max-w-3xl no-scrollbar px-7 bg-dry text-dryGray">
                          <div>
                            <div className=" flex gap-8 mt-3">
                              <div className=" w-32 h-32">
                                <img
                                  src={item?.image}
                                  alt={item?.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div>
                                <p className=" text-sm text-zinc-500 font-medium">
                                  Limited ID: {item?._id}
                                </p>
                                <p className=" text-sm text-zinc-500 font-medium">
                                  Seller ID: {item?.sellerId}
                                </p>
                                <h1>Name: {item?.name}</h1>
                                <h1>Price: ${item?.price}</h1>
                                <div className=" flex items-center gap-2">
                                  <p>Sold: </p>
                                  {!item?.sold ? (
                                    <div>-</div>
                                  ) : (
                                    <div>
                                      <IoCheckmarkCircle className=" text-green-500" />
                                    </div>
                                  )}
                                </div>
                                <div className=" flex items-center gap-1">
                                  <p>Listed At: </p>
                                  <div>{formatPostDate(item?.createdAt)}</div>
                                </div>
                              </div>
                            </div>
                            <div className=" my-3 border-t border-zinc-700" />
                            <div className=" flex items-center gap-2">
                              <button
                                onClick={() => promoteLimited(item?._id)}
                                className=" py-1.5 text-sm px-4 bg-subMain/90 hover:bg-subMain rounded-md w-full"
                              >
                                {promoteLimitedPending
                                  ? "Promoting..."
                                  : "Promote"}
                              </button>
                              <ErrorResponseModal
                                id={"promote_limited_error_modal"}
                                message={promoteLimitedError?.message}
                              />
                              <SuccessResponseModal
                                id={"promote_limited_success_modal"}
                                message={"Promoted successfully"}
                              />
                              <button
                                onClick={() => deleteLimited(item?._id)}
                                className=" py-1.5 text-sm px-4 bg-red-600/90 hover:bg-red-700 rounded-md w-full"
                              >
                                {deleteLimitedPending
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                              <ErrorResponseModal
                                id={"delete_limited_error_modal"}
                                message={deleteLimitedError?.message}
                              />
                              <SuccessResponseModal
                                id={"delete_limited_success_modal"}
                                message={"Deleted successfully"}
                              />
                              <button
                                onClick={() =>
                                  document
                                    .getElementById(`limited-${item?._id}`)
                                    .close()
                                }
                                className=" py-1.5 px-4 bg-main/60 hover:bg-main/80 text-sm rounded-md w-full"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                          <button>close</button>
                        </form>
                      </dialog>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center  w-full bg-dry rounded-md mt-4 py-4 px-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className={`p-3 text-sm font-medium rounded-full ${
            page === 1
              ? "bg-zinc-400 text-main text-opacity-50  cursor-not-allowed"
              : "bg-main/60 hover:bg-main transition"
          }`}
        >
          <IoIosArrowBack />
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages || isLoading || totalPages === 0}
          onClick={() => setPage((prev) => prev + 1)}
          className={`p-3 text-sm font-medium rounded-full ${
            page === totalPages || isLoading || totalPages === 0
              ? "bg-zinc-400 text-main text-opacity-50 cursor-not-allowed"
              : "bg-main/60 hover:bg-main transition"
          }`}
        >
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};

export default LimitedsTable;
