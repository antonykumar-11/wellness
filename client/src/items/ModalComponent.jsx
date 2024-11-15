import React from "react";

function ModalComponent({ cartItems, subtotal, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Invoice</h2>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Items</h3>
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between py-1">
              <span>{item.name}</span>
              <span>
                {item.quantity} x ${item.price}
              </span>
            </div>
          ))}
        </div>
        <div className="text-lg font-semibold">Subtotal: ${subtotal}</div>
        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalComponent;
