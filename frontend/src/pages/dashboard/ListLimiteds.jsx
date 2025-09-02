import { useState } from "react";
import Layout from "../../components/layout/Layout";
import DashSidebar from "../../components/layout/DashSidebar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SuccessResponseModal from "../../components/utils/SuccessResponseModal";
import ErrorResponseModal from "../../components/utils/ErrorResponseModal";
import Loader from "../../components/utils/Loader";
import { BiSolidError } from "react-icons/bi";
import { BsCheckCircleFill } from "react-icons/bs";
import {
  TbCircleNumber1Filled,
  TbCircleNumber2Filled,
  TbCircleNumber3Filled,
} from "react-icons/tb";
import { Link } from "react-router-dom";
import { FiltersProvider } from "../../context/FiltersContext";

const ListLimiteds = ({ authUser }) => {
  const queryClient = useQueryClient();

  //---------------------------------get account start
  const { data: accounts, isLoading: isAccountsLoading } = useQuery({
    queryKey: ["accounts", authUser?._id],
    queryFn: async () => {
      try {
        const res = await fetch(
          `/api/rumman/v1/seller/accounts/${authUser?._id}`
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
  });

  //---------------------------------get account end

  //---------------------------------add account start

  const [robloxSecurity, setRobloxSecurity] = useState("");

  const {
    mutate: addAccountMutation,
    isPending: isAddAccountPending,
    error: addAccountError,
    isError: isAddAccountError,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/rumman/v1/seller/add-account", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ robloxSecurity }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "An unknown error occurred");
        }
        console.log(data);

        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      document.getElementById("addAccount_success_modal").showModal();
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      setRobloxSecurity("");
    },
    onError: (error) => {
      console.log(error);
      document.getElementById("addAccount_error_modal").showModal();
    },
  });

  //---------------------------------add account end

  //---------------------------------delete account start

  const { mutate: deleteAccount, isLoading: isDeleteAccountLoading } =
    useMutation({
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
        document.getElementById("delete_account_success_modal").showModal();
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
      },
      onError: (error) => {
        console.log(error);
        document.getElementById("delete_account_error_modal").showModal();
      },
    });

  //---------------------------------delete account end

  //---------------------------------auto 2fa start
  const [qr, setQr] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");

  const { mutate: getAuto2FaQr, isLoading: isGetAuto2FaQrLoading } =
    useMutation({
      mutationFn: async (accountId) => {
        try {
          const res = await fetch(
            `/api/rumman/v1/seller/autofa-qr/${accountId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ secret }),
            }
          );
          const data = await res.json();
          if (!res.ok) {
            console.log(data);
            throw new Error(data.error || "An unknown error occurred");
          }
          setQr(data?.qr);
          return data;
        } catch (error) {
          throw error;
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
      },
    });

  const {
    mutate: setAuto2Fa,
    isLoading: isSetAuto2FaLoading,
    error: setAuto2FaError,
  } = useMutation({
    mutationFn: async (accountId) => {
      try {
        const res = await fetch(
          `/api/rumman/v1/seller/set-autofa/${accountId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code, robloxSecurity }),
          }
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "An unknown error occurred");
        }
        console.log(data);

        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      document.getElementById("set_autofa_success_modal").showModal();
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      setCode("");
      setRobloxSecurity("");
      window.location.reload();
    },
    onError: (error) => {
      console.log(error);
      document.getElementById("set_autofa_error_modal").showModal();
    },
  });

  //---------------------------------auto 2fa end

  //---------------------------------update cookie start

  const {
    mutate: updateCookie,
    isPending: isUpdateCookiePending,
    error: updateCookieError,
  } = useMutation({
    mutationFn: async (accountId) => {
      try {
        const res = await fetch(
          `/api/rumman/v1/seller/update-cookie/${accountId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ robloxSecurity }),
          }
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "An unknown error occurred");
        }
        console.log(data);

        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      document.getElementById("addAccount_success_modal").showModal();
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      setRobloxSecurity("");
      window.location.reload();
    },
    onError: (error) => {
      console.log(error);
      document.getElementById("addAccount_error_modal").showModal();
    },
  });

  //---------------------------------update cookie end

  return (
    <FiltersProvider>
      <Layout>
        <div className="pb-20  lg:pb-0 bg-main min-h-screen text-dryGray pt-10 lg:pt-16">
          <div className=" container mx-auto px-2">
            <div className=" md:grid grid-cols-12 gap-12 pt-10">
              <div className=" col-span-3 relative  hidden lg:block">
                <DashSidebar />
              </div>
              <div className=" col-span-9">
                <div className=" w-full p-5 bg-dry rounded-md">
                  <div className="  flex items-center gap-4 justify-between">
                    <div>
                      <h1 className=" text-lg 2xl:text-xl font-medium text-zinc-200">
                        List Limited
                      </h1>
                      <p className=" text-sm 2xl:text-lg text-zinc-400">
                        List your limiteds to sell on our marketplace.
                      </p>
                    </div>
                  </div>

                  {/*-------------------------- add account fields start  */}

                  <div className=" mt-4">
                    <div className=" w-full flex items-center gap-4">
                      <button
                        onClick={() =>
                          document
                            .getElementById("roblox_set_security_modal")
                            .showModal()
                        }
                        className=" w-full bg-subMain hover:bg-subMain/90 py-2 px-4 rounded-md flex items-center justify-center"
                      >
                        <p className=" text-sm 2xl:text-lg  text-white">
                          Add Account +
                        </p>
                      </button>
                      {/* dialog for add account */}
                      <dialog
                        id="roblox_set_security_modal"
                        className="modal modal-bottom sm:modal-middle"
                      >
                        <div className="modal-box bg-dry text-dryGray">
                          <div>
                            <div className=" w-full">
                              <p className=" font-semibold text-lg 2xl:text-2xl text-center">
                                Add Account
                              </p>
                            </div>
                            <div className=" mt-3 w-full flex items-center  flex-col gap-3">
                              <p className=" text-sm 2xl:text-lg opacity-70 font-medium text-center">
                                We require your cookie to allow you to list all
                                of your items on site!
                              </p>
                            </div>
                            <div className=" flex flex-col gap-3 mt-3 -mb-2">
                              <form
                                className=" w-full"
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  addAccountMutation();
                                }}
                              >
                                <textarea
                                  placeholder=".ROBLOSECURITY"
                                  required
                                  disabled={isAddAccountPending}
                                  value={robloxSecurity}
                                  onInput={(e) => {
                                    const sanitizedValue =
                                      e.target.value.replace(/\s/g, ""); // Remove spaces
                                    setRobloxSecurity(sanitizedValue);
                                  }}
                                  className=" text-sm 2xl:text-lg w-full bg-main rounded-md p-3 h-20 2xl:h-28 outline-none border-zinc-700 border"
                                ></textarea>
                                <button
                                  disabled={isAddAccountPending}
                                  className=" float-end w-14 md:w-28 mt-2 bg-subMain hover:bg-subMain/90 py-2 rounded-md 2xl:text-lg"
                                >
                                  Add
                                </button>
                              </form>
                              <SuccessResponseModal
                                id={"addAccount_success_modal"}
                                message={"Account Added Successfully"}
                              />
                              <ErrorResponseModal
                                id={"addAccount_error_modal"}
                                message={addAccountError?.message}
                              />
                            </div>
                          </div>
                          <div className="modal-action">
                            <form
                              method="dialog"
                              className=" flex items-center gap-4"
                            >
                              {/* if there is a button in form, it will close the modal */}

                              <button className=" w-14  md:w-28 py-2 border border-lightDark rounded-md 2xl:text-lg">
                                Cancel
                              </button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  </div>

                  {/*-------------------------- add account fields end  */}

                  {/* all accounts start-------------------------------- */}
                  {isAccountsLoading ? (
                    <div className=" mt-4 flex items-center justify-center h-40">
                      <Loader />
                    </div>
                  ) : accounts?.length === 0 ? (
                    <div className=" mt-4 flex items-center justify-center h-40">
                      No accounts found
                    </div>
                  ) : (
                    <>
                      <h1 className=" mt-4 text-lg font-medium text-zinc-200">
                        Accounts
                      </h1>
                      <div className=" border-b border-zinc-600 mt-2" />
                      <div className=" mt-4 grid grid-cols-1 lg:grid-cols-3  gap-3">
                        {accounts?.map((account) => (
                          <div key={account?._id}>
                            <div className=" relative w-full h-40 bg-lightDark p-2 rounded-md">
                              {/* delete account button  */}
                              <div
                                onClick={() =>
                                  document
                                    .getElementById(
                                      "delete_account_confirm_modal"
                                    )
                                    .showModal()
                                }
                                className=" absolute top-2 right-3 cursor-pointer font-bold text-lg opacity-60"
                              >
                                X
                              </div>
                              {/* delete account confirm modal */}
                              <dialog
                                id="delete_account_confirm_modal"
                                className="modal"
                              >
                                <div className="modal-box bg-lightDark text-text">
                                  <div className=" flex flex-col items-center justify-center py-4">
                                    <BiSolidError className=" w-20 h-20 text-red-600 mb-4" />
                                    <p className="py-4 2xl:text-lg">
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
                                            "delete_account_success_modal"
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
                                            "delete_account_confirm_modal"
                                          )
                                          .close();
                                      }}
                                      className=" w-full h-10 bg-zinc-600 hover:bg-zinc-700 text-text rounded-md font-medium"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </dialog>
                              <ErrorResponseModal
                                id={"delete_account_error_modal"}
                                message={"Error deleting account"}
                              />
                              {/* delete account success modal */}
                              <dialog
                                id="delete_account_success_modal"
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

                              <div className=" w-full h-1/2">
                                <div className="flex items-center gap-2">
                                  <div className=" border-2 border-subMain w-16 h-16 rounded-full overflow-hidden">
                                    <img
                                      src={account?.image}
                                      alt={account?.name}
                                      className=" w-full h-full object-cover rounded-full"
                                    />
                                  </div>
                                  <p className=" truncate w-44 2xl:text-lg font-medium">
                                    {account?.name}
                                  </p>
                                </div>
                              </div>
                              {!account?.isRobloxSecurity ? (
                                <div className=" w-full h-1/2 flex items-center justify-center">
                                  <button
                                    onClick={() =>
                                      document
                                        .getElementById(
                                          "roblox_update_cookie_modal"
                                        )
                                        .showModal()
                                    }
                                    className=" px-5 2xl:text-lg py-2 border bg-subMain hover:bg-subMain/90 text-main text-sm border-lightDark rounded-md"
                                  >
                                    Update Cookie
                                  </button>
                                  {/* dialog for update cookie */}
                                  <dialog
                                    id="roblox_update_cookie_modal"
                                    className="modal modal-bottom sm:modal-middle"
                                  >
                                    <div className="modal-box bg-dry text-dryGray">
                                      <div>
                                        <div className=" w-full">
                                          <p className=" font-semibold text-lg 2xl:text-xl text-center">
                                            Update Cookie
                                          </p>
                                        </div>
                                        <div className=" mt-4 w-full flex items-center flex-col gap-3">
                                          <p className=" text-sm 2xl:text-base opacity-70 font-medium text-center">
                                            We require your cookie to allow you
                                            to list all of your items on site!
                                          </p>
                                        </div>
                                        <div className=" flex flex-col gap-3 mt-3 -mb-2">
                                          <form
                                            className=" w-full"
                                            onSubmit={(e) => {
                                              e.preventDefault();
                                              updateCookie(account?._id);
                                            }}
                                          >
                                            <textarea
                                              placeholder=".ROBLOSECURITY"
                                              required
                                              disabled={isUpdateCookiePending}
                                              value={robloxSecurity}
                                              onInput={(e) => {
                                                const sanitizedValue =
                                                  e.target.value.replace(
                                                    /\s/g,
                                                    ""
                                                  ); // Remove spaces
                                                setRobloxSecurity(
                                                  sanitizedValue
                                                );
                                              }}
                                              className=" text-sm 2xl:text-base w-full bg-main rounded-md p-3 h-20 outline-none border-zinc-700 border"
                                            ></textarea>
                                            <button
                                              disabled={isUpdateCookiePending}
                                              className=" float-end w-24 2xl:text-lg mt-2 bg-subMain hover:bg-subMain/90 py-2 rounded-md"
                                            >
                                              Update
                                            </button>
                                          </form>
                                          <SuccessResponseModal
                                            id={"addAccount_success_modal"}
                                            message={
                                              "Account Added Successfully"
                                            }
                                          />
                                          <ErrorResponseModal
                                            id={"addAccount_error_modal"}
                                            message={updateCookieError?.message}
                                          />
                                        </div>
                                      </div>
                                      <div className="modal-action">
                                        <form
                                          method="dialog"
                                          className=" flex items-center gap-4"
                                        >
                                          {/* if there is a button in form, it will close the modal */}

                                          <button className="2xl:text-lg px-5 py-2 border border-lightDark rounded-md">
                                            Cancle
                                          </button>
                                        </form>
                                      </div>
                                    </div>
                                  </dialog>
                                </div>
                              ) : (
                                <div className=" w-full mt-1 grid grid-cols-2 gap-2">
                                  {/*-------------------------------------- edit auto 2FA start  */}
                                  <button
                                    onClick={() =>
                                      document
                                        .getElementById(
                                          `roblox_auto_2fa_modal_1:${account?._id}`
                                        )
                                        .showModal()
                                    }
                                    className=" h-7 2xl:h-9 text-white text-sm 2xl:text-lg bg-subMain hover:bg-subMain/90 rounded-md"
                                  >
                                    Edit Auto 2FA
                                  </button>

                                  {/* 2fa modal one  */}
                                  <dialog
                                    id={`roblox_auto_2fa_modal_1:${account?._id}`}
                                    className="modal modal-bottom sm:modal-middle"
                                  >
                                    <div className="modal-box bg-dry text-dryGray">
                                      <div>
                                        <div className=" w-full">
                                          <p className=" font-semibold text-lg 2xl:text-xl text-center">
                                            Auto 2FA Quick Setup
                                          </p>
                                        </div>

                                        <div className=" w-full h-full py-3">
                                          <video
                                            src="https://i.gyazo.com/a4dca974e9994fb28a3c4404061bb120.mp4"
                                            muted
                                            autoPlay
                                            loop
                                            className=" w-full h-full"
                                          ></video>
                                        </div>

                                        <div className=" mt-4 w-full flex items-center flex-col gap-3">
                                          <div className=" w-full flex items-start gap-2">
                                            <div className=" w-8 h-8">
                                              <TbCircleNumber1Filled className=" w-6 h-6 text-subMain" />
                                            </div>
                                            <a
                                              href="https://www.roblox.com/my/account#!/security"
                                              target="_blank"
                                              className=" text-sm 2xl:text-base leading-none underline hover:text-zinc-300"
                                            >
                                              On the website, head to the top
                                              right and click "Settings". Once
                                              you're on settings, click on
                                              "Security".
                                            </a>
                                          </div>
                                          <div className=" w-full flex  items-start gap-2">
                                            <div className=" w-8 h-8">
                                              <TbCircleNumber2Filled className=" w-6 h-6 text-subMain" />
                                            </div>
                                            <p className=" text-sm 2xl:text-base leading-4">
                                              Enable "Authenticator App (Very
                                              Secure)" and when a QR code pops
                                              up on your screen, choose the
                                              "Manual Entry" option.
                                            </p>
                                          </div>
                                          <div className=" w-full flex items-center gap-2">
                                            <TbCircleNumber3Filled className=" w-6 h-6 text-subMain" />
                                            <p className=" text-sm 2xl:text-base leading-none">
                                              Copy your manual entry key and
                                              submit it below.
                                            </p>
                                          </div>
                                          <input
                                            type="text"
                                            placeholder="Manual Key"
                                            disabled={isGetAuto2FaQrLoading}
                                            value={secret}
                                            onChange={(e) =>
                                              setSecret(e.target.value.trim())
                                            }
                                            className={`${
                                              isGetAuto2FaQrLoading &&
                                              "opacity-50 cursor-not-allowed"
                                            } w-full bg-main border 2xl:text-lg  border-zinc-700 py-2.5 px-4  mt-2 text-text outline-none text-sm rounded-md`}
                                          />
                                        </div>
                                      </div>
                                      <div className="modal-action">
                                        <form
                                          method="dialog"
                                          className=" flex items-center gap-4"
                                        >
                                          {/* if there is a button in form, it will close the modal */}
                                          <button
                                            disabled={
                                              isGetAuto2FaQrLoading || !secret
                                            }
                                            onClick={() => {
                                              getAuto2FaQr(account?._id); // Correct order
                                              document
                                                .getElementById(
                                                  `roblox_auto_2fa_modal_2:${account?._id}`
                                                )
                                                .showModal();
                                            }}
                                            className="px-5 2xl:text-lg py-2 border border-lightDark bg-lightDark rounded-md"
                                          >
                                            Next
                                          </button>
                                          <button className=" px-5 2xl:text-lg py-2 border border-lightDark rounded-md">
                                            Cancle
                                          </button>
                                        </form>
                                      </div>
                                    </div>
                                  </dialog>

                                  {/* 2fa modal two  */}
                                  <dialog
                                    id={`roblox_auto_2fa_modal_2:${account?._id}`}
                                    className="modal modal-bottom sm:modal-middle"
                                  >
                                    <div className="modal-box bg-dry text-dryGray no-scrollbar">
                                      <div>
                                        <div className=" w-full">
                                          <p className=" font-semibold text-lg text-center">
                                            Auto 2FA Quick Setup
                                          </p>
                                        </div>

                                        <div className=" mt-4 w-full flex items-center justify-center">
                                          <div className=" w-60 h-56 bg-white p-3">
                                            <img
                                              src={qr || ""}
                                              alt="Qr code"
                                              title="Qr code"
                                              className=" w-full h-full object-contain"
                                            />
                                          </div>
                                        </div>

                                        <div className=" py-5">
                                          <div className=" w-full flex items-center gap-2">
                                            <div className=" w-6 h-6">
                                              <TbCircleNumber1Filled className=" w-6 h-6 text-subMain" />
                                            </div>
                                            <p className=" text-sm leading-none">
                                              Scan the QR code above with your
                                              authenticator app.
                                            </p>
                                          </div>
                                          <div className=" mt-3 w-full flex items-center gap-2">
                                            <div className=" w-6 h-6">
                                              <TbCircleNumber2Filled className=" w-6 h-6 text-subMain" />
                                            </div>
                                            <p className=" text-sm leading-none">
                                              Complete your 2FA setup on the
                                              website using the code you
                                              received from your authenticator
                                              app.
                                            </p>
                                          </div>
                                          <div className=" mt-3 w-full flex items-center gap-2">
                                            <div className=" w-6 h-6">
                                              <TbCircleNumber1Filled className=" w-6 h-6 text-subMain" />
                                            </div>
                                            <p className=" text-sm leading-none">
                                              Enter the code you received from
                                              your authenticator app below.
                                            </p>
                                          </div>
                                          <div className=" mt-3 w-full flex items-center gap-2">
                                            <div className=" w-6 h-6">
                                              <TbCircleNumber1Filled className=" w-6 h-6 text-subMain" />
                                            </div>
                                            <p className=" text-sm leading-none">
                                              Enter your cookie in the "Cookie"
                                              field below.
                                            </p>
                                          </div>
                                        </div>

                                        <form
                                          onSubmit={(e) => {
                                            e.preventDefault();
                                            setAuto2Fa(account?._id);
                                          }}
                                          className=" flex flex-col items-center gap-3 mt-2"
                                        >
                                          <input
                                            type="text"
                                            placeholder="Code"
                                            disabled={isSetAuto2FaLoading}
                                            value={code}
                                            onChange={(e) =>
                                              setCode(e.target.value)
                                            }
                                            className={`${
                                              isSetAuto2FaLoading &&
                                              "opacity-50 cursor-not-allowed"
                                            } w-full bg-main border  border-zinc-700 py-2.5 px-4  text-text outline-none text-sm rounded-md`}
                                          />
                                          <input
                                            type="text"
                                            placeholder="Cookie"
                                            disabled={isSetAuto2FaLoading}
                                            value={robloxSecurity}
                                            onChange={(e) =>
                                              setRobloxSecurity(e.target.value)
                                            }
                                            className={`${
                                              isSetAuto2FaLoading &&
                                              "opacity-50 cursor-not-allowed"
                                            } w-full bg-main border  border-zinc-700 py-2.5 px-4  text-text outline-none text-sm rounded-md`}
                                          />
                                          <button
                                            type="submit"
                                            disabled={isSetAuto2FaLoading}
                                            className={`${
                                              isSetAuto2FaLoading &&
                                              "opacity-50 cursor-not-allowed"
                                            } cursor-pointer w-full h-[42px] border border-lightDark bg-lightDark rounded-md `}
                                          >
                                            {isSetAuto2FaLoading ? (
                                              <Loader />
                                            ) : (
                                              "Done"
                                            )}
                                          </button>
                                        </form>
                                      </div>

                                      {/* on error  */}
                                      <ErrorResponseModal
                                        id={"set_autofa_error_modal"}
                                        message={setAuto2FaError?.message}
                                      />

                                      {/* onSuccess  */}
                                      <SuccessResponseModal
                                        id={"set_autofa_success_modal"}
                                        message={
                                          "Auto Two factor is setup successfully. This is essential to trade automatically."
                                        }
                                      />
                                      <div className="modal-action">
                                        <form
                                          method="dialog"
                                          className=" flex items-center gap-4 w-full"
                                        >
                                          {/* if there is a button in form, it will close the modal */}

                                          <button
                                            onClick={() => {
                                              setQr("");
                                              setSecret("");
                                            }}
                                            className=" px-5 py-2 w-full border border-lightDark rounded-md"
                                          >
                                            Cancle
                                          </button>
                                        </form>
                                      </div>
                                    </div>
                                  </dialog>
                                  {/*-------------------------------------- edit auto 2FA end  */}

                                  {/*-------------------------------------- view listings start  */}

                                  <Link
                                    to={
                                      account?.isRobloxTwoFactor &&
                                      `/listings/${account?._id}`
                                    }
                                    className={`${
                                      !account?.isRobloxTwoFactor &&
                                      "opacity-60 cursor-not-allowed"
                                    } h-7 2xl:h-9 text-sm 2xl:text-lg bg-subMain hover:bg-subMain/90 text-white rounded-md flex items-center justify-center`}
                                  >
                                    View Listings
                                  </Link>

                                  {/*-------------------------------------- view listings end  */}

                                  {/*-------------------------------------- list item start  */}

                                  <Link
                                    to={
                                      account?.isRobloxTwoFactor &&
                                      `/list/${account?.playerId}`
                                    }
                                    className={` ${
                                      !account?.isRobloxTwoFactor &&
                                      "opacity-60 cursor-not-allowed"
                                    } col-span-2 h-7 2xl:h-9 text-sm 2xl:text-lg bg-subMain hover:bg-subMain/90 text-white rounded-md flex items-center justify-center`}
                                  >
                                    List Limited
                                  </Link>

                                  {/*-------------------------------------- list item end  */}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {/* all accounts end-------------------------------- */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </FiltersProvider>
  );
};

export default ListLimiteds;
