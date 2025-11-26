import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { useModal } from "@/hooks/useModal";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const ModalProvider = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { title, props } = useAppSelector((state) => state.modal);
  const { closeModal, openModal } = useModal();

  // Get modal name from URL search parameters
  const modal_name = searchParams.get("modal");

  // Sync URL parameters with Redux state
  // useEffect(() => {
  //   if (modal_name) {
  //     openModal({
  //       component_name: modal_name,
  //       title: title || "",
  //     });
  //   } else {
  //     dispatch(closeModalAction());
  //   }
  // }, [modal_name, dispatch, title]);

  const handleClose = () => {
    closeModal();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop, not the modal content
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const renderModal = () => {
    switch (modal_name) {
      default:
        return null;
    }
  };
  // Only render if there's an active modal
  if (!modal_name) {
    return null;
  }
  return (
    <div
    // className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
    // onClick={handleBackdropClick}
    >
      {renderModal()}
    </div>
  );
};

export default ModalProvider;
