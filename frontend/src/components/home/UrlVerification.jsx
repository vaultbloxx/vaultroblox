import { BiInfoCircle } from "react-icons/bi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useUtilsStore } from "../../store/useUtilsStore";
import Loader from "../utils/Loader";

function UrlVerification({
  taxModalId,
  urlModalId,
  formData,
  summaryModalId,
  setFormData,
}) {
  const { isGettingItem, getItem, errorMessage } = useUtilsStore();
  return (
    <div className=" w-full ">
      <div className=" w-full">
        <h1 className=" text-center text-zinc-200 text-2xl 2xl:text-3xl font-extrabold font-movie tracking-wide mb-3">
          VERIFY ITEM
        </h1>

        <div className=" w-full flex items-start gap-1 md:gap-3 mt-4 md:mt-5 2xl:mt-6">
          <div>
            <BiInfoCircle className=" size-5 md:size-6 2xl:size-7 mt-1 text-zinc-400" />
          </div>
          <div className=" w-full">
            <h3 className=" text-wrap text-sm md:text-lg 2xl:text-2xl font-medium">
              If your item is shirts, e.g. url should:
            </h3>
            <h3 className=" text-wrap break-all text-xs md:text-base 2xl:text-lg text-zinc-400">
              https://www.roblox.com/
              <span className="font-medium 2xl:font-semibold text-zinc-100">
                catalog
              </span>
              /7020213212/example
            </h3>
          </div>
        </div>
        <div className=" w-full flex items-start gap-1 md:gap-3 mt-4 md:mt-5 2xl:mt-6">
          <div>
            <BiInfoCircle className=" size-5 md:size-6 2xl:size-7 mt-1 text-zinc-400" />
          </div>
          <div className=" w-full">
            <h3 className=" text-wrap text-sm md:text-lg 2xl:text-2xl font-medium">
              If your item is gamepass, e.g. url should:
            </h3>
            <h3 className=" text-wrap break-all text-xs md:text-base 2xl:text-lg text-zinc-400">
              https://www.roblox.com/
              <span className="font-medium 2xl:font-semibold text-zinc-100">
                game-pass
              </span>
              /1423462108/vip
            </h3>
          </div>
        </div>
      </div>

      <div className=" w-full mt-4 md:mt-4 2xl:mt-5">
        <h3 className=" font-medium text-zinc-300 text-base lg:text-lg 2xl:text-xl">
          Your Url:
        </h3>
        <input
          type="text"
          value={formData.url}
          onChange={(e) => {
            setFormData({ ...formData, url: e.target.value });
          }}
          className=" w-full bg-black/40 border border-zinc-700 focus:border-subMain outline-none rounded-lg px-4 md:px-5 text-lg 2xl:text-xl h-10 md:h-12 2xl:h-14 mt-2 text-zinc-200"
        />
      </div>

      {errorMessage && (
        <p className=" text-red-500 text-sm md:text-base 2xl:text-lg mt-2">
          {errorMessage}
        </p>
      )}

      <div className=" flex items-center gap-3 md:gap-4 mt-4 md:mt-5 2xl:mt-6">
        <button
          onClick={() => {
            document.getElementById(`${urlModalId}`).close();
            document.getElementById(`${taxModalId}`).showModal();
          }}
          className=" w-full flex items-center justify-center gap-1 bg-lightDark hover:bg-lightDark/80 duration-200 h-9 md:h-10 2xl:h-12 rounded-full shadow-lg"
        >
          <div>
            <IoIosArrowBack className=" size-5 2xl:size-6" />
          </div>
          <h3 className=" leading-3 text-base md:text-lg 2xl:text-xl font-medium">
            Back
          </h3>
        </button>
        <button
          disabled={formData?.url === ""}
          title={formData?.url === "" ? "Please enter a valid url" : "Verify"}
          onClick={() =>
            getItem(
              formData.url,
              formData.robuxAfterTaxAmount,
              urlModalId,
              summaryModalId
            )
          }
          className=" w-full flex items-center justify-center gap-1 bg-subMain hover:bg-subMain/80 duration-200 h-9 md:h-10 2xl:h-12 rounded-full shadow-lg"
        >
          {isGettingItem ? (
            <Loader />
          ) : (
            <h3 className=" leading-3 text-base md:text-lg 2xl:text-xl font-medium">
              Verify
            </h3>
          )}

          <div>
            <IoIosArrowForward className=" size-5 2xl:size-6" />
          </div>
        </button>
      </div>
    </div>
  );
}

export default UrlVerification;
