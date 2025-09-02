import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import { FaUserSecret } from "react-icons/fa6";
import { VscVerifiedFilled } from "react-icons/vsc";
import { FaBitcoin } from "react-icons/fa";
import { SiTether } from "react-icons/si";
import { SiLitecoin } from "react-icons/si";
import {
  TbCircleNumber1Filled,
  TbCircleNumber2Filled,
  TbCircleNumber3Filled,
  TbCircleNumber4Filled,
} from "react-icons/tb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BsCheckCircleFill } from "react-icons/bs";
import ErrorResponseModal from "../../components/utils/ErrorResponseModal";
import SuccessResponseModal from "../../components/utils/SuccessResponseModal";
import { FiltersProvider } from "../../context/FiltersContext";

const Settings = () => {
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  const queryClient = useQueryClient();

  //------------------------ change password functions

  const [cngPassData, setCngPassData] = useState({
    oldPass: "",
    newPass: "",
    confirmNewPass: "",
  });

  const validatePassFields =
    cngPassData.oldPass.length > 6 &&
    cngPassData.newPass.length > 6 &&
    cngPassData.confirmNewPass.length > 6;

  const handlePasswordInputChange = (e) => {
    setCngPassData({
      ...cngPassData,
      [e.target.name]: e.target.value,
    });
  };

  const {
    mutate: changePasswordMutation,
    isPending: changePasswordPending,
    error: changePasswordError,
    isError: isChangePasswordError,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/rumman/v1/auth/change-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cngPassData),
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
    onSuccess: (data) => {
      document.getElementById("passCng_success_modal").showModal();
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setCngPassData({
        oldPass: "",
        newPass: "",
        confirmNewPass: "",
      });
    },
    onError: (error) => {
      console.log(error);
      document.getElementById("passCng_error_modal").showModal();
      setCngPassData({
        oldPass: "",
        newPass: "",
        confirmNewPass: "",
      });
    },
  });

  //------------------------ change password functions end

  //------------------------ withdrawal management functions

  const [btcAddy, setBtcAddy] = useState("");
  const [ltcAddy, setLtcAddy] = useState("");
  const [usdtAddy, setUsdtAddy] = useState("");

  const {
    mutate: updateBtcAddy,
    error: updateBtcAddyError,
    isPending: updateBtcAddyPending,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/rumman/v1/user/update-btc-addy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            btcAddy,
          }),
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
    onSuccess: () => {
      document.getElementById("addy_update_success_modal").showModal();
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setBtcAddy("");
    },
    onError: (error) => {
      console.log(error);
      document.getElementById("addy_update_error_modal").showModal();
      setBtcAddy("");
    },
  });

  const {
    mutate: updateUsdtAddy,
    error: updateUsdtAddyError,
    isPending: updateUsdtAddyPending,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/rumman/v1/user/update-usdt-addy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usdtAddy,
          }),
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
    onSuccess: () => {
      document.getElementById("addy_update_success_modal").showModal();
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setUsdtAddy("");
    },
    onError: (error) => {
      console.log(error);
      document.getElementById("addy_update_error_modal").showModal();
      setUsdtAddy("");
    },
  });

  const {
    mutate: updateLtcAddy,
    error: updateLtcError,
    isPending: updateLtcAddyPending,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/rumman/v1/user/update-ltc-addy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ltcAddy,
          }),
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
    onSuccess: () => {
      document.getElementById("addy_update_success_modal").showModal();
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setLtcAddy("");
    },
    onError: (error) => {
      console.log(error);
      document.getElementById("addy_update_error_modal").showModal();
      setLtcAddy("");
    },
  });

  //------------------------ withdrawal management functions end

  //------------------------ 2FA functions start

  const [qr, setQr] = useState("");
  const [manual, setManual] = useState("");
  const [code, setCode] = useState("");

  const { mutate: qrImg } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/rumman/v1/user/two-factor-qr", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "An unknown error occurred");
        }

        const qr = data?.qr;
        setQr(qr);
        const manual = data?.manual;
        setManual(manual);

        return;
      } catch (error) {
        throw error;
      }
    },
  });

  const {
    mutate: setTwoFactor,
    isPending: setTwoFactorPending,
    error: twoFactorError,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/rumman/v1/user/set-two-factor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
          }),
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
    onSuccess: () => {
      document.getElementById("set_two_factor_success_modal").showModal();
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setCode("");
      window.location.reload();
    },
    onError: (error) => {
      console.log(error);
      document.getElementById("set_two_factor_error_modal").showModal();
      setCode("");
    },
  });

  //------------------------ 2FA functions start end

  return (
    <FiltersProvider>
      <Layout>
        <div className=" pb-20 lg:pb-0 w-full bg-main min-h-screen text-dryGray pt-10 md:pt-16">
          <div className=" container mx-auto md:px-16 px-2 md:mt-16 mt-8">
            <div className=" md:grid grid-cols-12 gap-4">
              {/* profile  */}
              <div className=" col-span-8 ">
                <div className=" w-full md:p-8 p-5 bg-dry rounded-md">
                  <h1 className=" text-xl font-semibold tracking-wide uppercase">
                    Profile
                  </h1>
                  <div className=" mt-5 flex items-center gap-5">
                    <div className=" md:w-32 md:h-32 w-24 h-24  rounded-full bg-dry border-4 border-main flex items-center justify-center">
                      <FaUserSecret className=" w-12 h-12 md:w-16 md:h-16 text-subMain" />
                    </div>
                    <div className=" flex flex-col gap-1">
                      <div className=" flex items-center gap-2">
                        <span className=" text-2xl font-medium">
                          {authUser?.username}
                        </span>
                        {authUser?.verified && (
                          <div
                            className="tooltip tooltip-accent tooltip-right"
                            data-tip="Trusted Seller"
                          >
                            <VscVerifiedFilled className=" text-[#ECBE07] w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <span className=" text-zinc-300">{authUser?.email}</span>
                    </div>
                  </div>

                  <div className=" mt-10">
                    <h2 className="">Shop URL</h2>
                    <p className=" text-zinc-400 text-sm">
                      Your shop is accessible at this URL
                    </p>
                    <a
                      href={`https://vault.limited/shop/${authUser?.username}`}
                      target="_blank"
                      className=" text-subMain"
                    >
                      https://vault.limited/shop/{authUser?.username}
                    </a>
                  </div>

                  {/*------------------------------ change password field ------------------------------ */}

                  <div className=" mt-6">
                    <h2 className=" text-xl">Change Password</h2>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        changePasswordMutation();
                      }}
                    >
                      <label>
                        <p className=" mt-2 text-zinc-300 text-sm">
                          Current Password *
                        </p>
                        <input
                          type="text"
                          disabled={changePasswordPending}
                          name="oldPass"
                          onChange={handlePasswordInputChange}
                          value={cngPassData.oldPass}
                          className={`${
                            changePasswordPending &&
                            "opacity-50 cursor-not-allowed"
                          } w-full bg-dry border mt-2 border-zinc-700 py-2 px-4  text-text outline-none text-sm rounded-md`}
                        />
                      </label>
                      <label>
                        <p className=" mt-2 text-zinc-300 text-sm">
                          New Password *
                        </p>
                        <input
                          disabled={changePasswordPending}
                          type="text"
                          name="newPass"
                          onChange={handlePasswordInputChange}
                          value={cngPassData.newPass}
                          className={`${
                            changePasswordPending &&
                            "opacity-50 cursor-not-allowed"
                          } w-full bg-dry border mt-2 border-zinc-700 py-2 px-4  text-text outline-none text-sm rounded-md`}
                        />
                      </label>
                      <label>
                        <p className=" mt-2 text-zinc-300 text-sm">
                          Confirm New Password *
                        </p>
                        <input
                          disabled={changePasswordPending}
                          type="text"
                          name="confirmNewPass"
                          onChange={handlePasswordInputChange}
                          value={cngPassData.confirmNewPass}
                          className={`${
                            changePasswordPending &&
                            "opacity-50 cursor-not-allowed"
                          } w-full bg-dry border mt-2 border-zinc-700 py-2 px-4  text-text outline-none text-sm rounded-md`}
                        />
                      </label>
                      <button
                        disabled={changePasswordPending || !validatePassFields}
                        className={`${
                          changePasswordPending &&
                          "opacity-50 cursor-not-allowed"
                        } mt-4 py-2 w-full bg-subMain hover:bg-subMain/90 transition rounded-md text-myWhite font-medium`}
                      >
                        Change Password
                      </button>
                    </form>
                  </div>
                  {/* if error */}
                  <ErrorResponseModal
                    id={"passCng_error_modal"}
                    message={changePasswordError?.message}
                  />

                  {/* if success */}
                  <SuccessResponseModal
                    id={"passCng_success_modal"}
                    message={"Password changed successfully"}
                  />

                  {/*------------------------------ change password field end ------------------------------ */}

                  {/*------------------------------ withdrawal management ------------------------------ */}

                  <div className=" mt-8">
                    <h2 className=" text-xl">Withdrawal Management</h2>
                    <p className=" text-zinc-400 text-sm">
                      Set up your withdrawal address here to receive your
                      withdrawal payments
                    </p>

                    {/* bTc addy  */}
                    <form
                      className=" mt-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        updateBtcAddy();
                      }}
                    >
                      <div className=" flex items-center gap-2">
                        <FaBitcoin className=" w-6 h-6 text-subMain" />
                        <p className=" font-medium mt-1">BTC Address</p>
                      </div>
                      <div className=" w-full flex items-center gap-3">
                        <input
                          disabled={updateBtcAddyPending}
                          type="text"
                          placeholder={
                            authUser?.btcAddy ? authUser?.btcAddy : "Address"
                          }
                          onChange={(e) => setBtcAddy(e.target.value)}
                          value={btcAddy}
                          className={`${
                            updateBtcAddyPending &&
                            "opacity-50 cursor-not-allowed"
                          } w-full bg-dry border mt-2 border-zinc-700 py-2 px-4  text-text outline-none text-sm rounded-md`}
                        />
                        <button
                          disabled={updateBtcAddyPending || !btcAddy}
                          className={`${
                            updateBtcAddyPending &&
                            "opacity-50 cursor-not-allowed"
                          } w-28 text-myWhite font-medium h-[38px] bg-subMain mt-1.5 rounded-md`}
                        >
                          {updateBtcAddyPending ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </form>

                    {/* usdt addy  */}
                    <form
                      className=" mt-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        updateUsdtAddy();
                      }}
                    >
                      <div className=" flex items-center gap-2">
                        <SiTether className=" w-6 h-6 text-subMain" />
                        <p className=" font-medium mt-1">
                          USDT Address (ERC20)
                        </p>
                      </div>
                      <div className=" w-full flex items-center gap-3">
                        <input
                          disabled={updateUsdtAddyPending}
                          type="text"
                          placeholder={
                            authUser?.btcAddy ? authUser?.usdtAddy : "Address"
                          }
                          onChange={(e) => setUsdtAddy(e.target.value)}
                          value={usdtAddy}
                          className={`${
                            updateUsdtAddyPending &&
                            "opacity-50 cursor-not-allowed"
                          } w-full bg-dry border mt-2 border-zinc-700 py-2 px-4  text-text outline-none text-sm rounded-md`}
                        />
                        <button
                          disabled={updateUsdtAddyPending || !usdtAddy}
                          className={`${
                            updateBtcAddyPending &&
                            "opacity-50 cursor-not-allowed"
                          } w-28 text-myWhite font-medium h-[38px] bg-subMain mt-1.5 rounded-md`}
                        >
                          {updateUsdtAddyPending ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </form>

                    {/* ltc addy  */}
                    <form
                      className=" mt-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        updateLtcAddy();
                      }}
                    >
                      <div className=" flex items-center gap-2">
                        <SiLitecoin className=" w-6 h-6 text-subMain" />
                        <p className=" font-medium mt-1">LTC Address</p>
                      </div>
                      <div className=" w-full flex items-center gap-3">
                        <input
                          disabled={updateLtcAddyPending}
                          type="text"
                          placeholder={
                            authUser?.btcAddy ? authUser?.ltcAddy : "Address"
                          }
                          onChange={(e) => setLtcAddy(e.target.value)}
                          value={ltcAddy}
                          className={`${
                            updateBtcAddyPending &&
                            "opacity-50 cursor-not-allowed"
                          } w-full bg-dry border mt-2 border-zinc-700 py-2 px-4  text-text outline-none text-sm rounded-md`}
                        />
                        <button
                          disabled={updateLtcAddyPending || !ltcAddy}
                          className={`${
                            updateBtcAddyPending &&
                            "opacity-50 cursor-not-allowed"
                          } w-28 text-myWhite font-medium h-[38px] bg-subMain mt-1.5 rounded-md`}
                        >
                          {updateLtcAddyPending ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* on error  */}

                  <ErrorResponseModal
                    id={"addy_update_error_modal"}
                    message={
                      updateBtcAddyError?.message ||
                      updateUsdtAddyError?.message ||
                      updateLtcError?.message
                    }
                  />

                  {/* onSuccess */}
                  <SuccessResponseModal
                    id={"addy_update_success_modal"}
                    message={"Address Updated Successfully"}
                  />

                  {/*------------------------------ withdrawal management end ------------------------------ */}
                </div>
              </div>

              {/*----------------------------------- 2FA setup start ----------------------------------------- */}

              <div className=" md:mt-0 mt-5 col-span-4">
                <div className=" w-full bg-dry rounded-md md:p-8 p-5">
                  <h2 className="  text-xl font-semibold tracking-wide uppercase">
                    Two-Factor (2FA)
                  </h2>
                  <p className=" py-3 text-sm text-zinc-300">
                    By default, email 2FA is mandatory for accounts to begin
                    selling onsite, however we introduced 2FA Authentication
                    codes to level up your security. Two-Factor Authentication
                    (2FA) is an excellent way to keep your account secure. Even
                    if someone manages to somehow get your password, if you use
                    2FA they will not be able to access your account without
                    access to your phone. Two-Factor Authentication can be setup
                    using an authenticator app such as Google Authenticator.
                  </p>

                  {authUser?.twoFa ? (
                    <button className=" cursor-default w-full flex items-center justify-center gap-2 h-10 bg-subMain  rounded-md text-myWhite font-medium">
                      <p className=" text-base md:text-lg">Enabled</p>
                      <BsCheckCircleFill className=" w-5 h-5 text-[#ECBE07] " />
                    </button>
                  ) : (
                    <button
                      disabled={authUser?.twoFa}
                      onClick={() =>
                        document.getElementById("2fa_modal_1").showModal()
                      }
                      className=" w-full h-10 bg-subMain hover:bg-subMain/90 transition rounded-md text-myWhite font-medium"
                    >
                      Enable 2FA
                    </button>
                  )}

                  {/* 2fa modal one  */}
                  <dialog
                    id="2fa_modal_1"
                    className="modal modal-bottom sm:modal-middle"
                  >
                    <div className="modal-box bg-dry text-dryGray">
                      <div>
                        <div className=" w-full">
                          <p className=" font-semibold text-lg text-center">
                            2FA Quick Setup
                          </p>
                        </div>
                        <div className=" mt-4 w-full flex items-center flex-col gap-3">
                          <div className=" w-full flex items-center gap-2">
                            <TbCircleNumber1Filled className=" w-6 h-6 text-subMain" />
                            <p className=" text-sm leading-none">
                              Download Google Authenticator on your selected
                              device.
                            </p>
                          </div>
                          <div className=" w-full flex items-center gap-2">
                            <TbCircleNumber2Filled className=" w-8 h-8 text-subMain" />
                            <p className=" text-sm leading-4">
                              Open the app & login to your Google Account
                              (helpful to sync across other devices)
                            </p>
                          </div>
                          <div className=" w-full flex items-center gap-2">
                            <TbCircleNumber3Filled className=" w-6 h-6 text-subMain" />
                            <p className=" text-sm leading-none">
                              Press on the + button bottom left & press scan QR
                              code.
                            </p>
                          </div>
                          <div className=" w-full flex items-center gap-2">
                            <TbCircleNumber4Filled className=" w-6 h-6 text-subMain" />
                            <p className=" text-sm leading-none">
                              If problem with scanning, enter the code manually.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="modal-action">
                        <form
                          method="dialog"
                          className=" flex items-center gap-4"
                        >
                          {/* if there is a button in form, it will close the modal */}
                          <button
                            onClick={() => {
                              qrImg();
                              document
                                .getElementById("2fa_modal_2")
                                .showModal();
                            }}
                            className=" px-5 py-2 border border-lightDark bg-lightDark rounded-md"
                          >
                            Next
                          </button>
                          <button className=" px-5 py-2 border border-lightDark rounded-md">
                            Cancle
                          </button>
                        </form>
                      </div>
                    </div>
                  </dialog>

                  {/* 2fa modal two  */}
                  <dialog
                    id="2fa_modal_2"
                    className="modal modal-bottom sm:modal-middle"
                  >
                    <div className="modal-box bg-dry text-dryGray no-scrollbar">
                      <div>
                        <div className=" w-full">
                          <p className=" font-semibold text-lg text-center">
                            2FA Quick Setup
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

                        <p className=" text-sm text-zinc-400 text-center py-2">
                          or
                        </p>

                        <p className=" font-light text-center text-zinc-200">
                          <span className=" font-medium text-dryGray">
                            Manual key:
                          </span>{" "}
                          {manual || ""}
                        </p>

                        <p className=" text-center text-sm font-light mt-4 text-zinc-300 tracking-wide">
                          Scan the QR code & enter the newest code you receive
                          from your authenticator app!
                        </p>
                        <div className=" flex items-center gap-3 mt-2">
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="Code"
                            disabled={setTwoFactorPending}
                            value={code}
                            onChange={(e) => {
                              const onlyNumbers = e.target.value.replace(
                                /[^0-9]/g,
                                ""
                              );
                              setCode(onlyNumbers);
                            }}
                            className={`${
                              setTwoFactorPending &&
                              "opacity-50 cursor-not-allowed"
                            } w-full bg-main border  border-zinc-700 py-2.5 px-4  text-text outline-none text-sm rounded-md`}
                          />
                          <button
                            disabled={code.length < 6 || setTwoFactorPending}
                            onClick={() => setTwoFactor()}
                            className={`${
                              setTwoFactorPending &&
                              "opacity-50 cursor-not-allowed"
                            }  px-6 py-2 border border-lightDark bg-lightDark rounded-md `}
                          >
                            {setTwoFactorPending ? "Checking..." : "Done"}
                          </button>
                        </div>
                      </div>

                      {/* on error  */}
                      <ErrorResponseModal
                        id={"set_two_factor_error_modal"}
                        message={twoFactorError?.message}
                      />

                      {/* onSuccess  */}
                      <SuccessResponseModal
                        id={"set_two_factor_success_modal"}
                        message={"Two factor is setup successfully"}
                      />
                      <div className="modal-action">
                        <form
                          method="dialog"
                          className=" flex items-center gap-4"
                        >
                          {/* if there is a button in form, it will close the modal */}

                          <button
                            onClick={() => {
                              setQr("");
                              setManual("");
                            }}
                            className=" px-5 py-2 border border-lightDark rounded-md"
                          >
                            Cancle
                          </button>
                        </form>
                      </div>
                    </div>
                  </dialog>
                </div>
              </div>
              {/*----------------------------------- 2FA setup end ----------------------------------------- */}
            </div>
          </div>
        </div>
      </Layout>
    </FiltersProvider>
  );
};

export default Settings;
