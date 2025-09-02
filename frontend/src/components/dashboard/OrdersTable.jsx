import React, { useState } from "react";
import { RiInformation2Fill } from "react-icons/ri";
import Loader from "../utils/Loader";
import { IoEyeOutline } from "react-icons/io5";
import { IoCopyOutline } from "react-icons/io5";
import { AiOutlineCheck } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import ErrorResponseModal from "../utils/ErrorResponseModal";
import SuccessResponseModal from "../utils/SuccessResponseModal";
import { formatPostDate } from "../utils/formatDate";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const OrdersTable = ({
  items,
  loading,
  location,
  authUser,
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

  //---------------------Force Delivered start---------------------//
  const {
    mutate: forceDelivered,
    isPending: forceDeliveredPending,
    error: forceDeliveredError,
  } = useMutation({
    mutationFn: async (orderId) => {
      try {
        const res = await fetch(
          `/api/rumman/v1/admin/force-delivered/${orderId}`,
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
      document.getElementById("force_delivered_error_modal").showModal();
    },
    onSuccess: () => {
      if (!forceDeliveredError) {
        window.location.reload();
      }
    },
  });
  //---------------------Force Delivered end---------------------//

  //---------------------reject order start---------------------//
  const {
    mutate: rejectOrder,
    isPending: rejectOrderPending,
    error: rejectOrderError,
  } = useMutation({
    mutationFn: async (orderId) => {
      try {
        const res = await fetch(
          `/api/rumman/v1/seller/reject-order/${orderId}`,
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
      document.getElementById("reject_order_error_modal").showModal();
    },
    onSuccess: () => {
      if (!rejectOrderError) {
        document.getElementById("reject_order_success_modal").showModal();
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    },
  });
  //---------------------reject order end---------------------//

  //---------------------delivered order start---------------------//
  const {
    mutate: deliverOrder,
    isPending: deliverOrderPending,
    error: deliverOrderError,
  } = useMutation({
    mutationFn: async (orderId) => {
      try {
        const res = await fetch(
          `/api/rumman/v1/seller/deliver-order/${orderId}`,
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
      document.getElementById("delivered_order_error_modal").showModal();
    },
    onSuccess: () => {
      if (!deliverOrderError) {
        document.getElementById("delivered_order_success_modal").showModal();
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    },
  });
  //---------------------delivered order end---------------------//

  //---------------------receive order start---------------------//
  const {
    mutate: receiveOrder,
    isPending: receiveOrderPending,
    error: receiveOrderError,
  } = useMutation({
    mutationFn: async (orderId) => {
      try {
        const res = await fetch(
          `/api/rumman/v1/user/received-order/${orderId}`,
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
      document.getElementById("received_order_error_modal").showModal();
    },
    onSuccess: () => {
      if (!receiveOrderError) {
        document.getElementById("received_order_success_modal").showModal();
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    },
  });
  //---------------------receive order end---------------------//

  return (
    <div className=" w-full mt-5 h-[80vh] relative overflow-auto no-scrollbar">
      {/* Scrollable table */}
      <div className="flex-1 overflow-auto ">
        <table className="w-full border-collapse">
          <thead className="bg-dry sticky top-0">
            <tr>
              <th className="text-left py-5 px-4 whitespace-nowrap">
                Tracking ID
              </th>
              <th className="text-left py-3 px-2">Name</th>
              <th className="text-left py-3 px-4">Price</th>
              {(location === "orders" || location === "admin") && (
                <th>
                  <span className=" flex items-center gap-1">
                    <p>Fee</p>
                    <div
                      className="tooltip tooltip-right tooltip-accent "
                      data-tip="5% Fee for each order as service charge & platform maintance."
                    >
                      <RiInformation2Fill />
                    </div>
                  </span>
                </th>
              )}

              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Time</th>

              <th className="text-left py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* table data  */}

            {loading ? (
              <tr>
                <td colSpan="8">
                  <div className="h-52 w-full flex items-center justify-center">
                    <Loader />
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {items?.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center opacity-70 h-52">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  items?.map((item) => (
                    <tr
                      key={item?._id}
                      className={` mt-3 border-b border-dry px-4 `}
                    >
                      <td className=" py-4 px-4">
                        <span className=" text-sm 2xl:text-lg">
                          {item?._id}
                        </span>
                      </td>
                      <td className=" py-4 px-2 2xl:text-lg">
                        <p className=" w-32  truncate">
                          {item?.limitedId?.name}
                        </p>
                      </td>
                      <td className=" py-4 px-4 2xl:text-lg">
                        ${item?.amount}
                      </td>
                      {(location === "orders" || location === "admin") && (
                        <td className="  2xl:text-lg">
                          <p className=" w-14 truncate">
                            ${(item?.amount * 5) / 100}
                          </p>
                        </td>
                      )}
                      <td className=" py-4 px-4">
                        <span className=" text-nowrap">
                          <p className=" 2xl:text-lg capitalize">
                            {item?.status}
                          </p>
                        </span>
                      </td>
                      <td className=" py-4 px-4">
                        <div className=" whitespace-nowrap">
                          {formatPostDate(item?.createdAt)}
                        </div>
                      </td>
                      <td className=" py-4 px-4">
                        <div className=" flex items-center justify-between gap-2 2xl:text-lg">
                          <button
                            onClick={() =>
                              document
                                .getElementById(`${item?._id}`)
                                .showModal()
                            }
                            className=" py-1 px-1.5 hover:bg-subMain/90 rounded-md bg-subMain"
                          >
                            <IoEyeOutline className=" text-white 2xl:size-6" />
                          </button>
                          <dialog id={item?._id} className="modal">
                            <div className="modal-box max-w-4xl no-scrollbar px-7 bg-dry text-dryGray">
                              <div className="  flex justify-between gap-2">
                                <div className=" flex gap-5 ">
                                  <div className=" w-40 h-full flex items-center justify-center ">
                                    <img
                                      src={item?.limitedId?.image}
                                      alt={item?.limitedId?.name}
                                      title={item?.limitedId?.name}
                                      className=" w-full h-full object-contain"
                                    />
                                  </div>
                                  <div className=" mt-5">
                                    <h1 className=" text-lg 2xl:text-2xl ">
                                      {item?.limitedId?.name}
                                    </h1>
                                    <h1 className=" text-xl font-medium ">
                                      Amount: {item?.amount}$
                                    </h1>
                                    {(location === "orders" ||
                                      location === "admin") && (
                                      <h1 className=" text- font- ">
                                        Fee: {(item?.amount * 5) / 100}$
                                      </h1>
                                    )}
                                    {location === "admin" && (
                                      <div className=" flex items-center gap-2">
                                        <h1 className=" text-sm 2xl:text-lg w-80 truncate">
                                          Buyer Email : {item?.buyerId?.email}
                                        </h1>
                                        {copiedId === item?._id ? (
                                          <AiOutlineCheck className="text-green-500" />
                                        ) : (
                                          <IoCopyOutline
                                            className="cursor-pointer hover:text-gray-400"
                                            onClick={() =>
                                              handleCopy(
                                                item?.buyerId?.email,
                                                item?._id
                                              )
                                            }
                                          />
                                        )}
                                      </div>
                                    )}
                                    {location === "admin" && (
                                      <div className=" flex items-center gap-2">
                                        <h1 className=" text-sm 2xl:text-lg w-80 truncate">
                                          Seller Email : {item?.sellerId?.email}
                                        </h1>
                                        {copiedId === item?.sellerId?.email ? (
                                          <AiOutlineCheck className="text-green-500" />
                                        ) : (
                                          <IoCopyOutline
                                            className="cursor-pointer hover:text-gray-400"
                                            onClick={() =>
                                              handleCopy(
                                                item?.sellerId?.email,
                                                item?.sellerId?.email
                                              )
                                            }
                                          />
                                        )}
                                      </div>
                                    )}
                                    <h1 className=" text-sm 2xl:text-lg text-zinc-400 mt-1 tracking-wide">
                                      Order ID: {item?._id}
                                    </h1>
                                  </div>
                                </div>

                                <div className=" border-b md:border-l border-zinc-700 h-24 mt-8" />

                                <div className="flex flex-col gap-2 mt-5 pr-5">
                                  <h1 className="text-center font-medium text-lg">
                                    Status
                                  </h1>
                                  <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                      <p className="text-sm 2xl:text-lg">
                                        From{" "}
                                        {location === "history"
                                          ? "You"
                                          : "Buyer"}
                                        :
                                      </p>
                                      {item?.buyerOk ? (
                                        <div className="flex items-center px-[5px] 2xl:px-[10px] py-[2px] bg-green-600 rounded-full">
                                          <p className="text-xs 2xl:text-base text-white">
                                            Received
                                          </p>
                                        </div>
                                      ) : (
                                        <>
                                          {location === "admin" &&
                                          item?.status === "pending" ? (
                                            <div className="flex items-center px-[5px] py-[2px] bg-yellow-500 rounded-full">
                                              <p className="text-xs 2xl:text-base">
                                                Pending
                                              </p>
                                            </div>
                                          ) : location === "orders" &&
                                            item?.status === "pending" ? (
                                            <div className="flex items-center px-[5px] py-[2px] bg-yellow-500 rounded-full">
                                              <p className="text-xs 2xl:text-base">
                                                Pending
                                              </p>
                                            </div>
                                          ) : item?.status === "rejected" ? (
                                            <div className="flex items-center px-[5px] py-[2px] bg-red-500 rounded-full">
                                              <p className="text-xs 2xl:text-base">
                                                Rejected
                                              </p>
                                            </div>
                                          ) : (
                                            <div className="ml-4 flex items-center gap-1">
                                              <div
                                                onClick={() =>
                                                  document
                                                    .getElementById(
                                                      "received_confirm_modal"
                                                    )
                                                    .showModal()
                                                }
                                                className="tooltip tooltip-accent tooltip-top"
                                                data-tip="Received"
                                              >
                                                <button className="">
                                                  <IoCheckmarkDoneCircleOutline className="w-7 h-7 text-subMain -mb-1" />
                                                </button>
                                              </div>

                                              {/* received confirm modal  */}
                                              <dialog
                                                id="received_confirm_modal"
                                                className="modal"
                                              >
                                                <div className="modal-box bg-dry">
                                                  <div className="flex flex-col items-center justify-between gap-4">
                                                    <h3 className="font-bold text-lg 2xl:text-2xl">
                                                      Are you sure?
                                                    </h3>
                                                    <p className="text-center text-sm 2xl:text-base text-zinc-400">
                                                      Once you mark this order
                                                      as received, you can not
                                                      change it & if the seller
                                                      rejects your order you
                                                      will get the refund in
                                                      your wallet.
                                                    </p>
                                                    <div className="flex items-center gap-3">
                                                      <button
                                                        onClick={() =>
                                                          receiveOrder(
                                                            item?._id
                                                          )
                                                        }
                                                        className="w-32 h-8 text-sm 2xltext-base bg-subMain text-text text-center rounded-md"
                                                      >
                                                        {receiveOrderPending
                                                          ? "Please wait..."
                                                          : "Yes, Received"}
                                                      </button>
                                                      <ErrorResponseModal
                                                        id={
                                                          "received_order_error_modal"
                                                        }
                                                        message={
                                                          rejectOrderError?.message
                                                        }
                                                      />
                                                      <SuccessResponseModal
                                                        id={
                                                          "received_order_success_modal"
                                                        }
                                                        message={
                                                          "Order Received Successfully"
                                                        }
                                                      />
                                                      <button
                                                        onClick={() =>
                                                          document
                                                            .getElementById(
                                                              "received_confirm_modal"
                                                            )
                                                            .close()
                                                        }
                                                        className="w-20 h-8 text-sm 2xl:text-base bg-main/60 text-text rounded-md"
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
                                          )}
                                        </>
                                      )}
                                    </div>
                                    <div className="border-b border-zinc-700" />
                                    <div className="flex items-center gap-3">
                                      <p className="text-sm 2xl:text-lg">
                                        From{" "}
                                        {location === "orders"
                                          ? "You"
                                          : "Seller"}
                                        :
                                      </p>
                                      {item?.sellerOk ? (
                                        <div className="ml-[5px] flex items-center px-[5px] 2xl:px-[10px] py-[2px] bg-green-600 rounded-full">
                                          <p className="text-xs 2xl:text-base text-white">
                                            Delivered
                                          </p>
                                        </div>
                                      ) : item?.status === "rejected" ? (
                                        <div className="flex items-center px-[5px] py-[2px] bg-red-500 rounded-full">
                                          <p className="text-xs 2xl:text-base">
                                            Rejected
                                          </p>
                                        </div>
                                      ) : (
                                        <>
                                          {location === "orders" ? (
                                            <>
                                              <div className="ml-4 flex items-center gap-1">
                                                <div
                                                  onClick={() =>
                                                    document
                                                      .getElementById(
                                                        "rejecet_confirm_modal"
                                                      )
                                                      .showModal()
                                                  }
                                                  className="tooltip tooltip-accent tooltip-top"
                                                  data-tip="Rejected"
                                                >
                                                  <button className="">
                                                    <MdOutlineCancel className="w-7 h-7 text-red-600 -mb-1" />
                                                  </button>
                                                </div>
                                                <div
                                                  onClick={() =>
                                                    document
                                                      .getElementById(
                                                        `delivered_confirm_modal:${item?._id}`
                                                      )
                                                      .showModal()
                                                  }
                                                  className="tooltip tooltip-accent tooltip-top"
                                                  data-tip="Delivered"
                                                >
                                                  <button className="">
                                                    <IoCheckmarkDoneCircleOutline className="w-7 h-7 text-subMain -mb-1" />
                                                  </button>
                                                </div>
                                              </div>
                                              {/* rejecet confirm modal  */}
                                              <dialog
                                                id="rejecet_confirm_modal"
                                                className="modal"
                                              >
                                                <div className="modal-box bg-dry">
                                                  <div className="flex flex-col items-center justify-between gap-4">
                                                    <h3 className="font-bold text-lg 2xl:text-2xl">
                                                      Are you sure?
                                                    </h3>
                                                    <p className="text-center text-sm 2xl:text-base text-zinc-400">
                                                      Once you reject the order,
                                                      you will lose the amount
                                                      of this order from your
                                                      wallet.
                                                    </p>
                                                    <div className="flex items-center gap-3">
                                                      <button
                                                        onClick={() =>
                                                          rejectOrder(item?._id)
                                                        }
                                                        className="w-28 h-8 text-sm 2xl:text-base bg-red-600 text-text text-center rounded-md"
                                                      >
                                                        {rejectOrderPending
                                                          ? "Rejecting..."
                                                          : "Yes, Reject"}
                                                      </button>
                                                      <ErrorResponseModal
                                                        id={
                                                          "reject_order_error_modal"
                                                        }
                                                        message={
                                                          rejectOrderError?.message
                                                        }
                                                      />
                                                      <SuccessResponseModal
                                                        id={
                                                          "reject_order_success_modal"
                                                        }
                                                        message={
                                                          "Order Rejected Successfully"
                                                        }
                                                      />
                                                      <button
                                                        onClick={() =>
                                                          document
                                                            .getElementById(
                                                              "rejecet_confirm_modal"
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
                                              {/* delivered confirm modal  */}
                                              <dialog
                                                id={`delivered_confirm_modal:${item?._id}`}
                                                className="modal"
                                              >
                                                <div className="modal-box bg-dry">
                                                  <div className="flex flex-col items-center justify-between gap-4">
                                                    <h3 className="font-bold text-lg 2xl:text-2xl">
                                                      Are you sure?
                                                    </h3>
                                                    <p className="text-center text-sm 2xl:text-base text-zinc-400">
                                                      Once you mark this order
                                                      as delivered, you cannot
                                                      change it.
                                                    </p>
                                                    <div className="flex items-center gap-3">
                                                      <button
                                                        onClick={() =>
                                                          deliverOrder(
                                                            item?._id
                                                          )
                                                        }
                                                        className="w-32 h-8 text-sm 2xl:text-base bg-subMain text-text text-center rounded-md"
                                                      >
                                                        {deliverOrderPending
                                                          ? "Delivering..."
                                                          : "Yes, Deliver"}
                                                      </button>
                                                      <button
                                                        onClick={() =>
                                                          document
                                                            .getElementById(
                                                              `delivered_confirm_modal:${item?._id}`
                                                            )
                                                            .close()
                                                        }
                                                        className="w-20 h-8 text-sm bg-main/60 text-text rounded-md"
                                                      >
                                                        Cancel
                                                      </button>
                                                      <ErrorResponseModal
                                                        id={
                                                          "delivered_order_error_modal"
                                                        }
                                                        message={
                                                          deliverOrderError?.message
                                                        }
                                                      />
                                                      <SuccessResponseModal
                                                        id={
                                                          "delivered_order_success_modal"
                                                        }
                                                        message={
                                                          "Order Delivered Successfully"
                                                        }
                                                      />
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
                                            </>
                                          ) : (
                                            <div className="ml-[0px] flex items-center px-[5px] py-[2px] bg-yellow-500 rounded-full">
                                              <p className="text-xs 2xl:text-base text-text">
                                                Pending
                                              </p>
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </div>
                                    {/* force Delivered */}
                                    {(authUser?.role === "admin" ||
                                      authUser?.role === "owner") &&
                                      item?.status !== "delivered" &&
                                      location === "admin" &&
                                      item?.status !== "rejected" && (
                                        <button
                                          onClick={() =>
                                            document
                                              .getElementById(
                                                `force_confirm_modal${item?._id}`
                                              )
                                              .showModal()
                                          }
                                          className="w-full bg-subMain rounded-md h-9 text-sm flex items-center justify-center"
                                        >
                                          Force Delivered
                                        </button>
                                      )}
                                    {/* force confirm modal  */}
                                    <dialog
                                      id={`force_confirm_modal${item?._id}`}
                                      className="modal"
                                    >
                                      <div className="modal-box bg-dry">
                                        <div className="flex flex-col items-center justify-between gap-4">
                                          <h3 className="font-bold text-lg">
                                            Are you sure?
                                          </h3>
                                          <p className="text-center text-sm text-zinc-400">
                                            This is a critical situation. When
                                            the buyer does not approve the order
                                            but the seller delivered the item
                                            correctly.
                                          </p>
                                          <div className="flex items-center gap-3">
                                            <button
                                              onClick={() => {
                                                forceDelivered(item?._id);
                                              }}
                                              className="w-32 h-8 text-sm 2xl:text-base bg-subMain text-text rounded-md flex items-center justify-center"
                                            >
                                              {forceDeliveredPending
                                                ? "Processing..."
                                                : " Yes, All Done"}
                                            </button>
                                            <ErrorResponseModal
                                              id={"force_delivered_error_modal"}
                                              message={
                                                forceDeliveredError?.message
                                              }
                                            />

                                            <button
                                              onClick={() =>
                                                document
                                                  .getElementById(
                                                    `force_confirm_modal${item?._id}`
                                                  )
                                                  .close()
                                              }
                                              className="w-20 h-8 text-sm 2xl:text-base bg-main/60 text-text rounded-md"
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
                              <p className="text-center font-medium text-lg mt-5">
                                In-Game Username:{" "}
                                <span className="text-subMain">
                                  {item?.gameUsername}
                                </span>
                              </p>
                              {location === "orders" && (
                                <p className="text-center mt-5 text-sm 2xl:text-base text-zinc-400">
                                  You can withdraw the amount after the buyer
                                  approves the order. <br /> If the buyer does
                                  not approve the order, you can contact us on
                                  Telegram with all the proofs.
                                </p>
                              )}
                            </div>
                            <form method="dialog" className="modal-backdrop">
                              <button>close</button>
                            </form>
                          </dialog>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </>
            )}
          </tbody>
        </table>
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

export default OrdersTable;
