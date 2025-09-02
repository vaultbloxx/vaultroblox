import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PiWarningCircleBold } from "react-icons/pi";

function ErrorResponseModal({ id, message, zIndex = 50 }) {
  const dialogRef = useRef(null);

  // Ensure AnimatePresence reacts to native dialog close
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      dialog.dataset.open = "false";
    };

    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  return (
    <dialog
      id={id}
      ref={dialogRef}
      className="modal p-0 border-none bg-transparent"
      style={{ zIndex }}
    >
      <AnimatePresence>
        {dialogRef.current?.open && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop (click outside closes modal) */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => dialogRef.current.close()}
              transition={{ duration: 0.5 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal content */}
            <motion.div
              className="relative bg-lightDark text-text rounded-2xl shadow-xl w-full max-w-md p-8 z-10"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="flex flex-col items-center justify-center">
                <PiWarningCircleBold className="w-20 h-20 text-red-600 mb-4" />
                <p className="text-center text-lg">
                  {message || "An error occurred"}
                </p>
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => dialogRef.current.close()}
                  className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
}

export default ErrorResponseModal;
