"use client";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../providers/ThemeProvider";

interface CustomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  backdropClassName?: string;
}

const Modal: React.FC<CustomModalProps> = ({
  open,
  onOpenChange,
  children,
  header,
  footer,
  className = "",
  backdropClassName = "",
}) => {
  const { theme } = useTheme();
  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="modal-backdrop"
            className={`fixed inset-0 z-[10007] backdrop-blur-sm bg-black/40 transition-opacity px-8 flex justify-center items-center ${backdropClassName}`}
            onClick={() => onOpenChange(false)}
            aria-label="Close modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Modal content, centered inside the backdrop */}
            <AnimatePresence>
              {open && (
                <motion.div
                  // Always horizontally center at the top, with margin from the top
                  key="modal-content"
                  className={`relative z-[10570]  w-full bg-white rounded-2xl shadow-lg p-0  max-h-[90vh] flex flex-col mt-8 ${className}`}
                  role="dialog"
                  aria-modal="true"
                  tabIndex={-1}
                  onClick={(e) => e.stopPropagation()}
                  initial={{ opacity: 0, scale: 0.96, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 40 }}
                  transition={{ duration: 0.22, ease: "easeOut", delay: 0.18 }}
                  style={{ maxHeight: "90vh" }}
                >
                  {/* Header */}
                  {header && (
                    <div className="flex-shrink-0 w-full  px-6 py-4 pb-2 sticky top-0 z-10">
                      {header}
                    </div>
                  )}
                  {/* {theme === "dark" && (
                    <div
                      className="absolute -z-10 top-2 left-[50%] translate-x-[-50%] w-[240px] h-1 rounded-t-2xl mx-auto"
                      style={{
                        background:
                          "linear-gradient(90deg, #00eaff70 0%, #00ffd070 100%)",
                        boxShadow:
                          "0 0 32px 8px #00eaff70, 0 0 4px 1px #00ffd070",
                      }}
                    />
                  )} */}
                  {/* Main content */}
                  <div
                    className="flex-1 w-full px-6 py-4 overflow-y-auto"
                    style={{ maxHeight: "70vh" }}
                  >
                    {children}
                  </div>
                  {/* Footer */}
                  {footer && (
                    <div className="flex-shrink-0 w-full  px-6 py-4 sticky bottom-0 z-10">
                      {footer}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
