import React, { useState } from "react";
import Loader from "../utils/Loader";
import { IoEyeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { BiEdit } from "react-icons/bi";
import EditUserModal from "./EditUserModal";

const UsersTable = ({
  data,
  totalCars,
  page,
  setPage,
  USERS_PER_PAGE,
  isLoading,
  authUser,
}) => {
  const totalPages = Math.ceil(totalCars / USERS_PER_PAGE);

  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className=" w-full mt-5 h-[80vh] relative overflow-auto no-scrollbar">
      {/* Scrollable table */}
      <div className="flex-1 w-full overflow-auto ">
        <table className="w-full border-collapse">
          <thead className="bg-dry sticky top-0">
            <tr>
              <th className="text-left py-5 px-4 whitespace-nowrap">User ID</th>
              <th className="text-left py-3 px-2">Email</th>
              <th className="text-left py-3 px-4">Username</th>
              <th className="text-left py-3 px-4">Account</th>
              <th className="text-left py-3 px-4">Joined</th>
              <th className="text-left py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* table data  */}

            {isLoading ? (
              <tr>
                <td colSpan="8">
                  <div className=" flex items-center justify-center h-40">
                    <Loader />
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {data?.length === 0 ? (
                  <tr>
                    <td colSpan="8">
                      <div className=" opacity-70 flex items-center justify-center h-40 2xl:text-lg">
                        No Users Yet
                      </div>
                    </td>
                  </tr>
                ) : (
                  data?.map((item) => (
                    <tr
                      key={item?._id}
                      className=" mt-3 border-b border-dry px-4 "
                    >
                      <td className="px-4 py-3">
                        <span className=" text-sm 2xl:text-lg">
                          {item?._id}
                        </span>
                      </td>
                      <td className=" 2xl:text-lg px-2 py-3">
                        <p className=" w-44 truncate">{item?.email}</p>
                      </td>
                      <td className=" 2xl:text-lg px-4 py-3">
                        <p className=" w-32 truncate">{item?.username}</p>
                      </td>
                      <td className="2xl:text-lg px-4 py-3">{item?.account}</td>
                      <td>
                        <p>{format(new Date(item?.createdAt), "yyyy-MM-dd")}</p>
                      </td>
                      <td className=" px-4 py-3">
                        <div className=" flex items-center gap-2">
                          <Link to={`/user-details/${item?._id}`}>
                            <button className=" size-7 flex items-center justify-center hover:bg-subMain/90 rounded-md bg-subMain">
                              <IoEyeOutline className=" text-white 2xl:size-6 " />
                            </button>
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedUser(item);
                              setTimeout(() => {
                                document
                                  .getElementById(`edit_user_${item?._id}`)
                                  .showModal();
                              }, 100);
                            }}
                            className="  size-7 flex items-center justify-center hover:bg-subMain/90 rounded-md bg-subMain"
                          >
                            <BiEdit className=" text-white 2xl:size-6 " />
                          </button>
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
          disabled={page === totalPages || isLoading || totalPages === 0}
          onClick={() => setPage((prev) => prev + 1)}
          className={`p-3 text-sm font-medium rounded-full ${
            page === totalPages || isLoading || totalPages === 0
              ? "bg-zinc-400 text-main text-opacity-50 cursor-not-allowed"
              : "bg-main/60 hover:bg-main transition"
          }`}
        >
          <IoIosArrowForward />
        </button>
      </div>
      {/* pagination end  */}

      {/* ?modal */}
      {selectedUser && (
        <EditUserModal authUser={authUser} user={selectedUser} />
      )}
      {/* ?modal end */}
    </div>
  );
};

export default UsersTable;
