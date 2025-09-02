import { AnimatePresence, motion } from "framer-motion";
import { FaRegCalendarAlt } from "react-icons/fa";
import { SquarePenIcon, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaCheck, FaChevronDown } from "react-icons/fa6";
import { useUtilsStore } from "../../store/useUtilsStore";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const status = ["User", "Seller", "Admin", "Banned"];

function EditUserModal({ user, authUser }) {
  const { isUpdatingUser, updateUser } = useUtilsStore();
  const [activeTab, setActiveTab] = useState("balance");

  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);

  const filteredStatus = status.filter((status) =>
    status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (status) => {
    setSelectedStatus(status);
    setFormData((prev) => ({
      ...prev,
      role: status.toLowerCase(),
    }));
    setIsOpen(false);
    setSearchTerm("");
  };

  const [formData, setFormData] = useState({
    userId: user?._id,
    username: "",
    email: "",
    password: "",
    role: "",
    sellerBalance: "",
    buyerBalance: "",
    secret: "",
  });

  const [balanceForm, setBalanceForm] = useState({
    userId: user?._id,
    amount: "",
    clientStart: "",
    clientHoldUntil: "",
  });

  const dateInputRef = useRef();

  const openDatePicker = () => {
    dateInputRef.current.showPicker?.(); // Modern browsers support showPicker()
    dateInputRef.current.focus(); // Fallback focus
  };

  const {
    mutate: freezeBalance,
    isPending: isFreezingBalance,
    error: freezeBalanceError,
  } = useMutation({
    mutationFn: async (freezeData) => {
      try {
        const res = await fetch(`/api/rumman/v1/admin/freeze-balance`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(freezeData),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error);
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Balance frozen successfully");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
  });

  return (
    <div>
      <dialog id={`edit_user_${user?._id}`} className="modal ">
        <div className="modal-box max-w-max bg-dry no-scrollbar">
          <form method="dialog">
            <button className=" p-1 rounded-full hover:bg-subGry absolute top-2 right-2">
              <X className=" size-4" />
            </button>
          </form>
          <div className=" flex flex-col items-center ">
            <SquarePenIcon className=" size-10 text-zinc-100" />
            <h1 className=" text-zinc-100 mt-5 2xl:text-lg">
              Editing: {user?.username || "--"}
            </h1>
            <div className="flex space-x-4 mt-2 mb-5 border-border border-b">
              {authUser?.role === "owner" && (
                <>
                  <button
                    onClick={() => {
                      setFormData({
                        ...formData,
                        username: "",
                        email: "",
                        password: "",
                        role: "",
                        sellerBalance: "",
                        buyerBalance: "",
                        secret: "",
                      });
                      setActiveTab("username");
                    }}
                    className={`px-3 py-2 text-sm  ${
                      activeTab === "username"
                        ? "border-b-2 border-border text-white"
                        : "text-zinc-400"
                    }`}
                  >
                    Username
                  </button>
                  <button
                    onClick={() => {
                      setFormData({
                        ...formData,
                        username: "",
                        email: "",
                        password: "",
                        role: "",
                        sellerBalance: "",
                        buyerBalance: "",
                        secret: "",
                      });
                      setActiveTab("email");
                    }}
                    className={`px-3 py-2 text-sm  ${
                      activeTab === "email"
                        ? "border-b-2 border-border text-white"
                        : "text-zinc-400"
                    }`}
                  >
                    Email
                  </button>
                  <button
                    onClick={() => {
                      setFormData({
                        ...formData,
                        username: "",
                        email: "",
                        password: "",
                        role: "",
                        sellerBalance: "",
                        buyerBalance: "",
                        secret: "",
                      });
                      setActiveTab("role");
                    }}
                    className={`px-3 py-2 text-sm  ${
                      activeTab === "role"
                        ? "border-b-2 border-border text-white"
                        : "text-zinc-400"
                    }`}
                  >
                    Role
                  </button>
                  <button
                    onClick={() => {
                      setFormData({
                        ...formData,
                        username: "",
                        email: "",
                        password: "",
                        role: "",
                        sellerBalance: "",
                        buyerBalance: "",
                        secret: "",
                      });
                      setActiveTab("2fa");
                    }}
                    className={`px-3 py-2 text-sm  ${
                      activeTab === "2fa"
                        ? "border-b-2 border-border text-white"
                        : "text-zinc-400"
                    }`}
                  >
                    2FA
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  setFormData({
                    ...formData,
                    username: "",
                    email: "",
                    password: "",
                    role: "",
                    sellerBalance: "",
                    buyerBalance: "",
                    secret: "",
                  });
                  setActiveTab("balance");
                }}
                className={`px-3 py-2 text-sm  ${
                  activeTab === "balance"
                    ? "border-b-2 border-border text-white"
                    : "text-zinc-400"
                }`}
              >
                Balance
              </button>

              <button
                onClick={() => {
                  setFormData({
                    ...formData,
                    username: "",
                    email: "",
                    password: "",
                    role: "",
                    sellerBalance: "",
                    buyerBalance: "",
                    secret: "",
                  });
                  setActiveTab("password");
                }}
                className={`px-3 py-2 text-sm  ${
                  activeTab === "password"
                    ? "border-b-2 border-border text-white"
                    : "text-zinc-400"
                }`}
              >
                Password
              </button>
            </div>

            {/* tab content  */}
            <div className=" w-full mt-1">
              {/* name tab content  */}

              {authUser?.role === "owner" && (
                <>
                  {activeTab === "username" && (
                    <div className=" w-full  h-40 px-8 pt-2">
                      <h3 className=" text-sm text-start">Username</h3>
                      <div className=" w-full">
                        <input
                          type="text"
                          placeholder={user?.username || "--"}
                          value={formData.username}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              username: e.target.value,
                            })
                          }
                          className=" w-full bg-transparent py-2 px-3 border border-border outline-none rounded-md mt-1"
                        />
                        <button
                          disabled={isUpdatingUser || formData.username === ""}
                          onClick={() => {
                            updateUser(formData);
                          }}
                          className={`${
                            isUpdatingUser || formData.username === ""
                              ? "bg-subMain/70 cursor-not-allowed"
                              : "bg-subMain"
                          } text-sm w-full py-2 px-3 text-white outline-none rounded-md mt-2 duration-300`}
                        >
                          {isUpdatingUser ? "Updating..." : "Update"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* email tab content  */}
                  {activeTab === "email" && (
                    <div className=" w-full  h-40 px-8 pt-2">
                      <h3 className=" text-sm text-start">Email</h3>
                      <div className=" w-full">
                        <input
                          type="text"
                          disabled={isUpdatingUser}
                          placeholder={user?.email || "--"}
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="bg-transparent w-full py-2 px-3 border border-border outline-none rounded-md mt-1"
                        />
                        <button
                          disabled={isUpdatingUser || formData.email === ""}
                          onClick={() => {
                            updateUser(formData);
                          }}
                          className={`${
                            isUpdatingUser || formData.email === ""
                              ? "bg-subMain/70 cursor-not-allowed"
                              : "bg-subMain"
                          } text-sm w-full py-2 px-3 text-white outline-none rounded-md mt-2 duration-300`}
                        >
                          {isUpdatingUser ? "Updating..." : "Update"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* role tab content  */}
                  {activeTab === "role" && (
                    <div className=" w-96 px-8 pt-2  h-72">
                      <div className=" flex items-center gap-2 justify-between">
                        <h3 className=" text-sm md:text-base 2xl:text-lg">
                          Role
                        </h3>
                        <div className=" bg-zinc-900 px-4 py-1 rounded-md border border-border ">
                          <h3 className=" text-xs md:text-sm 2xl:text-base">
                            {user?.role || "--"}
                          </h3>
                        </div>
                      </div>
                      <div className=" w-full mt-5">
                        {/* role select dropdown  */}
                        <div
                          className=" relative w-full max-w-full "
                          ref={dropdownRef}
                        >
                          {/* Dropdown Trigger */}
                          <div
                            className="border border-border rounded-lg px-3 py-1.5 flex justify-between w-full items-center bg-lightDark cursor-pointer select-none"
                            onClick={() => {
                              setIsOpen((prev) => {
                                const next = !prev;
                                if (!prev) {
                                  // Delay focus just enough to wait for render
                                  setTimeout(() => {
                                    searchInputRef.current?.focus();
                                  }, 10);
                                }
                                return next;
                              });
                            }}
                          >
                            <span className="truncate text-gray-100 text-sm">
                              {selectedStatus || "Select"}
                            </span>
                            <FaChevronDown
                              className={` size-3 text-gray-400 transition-transform duration-200 ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </div>

                          {/* Dropdown List */}
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.2 }}
                                className="absolute left-0 z-30 mt-2 w-full rounded-md border border-border bg-lightDark shadow-sm max-h-80 overflow-y-auto custom-scrollbar"
                              >
                                {/* Search input */}
                                <div className="p-2 border-b border-border sticky top-0 bg-transparent">
                                  <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchTerm}
                                    ref={searchInputRef}
                                    onChange={(e) =>
                                      setSearchTerm(e.target.value)
                                    }
                                    className="bg-transparent w-full px-3 py-1.5 border border-border rounded-md focus:outline-none text-sm"
                                  />
                                </div>

                                {/* Option list */}
                                {filteredStatus.length > 0 ? (
                                  filteredStatus.map((status, index) => (
                                    <div
                                      key={index}
                                      onClick={() => handleSelect(status)}
                                      className={`px-4 py-2 flex justify-between items-center hover:bg-dry/50 transition cursor-pointer ${
                                        selectedStatus === status
                                          ? "bg-dry/70"
                                          : ""
                                      }`}
                                    >
                                      <span className=" text-sm">{status}</span>
                                      {selectedStatus === status && (
                                        <FaCheck className="w-4 h-4 text-subMain" />
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <div className="px-4 py-3 text-sm text-gray-400">
                                    No role found
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* status select dropdown end */}
                        <button
                          disabled={isUpdatingUser || formData.role === ""}
                          onClick={() => {
                            updateUser(formData);
                          }}
                          className={`${
                            isUpdatingUser || formData.role === ""
                              ? "bg-subMain/70 cursor-not-allowed"
                              : "bg-subMain"
                          } text-sm w-full py-2 px-3 text-white outline-none rounded-md mt-2 duration-300`}
                        >
                          {isUpdatingUser ? "Updating..." : "Update"}
                        </button>
                      </div>
                    </div>
                  )}
                  {/* 2fa tab content  */}
                  {activeTab === "2fa" && (
                    <div className=" w-full  h-48 px-8 pt-2">
                      <div className=" flex items-center gap-2 justify-between">
                        <h3 className=" text-sm md:text-base 2xl:text-lg">
                          2FA Manual Key
                        </h3>
                        <div className=" bg-zinc-900 px-4 py-1 rounded-md border border-border ">
                          <h3 className=" text-xs md:text-sm 2xl:text-base">
                            {user?.twoFa ? "Enabled" : "Disabled"}
                          </h3>
                        </div>
                      </div>
                      <div className=" w-full">
                        <input
                          disabled={isUpdatingUser}
                          type="text"
                          placeholder={user?.secret || "N/A"}
                          value={formData.secret}
                          onChange={(e) =>
                            setFormData({ ...formData, secret: e.target.value })
                          }
                          className="bg-transparent w-full py-2 px-3 border border-border outline-none rounded-md mt-1"
                        />
                        <button
                          disabled={isUpdatingUser || formData.secret === ""}
                          onClick={() => {
                            updateUser(formData);
                          }}
                          className={`${
                            isUpdatingUser || formData.usdtAddy === ""
                              ? "bg-subMain/70 cursor-not-allowed"
                              : "bg-subMain"
                          } text-sm w-full py-2 px-3 text-white outline-none rounded-md mt-2 duration-300`}
                        >
                          {isUpdatingUser ? "Updating..." : "Update"}
                        </button>
                        <button
                          onClick={() => {}}
                          className={` bg-subMain text-sm w-full py-2 px-3 text-white outline-none rounded-md mt-3 duration-300`}
                        >
                          {isUpdatingUser ? "Reseting..." : "Reset 2FA Session"}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* password tab content  */}
              {activeTab === "password" && (
                <div className=" w-full  h-40 px-8 pt-2">
                  <h3 className=" text-sm text-start">Password</h3>
                  <div className=" w-full">
                    <input
                      type="text"
                      disabled={isUpdatingUser}
                      placeholder={user?.password || "--"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="bg-transparent w-full py-2 px-3 border border-border outline-none rounded-md mt-1"
                    />
                    <button
                      disabled={isUpdatingUser || formData.password === ""}
                      onClick={() => {
                        updateUser(formData);
                      }}
                      className={`${
                        isUpdatingUser || formData.password === ""
                          ? "bg-subMain/70 cursor-not-allowed"
                          : "bg-subMain"
                      } text-sm w-full py-2 px-3 text-white outline-none rounded-md mt-2 duration-300`}
                    >
                      {isUpdatingUser ? "Updating..." : "Update"}
                    </button>
                  </div>
                </div>
              )}

              {/* balance tab content  */}
              {activeTab === "balance" && (
                <div className=" w-full  h-40 px-8 pt-2">
                  <div className=" flex items-center gap-4 w-full">
                    <div>
                      <h3 className=" text-sm text-start">Seller Balance</h3>
                      <div className=" w-full">
                        <input
                          type="text"
                          disabled={isUpdatingUser}
                          placeholder={`$${user?.sellerBalance.toFixed(2)}`}
                          value={formData.sellerBalance}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              sellerBalance: Number(e.target.value),
                            })
                          }
                          className=" w-full bg-transparent py-2 px-3 border border-border outline-none rounded-md mt-1"
                        />
                        <button
                          disabled={
                            isUpdatingUser || formData.sellerBalance === ""
                          }
                          onClick={() => {
                            updateUser(formData);
                          }}
                          className={`${
                            isUpdatingUser || formData.sellerBalance === ""
                              ? "bg-subMain/70 cursor-not-allowed"
                              : "bg-subMain"
                          } text-sm w-full py-2 px-3 text-white outline-none rounded-md mt-2 duration-300`}
                        >
                          {isUpdatingUser ? "Updating..." : "Update"}
                        </button>
                      </div>
                    </div>
                    <div>
                      <h3 className=" text-sm text-start">Buyer Balance</h3>
                      <div className=" w-full">
                        <input
                          type="text"
                          disabled={isUpdatingUser}
                          placeholder={`$${user?.buyerBalance.toFixed(2)}`}
                          value={formData.buyerBalance}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              buyerBalance: Number(e.target.value),
                            })
                          }
                          className=" w-full bg-transparent py-2 px-3 border border-border outline-none rounded-md mt-1"
                        />
                        <button
                          disabled={
                            isUpdatingUser || formData.buyerBalance === ""
                          }
                          onClick={() => {
                            updateUser(formData);
                          }}
                          className={`${
                            isUpdatingUser || formData.buyerBalance === ""
                              ? "bg-subMain/70 cursor-not-allowed"
                              : "bg-subMain"
                          } text-sm w-full py-2 px-3 text-white outline-none rounded-md mt-2 duration-300`}
                        >
                          {isUpdatingUser ? "Updating..." : "Update"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pb-5">
                    <h3 className="text-sm text-start">Freeze Balance</h3>
                    <div className="w-full">
                      <div className="w-full flex items-center gap-4">
                        {/* Amount Input */}
                        <input
                          type="text"
                          disabled={isFreezingBalance}
                          placeholder={user?.frozenBalance || "Enter amount"}
                          value={balanceForm.amount}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, ""); // allow only digits
                            setBalanceForm({
                              ...balanceForm,
                              amount: value, // keep as string to avoid controlled/uncontrolled issues
                            });
                          }}
                          className="w-full bg-transparent py-2 px-3 border border-border outline-none rounded-md mt-1"
                        />

                        {/* Date Picker with Custom Icon */}
                        <div className="relative w-full flex items-center border border-border rounded-md mt-1 bg-transparent px-3 py-2">
                          <FaRegCalendarAlt
                            className="absolute left-3 text-gray-400 cursor-pointer"
                            onClick={openDatePicker}
                          />
                          <input
                            ref={dateInputRef}
                            type="date"
                            disabled={isFreezingBalance}
                            value={
                              balanceForm.clientHoldUntil
                                ? balanceForm.clientHoldUntil.split("T")[0]
                                : ""
                            }
                            onChange={(e) => {
                              const selectedDate = new Date(e.target.value);
                              setBalanceForm({
                                ...balanceForm,
                                clientHoldUntil: selectedDate.toISOString(),
                              });
                            }}
                            className="w-full pl-10 bg-transparent outline-none cursor-pointer"
                          />
                        </div>
                      </div>

                      {freezeBalanceError && (
                        <p className=" text-sm text-red-500 my-1">
                          {freezeBalanceError?.message}
                        </p>
                      )}

                      {/* Submit Button */}
                      <button
                        disabled={isFreezingBalance}
                        onClick={() => {
                          if (
                            !balanceForm.amount ||
                            !balanceForm.clientHoldUntil
                          )
                            return;

                          // Update balanceForm state with clientStart
                          const updatedForm = {
                            ...balanceForm,
                            clientStart: new Date().toISOString(),
                          };
                          setBalanceForm(updatedForm);

                          // Send updated form to server
                          setTimeout(() => {
                            freezeBalance(updatedForm);
                          }, 100);
                        }}
                        className={`${
                          isFreezingBalance ||
                          balanceForm.amount === "" ||
                          balanceForm.clientHoldUntil === ""
                            ? "bg-subMain/70 cursor-not-allowed"
                            : "bg-subMain"
                        } text-sm w-full py-2 px-3 text-white outline-none rounded-md mt-2 duration-300`}
                      >
                        {isFreezingBalance ? "Freezing..." : "Freeze"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* tab content end */}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default EditUserModal;
