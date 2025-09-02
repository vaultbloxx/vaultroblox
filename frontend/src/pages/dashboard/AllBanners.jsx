import Layout from "../../components/layout/Layout";
import { IoCloseSharp } from "react-icons/io5";
import DashSidebar from "../../components/layout/DashSidebar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../../components/utils/Loader";
import ErrorResponseModal from "../../components/utils/ErrorResponseModal";
import { FiltersProvider } from "../../context/FiltersContext";

function AllBanner() {
  const queryClient = useQueryClient();

  const { data: allBanners, isLoading: allBannersLoading } = useQuery({
    queryKey: ["all_banners"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/rumman/v1/utils/get-all-banner`);
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
    mutate: deleteBanner,
    isPending: deleteBannerPending,
    error: deleteBannerError,
  } = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await fetch(`/api/rumman/v1/admin/delete-banner/${id}`, {
          method: "DELETE",
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
      queryClient.invalidateQueries({ queryKey: ["all_banners"] });
    },
    onError: () => {
      document.getElementById("delete_banner_error_modal").showModal();
    },
  });

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
                <div className=" w-full p-5 bg-dry rounded-md flex items-center justify-between">
                  <div>
                    <h1 className="text-lg 2xl:text-2xl font-medium text-zinc-200">
                      All Banners
                    </h1>
                    <p className="text-sm 2xl:text-lg text-zinc-400">
                      View and manage your all promotions
                    </p>
                  </div>
                </div>

                {/* all recently sold items */}
                <div className=" mt-5">
                  {allBannersLoading ? (
                    <div className=" w-full flex items-center justify-center h-64">
                      <Loader />
                    </div>
                  ) : (
                    <div className=" w-full grid grid-cols-3 gap-5">
                      {allBanners?.map((item) => (
                        <div key={item?._id}>
                          <div className=" w-full bg-dry h-32 px-3 flex items-center gap-3 rounded-md relative">
                            <button
                              onClick={() => deleteBanner(item?._id)}
                              className=" w-7 h-7 2xl:size-10 hover:bg-main/80 text-red-600 text-sm absolute top-2 right-2 flex items-center justify-center bg-main/60 rounded-full"
                            >
                              {deleteBannerPending ? (
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
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* all recently sold items */}
                <ErrorResponseModal
                  id={"delete_banner_error_modal"}
                  message={deleteBannerError?.message}
                />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </FiltersProvider>
  );
}

export default AllBanner;
