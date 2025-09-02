import React, { useState } from "react";
import { MdAlternateEmail } from "react-icons/md";
import { MdOutlineLock } from "react-icons/md";
import { Link } from "react-router-dom";
import { Checkbox, Divider } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BiSolidError } from "react-icons/bi";
import ErrorResponseModal from "../components/utils/ErrorResponseModal";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  //Login
  const {
    mutate: loginMutation,
    isPending: loginPending,
    error: loginError,
    isError: isLoginError,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/rumman/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
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
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      console.log(error);
      setFormData({
        email: "",
        password: "",
      });
      document.getElementById("login_error_modal").showModal();
    },
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className=" relative w-full flex items-center justify-center h-screen overflow-hidden ">
      <img
        src="/images/hat_bg.webp"
        alt=""
        className=" w-full h-full object-cover absolute inset-0"
      />
      <div className=" h-full w-full flex items-center justify-center absolute inset-0 ">
        <div className=" h-full w-full lg:w-1/4 p-7 lg:p-4 ">
          <div className=" h-full lg:h-full w-full bg-main rounded-lg lg:rounded-md border flex flex-col items-center justify-center border-zinc-700 shadow-xl px-6">
            <div className=" h-20">
              <img
                src="/images/vaultlogo.webp"
                className=" w-full h-full object-contain"
                alt=""
              />
            </div>
            <p className=" text-text/90 font-light tracking-wide text-sm 2xl:text-base">
              Login to your account
            </p>

            <form
              className="  mt-10 lg:mt-6 w-full"
              onSubmit={(e) => {
                e.preventDefault();
                loginMutation();
              }}
            >
              <label className=" relative">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  autoFocus
                  autoCapitalize="off"
                  autoCorrect="off"
                  onChange={handleInputChange}
                  disabled={loginPending}
                  className={`${
                    loginPending && "cursor-not-allowed"
                  } w-full bg-dry border border-zinc-800  py-2 2xl:py-3 pl-10 lg:pl-7 2xl:pl-10 pr-2 text-text outline-none text-xl lg:text-sm 2xl:text-lg rounded-md`}
                />
                <MdAlternateEmail className=" absolute left-2.5 lg:left-1.5 2xl:left-2.5 top-1/2 -translate-y-1/2 text-dryGray size-6 lg:size-4 2xl:size-5" />
              </label>
              <label className=" relative">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loginPending}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  className={`${
                    loginPending && "cursor-not-allowed"
                  } w-full bg-dry mt-3 border border-zinc-800 py-2 2xl:py-3 pl-10 lg:pl-7 2xl:pl-10 pr-2 text-text outline-none text-xl lg:text-sm 2xl:text-lg rounded-md`}
                />
                <MdOutlineLock className=" absolute left-2.5 lg:left-1.5 2xl:left-2.5 top-1/2 -translate-y-1/2 text-dryGray size-6 lg:size-4 2xl:size-5" />
              </label>

              <div className=" w-full flex items-center my-2 2xl:my-5 justify-between gap-2">
                <Checkbox
                  label="Remember me"
                  size="xs"
                  className=" text-dryGray"
                  color="#bb36fa"
                />
                <Link to="/forget-password">
                  <div className=" hover:underline cursor-pointer tracking-wide w-full text-subMain text-xs lg:text-sm 2xl:text-lg">
                    Forgot Password?
                  </div>
                </Link>
              </div>

              <ErrorResponseModal
                id={"login_error_modal"}
                message={loginError?.message}
              />

              <button
                disabled={loginPending}
                className={`${
                  loginPending && "cursor-not-allowed"
                } h-10 2xl:h-12 w-full bg-subMain rounded-md mt-4 text-myWhite font-medium text-sm 2xl:text-lg hover:bg-subMain/90 transition`}
              >
                Login
              </button>
            </form>
            <Divider my="xs" size="xl" label="or" labelPosition="center" />
            <div className=" w-full text-dryGray">
              <Link to="/register" className=" w-full">
                <div className=" w-full rounded-full bg-dry/90 hover:bg-dry transition border-zinc-800 h-10 2xl:h-12 flex items-center justify-center gap-2 cursor-pointer">
                  <p className=" text-sm 2xl:text-lg ">Create an account</p>
                </div>
              </Link>
            </div>

            <div className=" w-full mt-4">
              <p className=" text-center tracking-wide text-xs 2xl:text-base text-dryGray/50">
                By logging in, you agree to our{" "}
                <Link
                  to="/terms"
                  className=" hover:text-subMain hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className=" hover:text-subMain hover:underline"
                >
                  Privacy Policy
                </Link>{" "}
              </p>
            </div>

            <Link to="/">
              <p className="  text-center tracking-wide text-base 2xl:text-lg mt-4 text-dryGray/80 hover:text-dryGray underline">
                Back to home
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
