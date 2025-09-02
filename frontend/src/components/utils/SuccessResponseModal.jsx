import React from "react";
import { BsCheckCircleFill } from "react-icons/bs";

function SuccessResponseModal({ message, id }) {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box bg-lightDark text-text">
        <div className=" flex flex-col items-center justify-center py-10">
          <BsCheckCircleFill className=" w-20 h-20 text-green-600 mb-4" />
          <p className="py-4 text-center">{message || "Success"}</p>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default SuccessResponseModal;
