import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Loader from "../utils/Loader";

const RobuxOrderTable = ({
  loading,
  totalCars,
  page,
  setPage,
  USERS_PER_PAGE,
}) => {
  const totalPages = Math.ceil(totalCars / USERS_PER_PAGE);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Mock data
  const mockData = [
    {
      trackingId: "123456789009876543211234",
      amount: "12673 R$",
      price: "$1222",
      url: "https://roblox.com/catalog/9037809273",
      email: "email@g.com",
      status: "Pending",
      time: "12/22/2290",
    },
    {
      trackingId: "987654321001234567890",
      amount: "5000 R$",
      price: "$500",
      url: "https://roblox.com/catalog/1234567890",
      email: "user@example.com",
      status: "Delivered",
      time: "11/11/2290",
    },
  ];

  return (
    <div className="w-full mt-5 h-[70vh] overflow-auto flex flex-col bg-dry rounded-md">
      {/* Scrollable table */}
      <div className="flex-1 overflow-auto min-w-[900px]">
        <table className="w-full border-collapse">
          <thead className="bg-lightDark sticky top-0">
            <tr>
              <th className="text-left py-5 px-4">Tracking ID</th>
              <th className="text-left py-3 px-4">Amount</th>
              <th className="text-left py-3 px-4">Price</th>
              <th className="text-left py-3 px-4">URL</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Time</th>
              <th className="text-left py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-10">
                  <Loader />
                </td>
              </tr>
            ) : (
              mockData.map((order, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-dry" : "bg-white/5"}
                >
                  <td className="py-3 px-4 truncate w-20">
                    <p className=" w-40 2xl:w-56 truncate">
                      {order.trackingId}
                    </p>
                  </td>
                  <td className="py-3 px-4">{order.amount}</td>
                  <td className="py-3 px-4">{order.price}</td>
                  <td className="py-3 px-4 truncate">
                    <a
                      href={order.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline px-2 py-1 border border-blue-400 rounded"
                    >
                      Go
                    </a>
                  </td>
                  <td className="py-3 px-4 truncate w-32">
                    <p className=" w-32 truncate">{order.email}</p>
                  </td>
                  <td className="py-3 px-4">{order.status}</td>
                  <td className="py-3 px-4">{order.time}</td>
                  <td className="py-3 px-4">
                    <button className="bg-main/60 hover:bg-main px-3 py-1 rounded text-white text-sm">
                      Action
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Sticky bottom pagination */}
      <div className="sticky bottom-0 left-0 flex justify-between items-center w-full bg-dry py-4 px-4 border-t border-dry">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className={`p-3 text-sm font-medium rounded-full ${
            page === 1
              ? "bg-zinc-400 text-main text-opacity-50 cursor-not-allowed"
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

export default RobuxOrderTable;
