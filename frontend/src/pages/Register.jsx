import React, { useState } from "react";
import { MdAlternateEmail } from "react-icons/md";
import { MdOutlineLock } from "react-icons/md";
import { Link } from "react-router-dom";
import { Checkbox, Divider } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ErrorResponseModal from "../components/utils/ErrorResponseModal";
import { LuUserRound } from "react-icons/lu";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validPassword = formData.password === formData.confirmPassword;

  const validPasswordLength = formData.password.length >= 6;

  const queryClient = useQueryClient();

  //Login
  const {
    mutate: registerMutation,
    isPending: registerPending,
    error: registerError,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/rumman/v1/auth/register", {
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
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      document.getElementById("register_error_modal").showModal();
    },
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className=" relative w-full max-h-screen h-screen overflow-hidden">
      <img
        src="/images/hat_bg.webp"
        alt=""
        className="object-cover w-full h-full absolute inset-0"
      />
      <div className=" h-full w-full flex items-center justify-center absolute inset-0 ">
        <div className=" h-full lg:w-1/4 p-4 ">
          <div className=" h-full w-full bg-main rounded-md border flex flex-col items-center justify-center border-zinc-700 shadow-xl px-6">
            <div className=" h-20 lg:h-16 2xl:h-20">
              <img
                src="/images/vaultlogo.webp"
                className=" w-full h-full object-contain"
                alt=""
              />
            </div>
            <p className=" text-text/90 font-light tracking-wide text-sm 2xl:text-base">
              Create a new account
            </p>

            <form
              className=" mt-6 w-full"
              onSubmit={(e) => {
                e.preventDefault();
                registerMutation();
              }}
            >
              <label className=" relative">
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoFocus
                  autoCorrect="off"
                  value={formData.username}
                  onChange={(e) => {
                    const input = e.target.value.toLowerCase();
                    const regex = /^[a-zA-Z0-9]*$/; // 👈 changed + to *
                    if (regex.test(input)) {
                      setFormData({
                        ...formData,
                        username: input,
                      });
                    }
                  }}
                  disabled={registerPending}
                  className={`${
                    registerPending && "cursor-not-allowed"
                  } w-full bg-dry border border-zinc-800 py-2 2xl:py-3 pl-10 lg:pl-7 2xl:pl-10 text-base lg:text-sm 2xl:text-lg pr-2 text-text outline-none rounded-md`}
                />

                <LuUserRound className=" absolute left-2.5 lg:left-1.5 2xl:left-2.5 top-1/2 -translate-y-1/2 size-6 lg:size-4 2xl:size-5 text-dryGray" />
              </label>
              <label className=" relative">
                <input
                  type="email"
                  placeholder="Email"
                  autoComplete="off"
                  name="email"
                  autoCorrect="off"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={registerPending}
                  className={`${
                    registerPending && "cursor-not-allowed"
                  } w-full bg-dry mt-3 border border-zinc-800 py-2 2xl:py-3 pl-10 lg:pl-7 2xl:pl-10 text-base pr-2 text-text outline-none  rounded-md`}
                />
                <MdAlternateEmail className=" absolute left-2.5 lg:left-1.5 2xl:left-2.5 top-1/2 -translate-y-1/2 size-6 lg:size-4 2xl:size-5 text-dryGray" />
              </label>
              <label className=" relative">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  autoCorrect="off"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={registerPending}
                  className={`${
                    registerPending && "cursor-not-allowed"
                  } w-full bg-dry mt-3 border border-zinc-800 py-2 2xl:py-3 pl-10 lg:pl-7 2xl:pl-10 text-base pr-2 text-text outline-none  rounded-md`}
                />
                <MdOutlineLock className=" absolute left-2.5 lg:left-1.5 2xl:left-2.5 top-1/2 -translate-y-1/2 size-6 lg:size-4 2xl:size-5 text-dryGray" />
              </label>
              <label className=" relative">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  autoCorrect="off"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={registerPending}
                  className={`${
                    registerPending && "cursor-not-allowed"
                  } w-full bg-dry mt-3 border border-zinc-800 py-2 2xl:py-3 pl-10 lg:pl-7 2xl:pl-10 text-base pr-2 text-text outline-none  rounded-md`}
                />
                <MdOutlineLock className=" absolute left-2.5 lg:left-1.5 2xl:left-2.5 top-1/2 -translate-y-1/2 size-6 lg:size-4 2xl:size-5 text-dryGray" />
              </label>

              <div>
                {formData.password.length > 0 && !validPasswordLength && (
                  <p className=" text-center text-xs text-red-500 mt-2">
                    Password must be at least 6 characters
                  </p>
                )}
                {formData.confirmPassword.length > 0 && !validPassword && (
                  <p className=" text-center text-xs text-red-500 mt-2">
                    Passwords do not match
                  </p>
                )}
              </div>

              <div className=" w-full flex items-center mt-4 justify-between gap-2">
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
                id={"register_error_modal"}
                message={registerError?.message}
              />

              <button
                disabled={
                  registerPending ||
                  !formData.email ||
                  !formData.password ||
                  !validPassword ||
                  !validPasswordLength
                }
                className={`${
                  registerPending && "cursor-not-allowed"
                } h-10 2xl:h-12 w-full bg-subMain rounded-md mt-4 text-myWhite font-medium text-sm 2xl:text-lg hover:bg-subMain/90 transition`}
              >
                {registerPending ? "Creating..." : "Create Account"}
              </button>
            </form>
            <Divider my="xs" size="sm" label="or" labelPosition="center" />
            <div className=" w-full text-dryGray">
              <Link to="/login" className=" w-full">
                <div className=" w-full rounded-full bg-dry/90 hover:bg-dry transition border-zinc-800 h-10 2xl:h-12 flex items-center justify-center gap-2 cursor-pointer">
                  <p className=" text-sm 2xl:text-lg">Login</p>
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
              <p className="  text-center tracking-wide text-base 2xl:text-lg mt-2 text-dryGray/80 hover:text-dryGray underline">
                Back to home
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
