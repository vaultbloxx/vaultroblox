import React, { useState } from "react";
import { MdLockReset } from "react-icons/md";
import Layout from "../components/layout/Layout";
import { useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import SuccessResponseModal from "../components/utils/SuccessResponseModal";
import { FiltersProvider } from "../context/FiltersContext";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const { token } = useParams();

  const validPassword = password === confirmPassword;
  const validPasswordLength = password.length >= 6;

  const {
    mutate: resetPass,
    isPending: resetPassPending,
    error: resetPassError,
    isError: isresetPassError,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/rumman/v1/auth/reset-password/${token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPassword: password,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "An unknown error occurred");
        }

        return data;
      } catch (error) {
        console.log(error);

        throw error;
      }
    },
    onSuccess: () => {
      if (!isresetPassError) {
        document.getElementById("reset_pass_success_modal").showModal();
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    },
  });

  return (
    <FiltersProvider>
      <Layout>
        <div className=" w-full bg-main min-h-screen text-dryGray pt-16">
          <div className=" container mx-auto md:px-16 px-2 md:mt-16 mt-8 ">
            <div className=" w-full h-[50vh] flex items-center justify-center z-50">
              <div className=" w-96 bg-dry p-5 rounded-md">
                <h1 className=" text-xl font-medium">Reset your Password</h1>
                <p className=" text-sm text-dryGray mt-2 font-light">
                  Please enter your new password. It must be at least 6
                  characters long.
                </p>

                <div className=" mt-3">
                  <label className="relative">
                    <input
                      type="text"
                      placeholder="Password"
                      name="password"
                      autoCorrect="off"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={resetPassPending}
                      className={`${
                        resetPassPending && "cursor-not-allowed"
                      } w-full bg-dry mt-3 border border-zinc-700 py-2 pl-7 pr-2 text-text outline-none text-sm rounded-md`}
                    />
                    <MdLockReset className=" absolute left-1.5 top-0.5 text-dryGray" />
                  </label>
                  <label className="relative">
                    <input
                      type="text"
                      placeholder="Confirm Password"
                      name="confirm password"
                      autoCorrect="off"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={resetPassPending}
                      className={`${
                        resetPassPending && "cursor-not-allowed"
                      } w-full bg-dry mt-3 border border-zinc-700 py-2 pl-7 pr-2 text-text outline-none text-sm rounded-md`}
                    />
                    <MdLockReset className=" absolute left-1.5 top-0.5 text-dryGray" />
                  </label>
                  {isresetPassError && (
                    <p className=" mt-2 text-xs text-center text-red-600">
                      {resetPassError?.message}
                    </p>
                  )}
                  <div>
                    {password.length > 0 && !validPasswordLength && (
                      <p className=" text-center text-xs text-red-500 mt-2">
                        Password must be at least 6 characters
                      </p>
                    )}
                    {confirmPassword.length > 0 && !validPassword && (
                      <p className=" text-center text-xs text-red-500 mt-2">
                        Passwords do not match
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => resetPass()}
                    disabled={
                      resetPassPending ||
                      password.length === 0 ||
                      !validPassword ||
                      !validPasswordLength
                    }
                    className=" mt-4 bg-subMain w-full py-2 rounded-md text-myWhite text-sm font-medium hover:bg-subMain/90"
                  >
                    {resetPassPending ? "Please wait..." : "Reset Password"}
                  </button>

                  <SuccessResponseModal
                    id={"reset_pass_success_modal"}
                    message={"Password reset successfully"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </FiltersProvider>
  );
}

export default ResetPassword;
