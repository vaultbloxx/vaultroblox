import { useRef, useState } from "react";
import Layout from "../../components/layout/Layout";
import { MdOutlineFileUpload } from "react-icons/md";
import { CiImageOn } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";
import DashSidebar from "../../components/layout/DashSidebar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../../components/utils/Loader";
import ErrorResponseModal from "../../components/utils/ErrorResponseModal";
import { FiltersProvider } from "../../context/FiltersContext";

function AddRecentSold() {
  const [img, setImg] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const queryClient = useQueryClient();

  const imgRef = useRef(null);
  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const {
    mutate: addRecentlySold,
    isPending: addRecentlySoldPending,
    error: addRecentlySoldError,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/rumman/v1/admin/create-recent-sold`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: img, name, price }),
        });
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recently_sold"] });
      imgRef.current.value = "";
      setImg(null);
      setName("");
      setPrice("");
      document.getElementById("add_recently_sold_modal").close();
    },
  });

  const { data: recentlySold, isLoading: recentlySoldLoading } = useQuery({
    queryKey: ["recently_sold"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/rumman/v1/utils/get-recently-sold`);
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

  const {
    mutate: deleteRecentlySold,
    isPending: deleteRecentlySoldPending,
    error: deleteRecentlySoldError,
  } = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await fetch(
          `/api/rumman/v1/admin/delete-recent-sold/${id}`,
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
      queryClient.invalidateQueries({ queryKey: ["recently_sold"] });
    },
    onError: () => {
      document.getElementById("delete_recently_sold_error_modal").showModal();
    },
  });

  return (
    <FiltersProvider>
      <Layout>
        <div className=" pb-20 lg:pb-0 bg-main min-h-screen text-dryGray pt-10 lg:pt-16">
          <div className=" container mx-auto px-2">
            <div className=" lg:grid grid-cols-12 gap-12 pt-10">
              <div className=" col-span-3 relative hidden lg:block">
                <DashSidebar />
              </div>
              <div className=" col-span-9">
                <div className=" w-full p-5 bg-dry rounded-md flex items-center justify-between">
                  <div>
                    <h1 className="text-lg 2xl:text-2xl font-medium text-zinc-200">
                      Recently Sold
                    </h1>
                    <p className="text-sm 2xl:text-xl text-zinc-400">
                      View and manage your recently sold items
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      document
                        .getElementById("add_recently_sold_modal")
                        .showModal()
                    }
                    className=" flex items-center gap-2 rounded-md bg-subMain text-sm 2xl:text-lg px-4 py-1 text-white hover:bg-subMain/90"
                  >
                    <p>Add</p>
                    <MdOutlineFileUpload className="w-4 h-4 2xl:size-6" />
                  </button>

                  {/* add recently sold dialog start here */}
                  <dialog id="add_recently_sold_modal" className="modal">
                    <div className="modal-box bg-dry">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          addRecentlySold();
                        }}
                      >
                        <div className=" mt-6 w-full flex items-center gap-4">
                          <div className=" w-full">
                            <span>Name</span>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Give a name"
                              className=" mt-1 w-full bg-transparent outline-none border border-border py-2 px-4 rounded-md"
                            />
                          </div>
                          <div className=" w-full">
                            <span>Price</span>
                            <input
                              type="text"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              placeholder="Make a price"
                              className=" mt-1 w-full bg-transparent outline-none border border-border py-2 px-4 rounded-md"
                            />
                          </div>
                        </div>

                        {/* sELEcT image  */}

                        <div className="flex justify-center items-center border border-border rounded-md mt-6">
                          {!img && (
                            <div
                              onClick={() => imgRef.current.click()}
                              className="flex flex-col gap-1 w-full py-8 items-center cursor-pointer"
                            >
                              <CiImageOn className="fill-zinc-700 w-20 h-20 " />
                              <p className=" text-zinc-700">Upload Image</p>
                            </div>
                          )}

                          {/* image preview  */}
                          {img && (
                            <div className=" py-5">
                              <div className="relative w-80 mx-auto">
                                <IoCloseSharp
                                  className="absolute top-0 -right-3 text-white bg-gray-700 rounded-full w-6 h-6 cursor-pointer"
                                  onClick={() => {
                                    setImg(null);
                                    imgRef.current.value = null;
                                  }}
                                />
                                <img
                                  src={img}
                                  className="w-full mx-auto h-72 object-contain rounded"
                                />
                              </div>
                            </div>
                          )}

                          {/* image selection input  */}
                          <input
                            accept="image/*"
                            type="file"
                            hidden
                            ref={imgRef}
                            onChange={handleImgChange}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={
                            addRecentlySoldPending ||
                            name === "" ||
                            price === ""
                          }
                          className={`${
                            (addRecentlySoldPending ||
                              name === "" ||
                              price === "" ||
                              !img) &&
                            " cursor-not-allowed"
                          } flex items-center justify-center gap-2 mt-6 text-white font-medium w-full bg-subMain py-2 rounded-md`}
                        >
                          {addRecentlySoldPending ? (
                            <Loader />
                          ) : (
                            <>
                              <p>Upload</p>
                              <MdOutlineFileUpload className=" w-5 h-5" />
                            </>
                          )}
                        </button>

                        <ErrorResponseModal
                          id={"add_recently_sold_error_modal"}
                          message={addRecentlySoldError?.message}
                        />
                      </form>
                      <div className="modal-action">
                        <form method="dialog" className=" w-full">
                          {/* if there is a button in form, it will close the modal */}
                          <button className=" rounded-md w-full bg-lightDark py-2">
                            Cancel
                          </button>
                        </form>
                      </div>
                    </div>
                  </dialog>

                  {/* add recently sold dialog end here */}
                </div>

                {/* all recently sold items */}
                <div className=" mt-5">
                  {recentlySoldLoading ? (
                    <div className=" w-full flex items-center justify-center h-64">
                      <Loader />
                    </div>
                  ) : (
                    <div className=" w-full grid grid-cols-1 md:grid-cols-3 gap-5">
                      {recentlySold?.map((item) => (
                        <div key={item?._id}>
                          <div className=" w-full bg-dry h-32 px-3 flex items-center gap-3 rounded-md relative">
                            <button
                              onClick={() => deleteRecentlySold(item?._id)}
                              className=" w-7 h-7 2xl:size-9 hover:bg-main/80 text-red-600 text-sm absolute top-2 right-2 flex items-center justify-center bg-main/60 rounded-full"
                            >
                              {deleteRecentlySoldPending ? (
                                <Loader />
                              ) : (
                                <IoCloseSharp className=" 2xl:size-6" />
                              )}
                            </button>
                            <div className=" w-20 h-20 overflow-hidden">
                              <img
                                src={item?.image}
                                alt={item?.name}
                                title={item?.name}
                                className=" w-full h-full object-contain"
                              />
                            </div>
                            <div className="">
                              <p className=" text-text text-sm 2xl:text-lg font-medium">
                                {item?.name}
                              </p>
                              <p className="text-sm 2xl:text-base">
                                SOLD FOR {item?.price}$
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* all recently sold items */}
                <ErrorResponseModal
                  id={"delete_recently_sold_error_modal"}
                  message={deleteRecentlySoldError?.message}
                />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </FiltersProvider>
  );
}

export default AddRecentSold;
