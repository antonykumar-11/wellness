// Modal.js
import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-6 rounded shadow-md z-10 max-w-lg mx-auto relative dark:bg-gray-700">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 m-4 text-gray-600 dark:text-white"
        >
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
