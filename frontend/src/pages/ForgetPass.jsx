import React, { useState } from "react";
import { MdLockReset } from "react-icons/md";
import Layout from "../components/layout/Layout";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import SuccessResponseModal from "../components/utils/SuccessResponseModal";
import { FiltersProvider } from "../context/FiltersContext";

function ForgetPass() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const {
    mutate: forgetPass,
    isPending: forgetPassPending,
    error: forgetPassError,
    isError: isForgetPassError,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/rumman/v1/auth/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
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
      if (!isForgetPassError) {
        document.getElementById("forget_pass_success_modal").showModal();
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    },
  });

  return (
    <FiltersProvider>
      <Layout>
        <div className=" w-full bg-main min-h-screen text-dryGray pt-16">
          <div className=" container mx-auto md:px-16 px-2 md:mt-16 mt-8 ">
            <div className=" w-full h-[50vh] flex items-center justify-center z-50">
              <div className=" w-96 2xl:w-[500px] 2xl:h-96 bg-dry p-5 rounded-md 2xl:flex flex-col justify-center">
                <h1 className=" text-xl font-medium">Forgot your Password</h1>
                <p className=" text-sm text-dryGray mt-2 font-light">
                  Please enter the email address associated with your account.
                </p>

                <div className=" mt-3">
                  <label className="relative">
                    <input
                      type="email"
                      placeholder="Email"
                      name="email"
                      autoCorrect="off"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={forgetPassPending}
                      className={`${
                        forgetPassPending && "cursor-not-allowed"
                      } w-full bg-dry mt-3 border border-zinc-700 py-2 2xl:py-3 pl-10 lg:pl-7 2xl:pl-10 text-base pr-2 text-text outline-none  rounded-md`}
                    />
                    <MdLockReset className=" absolute left-2.5 lg:left-1.5 2xl:left-2.5 top-1/2 -translate-y-1/2 size-6 lg:size-4 2xl:size-5 text-dryGray" />
                  </label>
                  {isForgetPassError && (
                    <p className=" mt-2 text-xs text-center text-red-600">
                      {forgetPassError?.message}
                    </p>
                  )}
                  <button
                    onClick={() => forgetPass()}
                    disabled={forgetPassPending || email.length === 0}
                    className=" mt-4 bg-subMain w-full py-2 rounded-md text-myWhite text-sm font-medium hover:bg-subMain/90"
                  >
                    {forgetPassPending ? "Sending..." : "Request Reset Link"}
                  </button>
                  <Link to="/login">
                    <p className=" mt-5 text-center text-sm text-dryGray font-light cursor-pointer hover:underline">
                      Back to Login
                    </p>
                  </Link>
                  <SuccessResponseModal
                    id={"forget_pass_success_modal"}
                    message={"Check your email and follow the link"}
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

export default ForgetPass;
