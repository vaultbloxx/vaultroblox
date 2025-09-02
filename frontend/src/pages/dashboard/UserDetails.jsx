import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import DashSidebar from "../../components/layout/DashSidebar";
import Loader from "../../components/utils/Loader";
import { FaRegCircleUser } from "react-icons/fa6";
import { LuNotebookText } from "react-icons/lu";
import { RiAccountPinBoxLine } from "react-icons/ri";
import { VscVerifiedFilled } from "react-icons/vsc";
import { GoTrash } from "react-icons/go";
import { Link, useParams, useNavigate } from "react-router-dom";
import { BiSolidError } from "react-icons/bi";
import ErrorResponseModal from "../../components/utils/ErrorResponseModal";
import { BsCheckCircleFill } from "react-icons/bs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IoCopyOutline, IoCheckmarkOutline } from "react-icons/io5";
import { FiltersProvider } from "../../context/FiltersContext";

function UserDetails() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [copiedState, setCopiedState] = useState({});

  const handleCopy = (accountId, field, value) => {
    if (value) {
      navigator.clipboard.writeText(value);
      setCopiedState((prev) => ({ ...prev, [accountId]: field }));

      // Reset copied state after 5 seconds
      setTimeout(() => {
        setCopiedState((prev) => ({ ...prev, [accountId]: null }));
      }, 5000);
    }
  };

  //---------------------------------get user info start----------------
  const { userId } = useParams();
  const { data: userInfo, isLoading: userInfoLoading } = useQuery({
    queryKey: ["userInfo", userId],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/rumman/v1/admin/get-user-info/${userId}`);
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
  //---------------------------------get user info end----------------

  //---------------------------------get all account start----------------
  const { data: accounts, isLoading: isAccountsLoading } = useQuery({
    queryKey: ["accounts", userId],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/rumman/v1/seller/accounts/${userId}`);
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
  //---------------------------------get all account end----------------

  //---------------------------------delete user start----------------
  const {
    mutate: deleteUser,
    isPending: isDeletePending,
    error: deleteUserError,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/rumman/v1/seller/delete-user/${userId}`, {
          method: "DELETE",
        });
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
      document.getElementById("delete_user_error_modal").showModal();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });

      navigate("/users", { replace: true });
    },
  });
  //---------------------------------delete user end----------------

  //---------------------------------mark verified account start----------------
  const {
    mutate: markVerifiedAccount,
    isPending: isMarkVerifiedPending,
    error: markVerifiedError,
  } = useMutation({
    mutationFn: async (accountId) => {
      try {
        const res = await fetch(
          `/api/rumman/v1/admin/change-verified/${userId}`,
          {
            method: "PUT",
          }
        );
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userInfo", userId] });
    },
  });
  //---------------------------------mark verified account end----------------

  //---------------------------------delete account start

  const {
    mutate: deleteAccount,
    isLoading: isDeleteAccountLoading,
    error: deleteAccountError,
  } = useMutation({
    mutationFn: async (accountId) => {
      try {
        const res = await fetch(
          `/api/rumman/v1/seller/delete-account/${accountId}`,
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
      document.getElementById("admin_delete_account_success_modal").showModal();

      queryClient.invalidateQueries({ queryKey: ["accounts", userId] });
    },
    onError: (error) => {
      console.log(error);
      document.getElementById("admin_delete_account_error_modal").showModal();
    },
  });

  //---------------------------------delete account end

  return (
    <FiltersProvider>
      <Layout>
        <div className="pb-20  lg:pb-0 bg-main min-h-screen text-dryGray pt-10 lg:pt-16">
          <div className="container mx-auto px-2">
            <div className="md:grid grid-cols-12 gap-12 pt-10">
              <div className="col-span-3 relative  hidden lg:block">
                <DashSidebar />
              </div>
              <div className="col-span-9">
                {userInfoLoading || isAccountsLoading ? (
                  <div className=" flex items-center justify-center h-96">
                    <Loader />
                  </div>
                ) : (
                  <div className=" w-full">
                    <div className="w-full p-5 bg-dry rounded-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                        {/* User Info */}
                        <div className="col-span-1 md:col-span-4">
                          <h1 className="text-sm 2xl:text-lg text-zinc-400 font-medium">
                            User Info
                          </h1>
                          <div className="flex items-center gap-3 mt-4">
                            <FaRegCircleUser className="w-10 h-10 2xl:size-16 text-subMain" />
                            <div>
                              <div className="flex items-center gap-2">
                                <h1 className="leading-4 text-lg 2xl:text-2xl text-zinc-100 font-medium">
                                  {userInfo?.username}
                                </h1>
                                {userInfo?.verified && (
                                  <VscVerifiedFilled className="w-5 h-5 2xl:size-6 text-subMain" />
                                )}
                              </div>
                              <p className="text-sm 2xl:text-xl text-zinc-400">
                                {userInfo?.email}
                              </p>
                              <p className="text-sm 2xl:text-lg text-zinc-400">
                                <span className="text-sm 2xl:text-lg text-zinc-400 font-medium">
                                  User ID:
                                </span>{" "}
                                {userInfo?._id}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Statistics & Actions in a Row */}
                        <div className="col-span-1 md:col-span-3 flex flex-wrap md:flex-nowrap gap-5 md:pl-5 border-t md:border-t-0 md:border-l border-zinc-700 pt-3 md:pt-0">
                          {/* Statistics */}
                          <div className="flex-1">
                            <h1 className="text-sm 2xl:text-lg text-zinc-400 font-medium">
                              Statistics
                            </h1>
                            <div>
                              <p className="mt-1 ml-1">
                                {userInfo?.completed_order}
                              </p>
                              <div className="flex items-center gap-2">
                                <LuNotebookText className="w-4 h-4 2xl:size-5 text-subMain" />
                                <p className="text-sm 2xl:text-lg text-zinc-400">
                                  Completed Order
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="mt-1 ml-1">{userInfo?.account}</p>
                              <div className="flex items-center gap-2">
                                <RiAccountPinBoxLine className="w-4 h-4 2xl:size-5 text-subMain" />
                                <p className="text-sm 2xl:text-lg text-zinc-400">
                                  Added Account
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Action */}
                          <div className="flex-1 pl-5 border-l border-zinc-700">
                            <h1 className="text-sm 2xl:text-lg text-zinc-400 font-medium">
                              Action
                            </h1>
                            <div className="flex items-center gap-3 mt-2">
                              <div
                                className="tooltip tooltip-accent"
                                data-tip={`Mark as ${
                                  userInfo?.verified ? "Unverified" : "Verified"
                                }`}
                              >
                                <button
                                  onClick={() => {
                                    markVerifiedAccount();
                                  }}
                                  className="w-7 h-7 2xl:size-8 flex items-center justify-center rounded-md bg-subMain"
                                >
                                  {isMarkVerifiedPending ? (
                                    <Loader />
                                  ) : (
                                    <VscVerifiedFilled className="text-white 2xl:size-6" />
                                  )}
                                </button>
                                <ErrorResponseModal
                                  id={"mark_verified_error_modal"}
                                  message={markVerifiedError?.message}
                                />
                              </div>
                              <div
                                className="tooltip tooltip-accent"
                                data-tip="Delete This User"
                              >
                                <button
                                  onClick={() =>
                                    document
                                      .getElementById("delete_user_modal")
                                      .showModal()
                                  }
                                  className="w-7 h-7 2xl:size-8 flex items-center justify-center rounded-md bg-red-600"
                                >
                                  <GoTrash className="text-white 2xl:size-5" />
                                </button>

                                {/* Delete Confirm Modal */}
                                <dialog
                                  id="delete_user_modal"
                                  className="modal"
                                >
                                  <div className="modal-box bg-dry">
                                    <div className="flex flex-col items-center justify-between gap-4">
                                      <h3 className="font-bold text-lg">
                                        Are you sure?
                                      </h3>
                                      <p className="text-center text-sm text-zinc-400">
                                        Do you want to delete this user?
                                      </p>
                                      <div className="flex items-center gap-3">
                                        <button
                                          disabled={isDeletePending}
                                          onClick={() => {
                                            deleteUser();
                                          }}
                                          className="w-32 h-8 text-sm flex items-center justify-center bg-red-600 text-text rounded-md"
                                        >
                                          {isDeletePending ? (
                                            <Loader />
                                          ) : (
                                            "Yes, Delete"
                                          )}
                                        </button>
                                        <ErrorResponseModal
                                          id={"delete_user_error_modal"}
                                          message={deleteUserError?.message}
                                        />
                                        <button
                                          onClick={() =>
                                            document
                                              .getElementById(
                                                "delete_user_modal"
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
                        </div>
                      </div>
                    </div>

                    {/*------------------------ accounts -----------------------*/}
                    <div className=" w-full flex items-center gap-2 my-5">
                      <div className=" w-full border-t border-zinc-700"></div>
                      <h1 className=" leading-none -mt-1 text-sm 2xl:text-lg text-zinc-400 font-medium">
                        Accounts
                      </h1>
                      <div className=" w-full border-t border-zinc-700"></div>
                    </div>

                    <div className=" w-full grid grid-cols-1 md:grid-cols-3 gap-3 relative">
                      {accounts?.length === 0 ? (
                        <div className=" absolute inset-0 flex items-center justify-center h-40 text-zinc-400">
                          No Account Found
                        </div>
                      ) : (
                        accounts?.map((account) => (
                          <div key={account?._id}>
                            <div className=" relative w-full h-full bg-dry px-3 py-4 rounded-md">
                              {/* delete account button  */}
                              <div
                                onClick={() =>
                                  document
                                    .getElementById(
                                      "admin_delete_account_confirm_modal"
                                    )
                                    .showModal()
                                }
                                className=" absolute top-2 right-3 cursor-pointer font-bold text-lg opacity-60"
                              >
                                X
                              </div>
                              {/* delete account confirm modal */}
                              <dialog
                                id="admin_delete_account_confirm_modal"
                                className="modal"
                              >
                                <div className="modal-box bg-lightDark text-text">
                                  <div className=" flex flex-col items-center justify-center py-4">
                                    <BiSolidError className=" w-20 h-20 text-red-600 mb-4" />
                                    <p className="py-4">
                                      Are you sure you want to delete this
                                      account?
                                    </p>
                                  </div>
                                  <div className="modal-action">
                                    {/* if there is a button in form, it will close the modal */}
                                    <button
                                      onClick={() => {
                                        deleteAccount(account?._id);
                                        document
                                          .getElementById(
                                            "admin_delete_account_success_modal"
                                          )
                                          .showModal();
                                      }}
                                      className=" w-full h-10 bg-red-600 hover:bg-red-600/90 text-text rounded-md font-medium"
                                    >
                                      Yes, Delete
                                    </button>

                                    <button
                                      onClick={() => {
                                        document
                                          .getElementById(
                                            "admin_delete_account_confirm_modal"
                                          )
                                          .close();
                                      }}
                                      className=" w-full h-10 bg-zinc-600 hover:bg-zinc-600/90 text-text rounded-md font-medium"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </dialog>
                              <ErrorResponseModal
                                id={"admin_delete_account_error_modal"}
                                message={deleteAccountError?.message}
                              />
                              {/* delete account success modal */}
                              <dialog
                                id="admin_delete_account_success_modal"
                                className="modal"
                              >
                                <div className="modal-box bg-lightDark text-text">
                                  <div className=" flex flex-col items-center justify-center py-10">
                                    {isDeleteAccountLoading ? (
                                      <Loader />
                                    ) : (
                                      <BsCheckCircleFill className=" w-20 h-20 text-green-600 mb-4" />
                                    )}
                                    {isDeleteAccountLoading ? (
                                      <p className="py-4">
                                        Deleting account...
                                      </p>
                                    ) : (
                                      <p className="py-4">
                                        Account deleted successfully
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <form
                                  method="dialog"
                                  className="modal-backdrop"
                                >
                                  <button>close</button>
                                </form>
                              </dialog>

                              <div className=" w-full h-1/3">
                                <div className="flex items-center gap-2">
                                  <div className=" border-2 border-subMain w-16 h-16 rounded-full overflow-hidden">
                                    <img
                                      src={account?.image}
                                      alt={account?.name}
                                      className=" w-full h-full object-cover rounded-full"
                                    />
                                  </div>
                                  <p className=" truncate w-44 2xl:text-xl">
                                    {account?.name}
                                  </p>
                                </div>
                              </div>
                              <div className=" w-full mt-2 grid grid-cols-2 gap-2">
                                {/*-------------------------------------- view listings start  */}
                                <Link
                                  to={`/listings/${account?._id}`}
                                  disabled={!account?.isRobloxTwoFactor}
                                  className={`${
                                    !account?.isRobloxTwoFactor &&
                                    "opacity-60 cursor-not-allowed"
                                  } h-7 2xl:h-9 text-sm 2xl:text-lg text-white bg-subMain hover:bg-subMain/90  rounded-md flex items-center justify-center`}
                                >
                                  View Listings
                                </Link>
                                {/*-------------------------------------- view listings end  */}

                                {/*-------------------------------------- list item start  */}
                                <Link
                                  to={`/list/${account?.playerId}`}
                                  disabled={!account?.isRobloxTwoFactor}
                                  className={` ${
                                    !account?.isRobloxTwoFactor &&
                                    "opacity-60 cursor-not-allowed"
                                  } col-span-1 2xl:h-9 text-sm 2xl:text-lg text-white bg-subMain hover:bg-subMain/90 rounded-md flex items-center justify-center`}
                                >
                                  View Limiteds
                                </Link>
                                {/*-------------------------------------- list item end  */}
                              </div>
                              {/* 2FA Key Section */}
                              <div className="px-1 mt-1">
                                <p className="text-xs 2xl:text-base">2FA Key</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <div className="w-full truncate px-2 py-1 rounded-md bg-zinc-800 border border-zinc-600">
                                    <p className="text-xs 2xl:text-base truncate">
                                      {account?.temp_robloxTwoFactor}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleCopy(
                                        account._id,
                                        "2FA",
                                        account?.temp_robloxTwoFactor
                                      )
                                    }
                                    className="text-white"
                                  >
                                    {copiedState[account._id] === "2FA" ? (
                                      <IoCheckmarkOutline className="w-5 h-5 text-green-500" />
                                    ) : (
                                      <IoCopyOutline className="w-5 h-5" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Cookie Section */}
                              <div className="px-1 mt-1 pb-3 2xl:pb-5">
                                <p className="text-xs 2xl:text-base">Cookie</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <div className="w-full truncate px-2 py-1 rounded-md bg-zinc-800 border border-zinc-600">
                                    <p className="text-xs 2xl:text-base truncate">
                                      {account?.robloxSecurity}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleCopy(
                                        account._id,
                                        "cookie",
                                        account?.robloxSecurity
                                      )
                                    }
                                    className="text-white"
                                  >
                                    {copiedState[account._id] === "cookie" ? (
                                      <IoCheckmarkOutline className="w-5 h-5  text-green-500" />
                                    ) : (
                                      <IoCopyOutline className="w-5 h-5" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </FiltersProvider>
  );
}

export default UserDetails;
