import React, { useState } from "react";
import { RiInformation2Fill } from "react-icons/ri";
import Loader from "../utils/Loader";
import { IoEyeOutline } from "react-icons/io5";
import { IoCopyOutline } from "react-icons/io5";
import { AiOutlineCheck } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ErrorResponseModal from "../utils/ErrorResponseModal";
import SuccessResponseModal from "../utils/SuccessResponseModal";
import { formatPostDate } from "../utils/formatDate";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoMdDoneAll } from "react-icons/io";
import { GoTrash } from "react-icons/go";

const WithdrawTable = ({
  items,
  loading,
  totalCars,
  page,
  setPage,
  USERS_PER_PAGE,
}) => {
  const totalPages = Math.ceil(totalCars / USERS_PER_PAGE);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (email, id) => {
    if (email) {
      navigator.clipboard.writeText(email);
      setCopiedId(id);

      // Reset copied state after 5 seconds
      setTimeout(() => setCopiedId(null), 5000);
    }
  };

  const queryClient = useQueryClient();

  //------------------------------reject withdrawal start -----------------------------
  const {
    mutate: rejectWithdrawal,
    isPending: rejectWithdrawalPending,
    error: rejectWithdrawalError,
  } = useMutation({
    mutationFn: async (withdrawalId) => {
      try {
        const res = await fetch(
          `/api/rumman/v1/admin/reject-withdrawal/${withdrawalId}`,
          {
            method: "POST",
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
    onError: () => {
      document.getElementById("reject_withdrawal_error_modal").showModal();
    },
    onSuccess: () => {
      document.getElementById("reject_withdrawal_success_modal").showModal();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    },
  });

  //------------------------------reject withdrawal end -----------------------------

  //------------------------------accept withdrawal start -----------------------------
  const {
    mutate: acceptWithdrawal,
    isPending: acceptWithdrawalPending,
    error: acceptWithdrawalError,
  } = useMutation({
    mutationFn: async (withdrawalId) => {
      try {
        const res = await fetch(
          `/api/rumman/v1/admin/accept-withdrawal/${withdrawalId}`,
          {
            method: "POST",
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
    onError: () => {
      document.getElementById("accept_withdrawal_error_modal").showModal();
    },
    onSuccess: () => {
      document.getElementById("accept_withdrawal_success_modal").showModal();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    },
  });

  //------------------------------accept withdrawal end -----------------------------

  //------------------------------delete withdrawal start -----------------------------
  const { mutate: deleteWithdrawal, isPending: deleteWithdrawalPending } =
    useMutation({
      mutationFn: async (withdrawalId) => {
        try {
          const res = await fetch(
            `/api/rumman/v1/admin/delete-withdrawal/${withdrawalId}`,
            {
              method: "DELETE",
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
        window.location.reload();
      },
    });

  //------------------------------delete withdrawal end -----------------------------

  return (
    <div className=" w-full mt-5 h-[70vh] relative overflow-scroll no-scrollbar">
      <div className=" sticky top-0 left-0 w-full py-5 px-4 bg-dry rounded-md">
        <div className=" font-semibold grid grid-cols-12 grid-rows-1 gap-2">
          <div className="col-span-3">Tracking ID</div>
          <div className="col-span-2 col-start-4">Username</div>
          <div className="col-start-6">Amount</div>
          <div className="col-start-7 flex items-center justify-center w-full col-span-2">
            Network
          </div>
          <div className=" col-start-9">
            <p className=" ml-4">Status</p>
          </div>
          <div className="col-span-2 col-start-11">Time</div>
        </div>
      </div>

      {/* table data  */}
      <div className=" mt-4">
        {loading ? (
          <div className=" flex items-center justify-center h-40">
            <Loader />
          </div>
        ) : (
          <>
            {items?.length === 0 ? (
              <div className=" opacity-70 flex items-center justify-center h-40">
                No Withdrawal request yet
              </div>
            ) : (
              items?.map((item) => (
                <div
                  key={item?._id}
                  className="py-3 mt-3 border-b border-dry px-4 "
                >
                  <div className="grid grid-cols-12 grid-rows-1 gap-2">
                    <div className="col-span-3">
                      <span className=" text-sm 2xl:text-lg">{item?._id}</span>
                    </div>
                    <div className="col-span-2 col-start-4 2xl:text-lg">
                      {item?.userId?.username}
                    </div>
                    <div className="col-start-6">{item?.amount}$</div>
                    <div className="col-start-7 flex items-center justify-center w-full col-span-2">
                      {item?.network === "btc" && (
                        <div className=" w-6 h-6 rounded-full">
                          <img src="/images/btc-logo.png" alt="btc" />
                        </div>
                      )}
                      {item?.network === "usdt" && (
                        <div className=" w-6 h-6 rounded-full">
                          <img src="/images/usdt-logo.png" alt="btc" />
                        </div>
                      )}
                      {item?.network === "ltc" && (
                        <div className=" w-6 h-6 rounded-full">
                          <img src="/images/ltc-logo.png" alt="btc" />
                        </div>
                      )}
                      {item?.network === "paypal" && (
                        <div className=" w-6 h-6 rounded-full">
                          <img src="/images/pp.png" alt="paypal" />
                        </div>
                      )}
                    </div>

                    <div className="col-start-9">
                      <span className=" text-nowrap">
                        <p className=" ml-4 2xl:text-lg capitalize">
                          {item?.status}
                        </p>
                      </span>
                    </div>
                    <div className="col-span-2 col-start-11">
                      <div className=" flex items-center justify-between gap-2 2xl:text-lg">
                        <div>{formatPostDate(item?.createdAt)}</div>
                        <button
                          onClick={() =>
                            document.getElementById(`${item?._id}`).showModal()
                          }
                          className=" py-1 px-1.5 hover:bg-subMain/90 rounded-md bg-subMain"
                        >
                          <IoEyeOutline className=" text-white 2xl:size-5" />
                        </button>
                        <dialog id={item?._id} className="modal">
                          <div className="modal-box max-w-4xl no-scrollbar px-7 bg-dry text-dryGray">
                            <div className=" md:flex justify-between gap-4">
                              <div className=" border-b md:border-b-0 md:border-r pb-5 md:pb-0 border-zinc-600 w-full">
                                <div className=" flex items-center gap-2 text-xl font-medium">
                                  <span>Amount:</span>{" "}
                                  <span className=" text-subMain 2xl:text-lg">
                                    {item?.amount}$
                                  </span>
                                </div>
                                <div className=" flex items-center gap-2 mt-1 2xl:text-lg">
                                  <p>Network: </p>
                                  {item?.network === "btc" && (
                                    <div className=" w-6 h-6 rounded-full">
                                      <img
                                        src="/images/btc-logo.png"
                                        alt="btc"
                                      />
                                    </div>
                                  )}
                                  {item?.network === "usdt" && (
                                    <div className=" w-6 h-6 rounded-full">
                                      <img
                                        src="/images/usdt-logo.png"
                                        alt="btc"
                                      />
                                    </div>
                                  )}
                                  {item?.network === "ltc" && (
                                    <div className=" w-6 h-6 rounded-full">
                                      <img
                                        src="/images/ltc-logo.png"
                                        alt="btc"
                                      />
                                    </div>
                                  )}
                                </div>
                                <p className=" mt-1 flex items-center gap-2 2xl:text-lg">
                                  <p>Address:</p>{" "}
                                  <span className="text-sm 2xl:text-lg md:w-80 w-64 truncate text-subMain">
                                    {item?.addy}
                                  </span>
                                  <div>
                                    {copiedId === item?.addy ? (
                                      <AiOutlineCheck className="text-green-500" />
                                    ) : (
                                      <IoCopyOutline
                                        className="cursor-pointer hover:text-gray-400"
                                        onClick={() =>
                                          handleCopy(item?.addy, item?.addy)
                                        }
                                      />
                                    )}
                                  </div>
                                </p>
                                <p className=" mt-1 2xl:text-lg">
                                  Seller Username:{" "}
                                  <span className=" text-subMain">
                                    {item?.userId?.username}
                                  </span>
                                </p>
                                <p className=" mt-1 2xl:text-lg">
                                  Seller Email:{" "}
                                  <span className=" text-subMain">
                                    {item?.userId?.email}
                                  </span>
                                </p>
                                <p className=" mt-1 flex items-center gap-2">
                                  <p className=" whitespace-nowrap 2xl:text-lg">
                                    Seller ID:
                                  </p>{" "}
                                  <span className="text-sm 2xl:text-lg md:w-[317px] w-64 truncate text-subMain">
                                    {item?.userId?._id}
                                  </span>
                                  <div>
                                    {copiedId === item?.userId?._id ? (
                                      <AiOutlineCheck className="text-green-500" />
                                    ) : (
                                      <IoCopyOutline
                                        className="cursor-pointer hover:text-gray-400"
                                        onClick={() =>
                                          handleCopy(
                                            item?.userId?._id,
                                            item?.userId?._id
                                          )
                                        }
                                      />
                                    )}
                                  </div>
                                </p>
                                <p className=" mt-1 flex items-center gap-2">
                                  <p className=" whitespace-nowrap 2xl:text-lg">
                                    Tracking ID:
                                  </p>{" "}
                                  <span className="text-sm 2xl:text-lg md:w-[293px] w-64 truncate text-subMain">
                                    {item?._id}
                                  </span>
                                  <div>
                                    {copiedId === item?._id ? (
                                      <AiOutlineCheck className="text-green-500" />
                                    ) : (
                                      <IoCopyOutline
                                        className="cursor-pointer hover:text-gray-400"
                                        onClick={() =>
                                          handleCopy(item?._id, item?._id)
                                        }
                                      />
                                    )}
                                  </div>
                                </p>
                              </div>

                              {/* status  */}
                              <div className=" w-full md:w-max px-5 pt-5 md:pt-0">
                                <p className=" text-center 2xl:text-lg">
                                  Status
                                </p>

                                {item?.status === "pending" && (
                                  <div className=" flex items-center justify-center gap-2 mt-2">
                                    {/* accept  */}
                                    <div className=" flex items-center gap-1">
                                      <div
                                        onClick={() =>
                                          document
                                            .getElementById(
                                              "mark_paid_confirm_modal"
                                            )
                                            .showModal()
                                        }
                                        className="tooltip tooltip-accent tooltip-top"
                                        data-tip="Mark as Paid"
                                      >
                                        <button className="">
                                          <IoCheckmarkDoneCircleOutline className="w-7 h-7 text-subMain -mb-1" />
                                        </button>
                                      </div>

                                      {/* paid confirm modal  */}
                                      <dialog
                                        id="mark_paid_confirm_modal"
                                        className="modal"
                                      >
                                        <div className="modal-box bg-dry">
                                          <div className="flex flex-col items-center justify-between gap-4">
                                            <h3 className="font-bold text-lg">
                                              Are you sure?
                                            </h3>
                                            <p className="text-center text-sm text-zinc-400">
                                              Are you sure you paid the seller?
                                              And you want to mark this order as
                                              paid?
                                            </p>
                                            <div className="flex items-center gap-3">
                                              <button
                                                onClick={() =>
                                                  acceptWithdrawal(item?._id)
                                                }
                                                className="w-32 h-8 text-sm bg-subMain text-text text-center rounded-md"
                                              >
                                                {acceptWithdrawalPending
                                                  ? "Please wait..."
                                                  : "Yes, Paid"}
                                              </button>
                                              <ErrorResponseModal
                                                id={
                                                  "accept_withdrawal_error_modal"
                                                }
                                                message={
                                                  acceptWithdrawalError?.message
                                                }
                                              />
                                              <SuccessResponseModal
                                                id={
                                                  "accept_withdrawal_success_modal"
                                                }
                                                message={
                                                  "Withdrawal marked as paid"
                                                }
                                              />
                                              <button
                                                onClick={() =>
                                                  document
                                                    .getElementById(
                                                      "mark_paid_confirm_modal"
                                                    )
                                                    .close()
                                                }
                                                className="w-20 h-8 text-sm bg-main/60 text-text rounded-md"
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                        <form
                                          method="dialog"
                                          className="modal-backdrop"
                                        >
                                          <button>close</button>
                                        </form>
                                      </dialog>
                                    </div>
                                    {/* reject */}
                                    <div className=" flex items-center gap-1">
                                      <div
                                        onClick={() =>
                                          document
                                            .getElementById(
                                              "mark_reject_confirm_modal"
                                            )
                                            .showModal()
                                        }
                                        className="tooltip tooltip-accent tooltip-top"
                                        data-tip="Reject"
                                      >
                                        <button className="">
                                          <MdOutlineCancel className="w-7 h-7 text-red-600 -mb-1" />
                                        </button>
                                      </div>

                                      {/* reject confirm modal  */}

                                      <dialog
                                        id="mark_reject_confirm_modal"
                                        className="modal"
                                      >
                                        <div className="modal-box bg-dry">
                                          <div className="flex flex-col items-center justify-between gap-4">
                                            <h3 className="font-bold text-lg">
                                              Are you sure?
                                            </h3>
                                            <p className="text-center text-sm text-zinc-400">
                                              Are you sure you want to reject
                                              this withdrawal request?
                                            </p>
                                            <div className="flex items-center gap-3">
                                              <button
                                                onClick={() =>
                                                  rejectWithdrawal(item?._id)
                                                }
                                                className="w-32 h-8 text-sm bg-red-600 text-text text-center rounded-md"
                                              >
                                                {rejectWithdrawalPending
                                                  ? "Please wait..."
                                                  : "Yes, Reject"}
                                              </button>
                                              <ErrorResponseModal
                                                id={
                                                  "reject_withdrawal_error_modal"
                                                }
                                                message={
                                                  rejectWithdrawalError?.message
                                                }
                                              />
                                              <SuccessResponseModal
                                                id={
                                                  "reject_withdrawal_success_modal"
                                                }
                                                message={
                                                  "Withdrawal marked as rejected"
                                                }
                                              />
                                              <button
                                                onClick={() =>
                                                  document
                                                    .getElementById(
                                                      "mark_reject_confirm_modal"
                                                    )
                                                    .close()
                                                }
                                                className="w-20 h-8 text-sm bg-main/60 text-text rounded-md"
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                        <form
                                          method="dialog"
                                          className="modal-backdrop"
                                        >
                                          <button>close</button>
                                        </form>
                                      </dialog>
                                    </div>
                                  </div>
                                )}

                                <div className=" mt-3">
                                  {item?.status === "pending" && (
                                    <div className="p-1 bg-yellow-500 rounded-md flex items-center justify-center">
                                      <p className=" text-xs 2xl:text-base">
                                        Pending
                                      </p>
                                    </div>
                                  )}
                                  {item?.status === "completed" && (
                                    <div className="p-1 bg-green-600 rounded-md flex items-center justify-center">
                                      <p className=" text-xs 2xl:text-base">
                                        Paid
                                      </p>
                                    </div>
                                  )}
                                  {item?.status === "rejected" && (
                                    <div className="p-1 bg-red-600 rounded-md flex items-center justify-center">
                                      <p className=" text-xs 2xl:text-base">
                                        Rejected
                                      </p>
                                    </div>
                                  )}
                                </div>

                                <div className=" mt-5 flex items-center justify-center">
                                  <button
                                    onClick={() =>
                                      document
                                        .getElementById(
                                          `delete_confirm_modal${item?._id}`
                                        )
                                        .showModal()
                                    }
                                    className=" bg-red-500 p-1 rounded-md"
                                  >
                                    <GoTrash className="w-4 h-4 2xl:size-6 text-white" />
                                  </button>

                                  {/* delete confirm modal  */}
                                  <dialog
                                    id={`delete_confirm_modal${item?._id}`}
                                    className="modal"
                                  >
                                    <div className="modal-box bg-dry">
                                      <div className="flex flex-col items-center justify-between gap-4">
                                        <h3 className="font-bold text-lg">
                                          Are you sure?
                                        </h3>
                                        <p className="text-center text-sm text-zinc-400">
                                          Are you sure you want to delete this
                                          withdrawal request?
                                        </p>
                                        <div className="flex items-center gap-3">
                                          <button
                                            onClick={() => {
                                              console.log(item?._id);

                                              deleteWithdrawal(item?._id);
                                            }}
                                            className="w-32 h-8 text-sm bg-red-600 text-text text-center rounded-md"
                                          >
                                            {deleteWithdrawalPending
                                              ? "Please wait..."
                                              : "Yes, Delete"}
                                          </button>

                                          <button
                                            onClick={() =>
                                              document
                                                .getElementById(
                                                  "delete_confirm_modal"
                                                )
                                                .close()
                                            }
                                            className="w-20 h-8 text-sm bg-main/60 text-text rounded-md"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                    <form
                                      method="dialog"
                                      className="modal-backdrop"
                                    >
                                      <button>close</button>
                                    </form>
                                  </dialog>
                                </div>
                              </div>
                            </div>
                            <div className=" mt-7 flex gap-2 md:items-center justify-center">
                              <IoMdDoneAll className=" text-subMain" />
                              <p className=" text-sm font-light text-zinc-400 leading-4 text-center">
                                All good, Seller don't have any pending order
                                right now
                              </p>
                            </div>
                          </div>
                          <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                          </form>
                        </dialog>
                      </div>
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
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((prev) => prev + 1)}
          className={`p-3 text-sm font-medium rounded-full ${
            page === totalPages || totalPages === 0
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

export default WithdrawTable;
