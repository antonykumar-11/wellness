import React, { useState } from "react";
import { useCreateTaxMutation } from "../store/api/TaxApi";
import { Dialog } from "@headlessui/react";

const CreateTaxModal = ({ isOpen, setIsOpen }) => {
  const [name, setName] = useState("");
  const [rate, setRate] = useState("");
  const [createTax] = useCreateTaxMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTax({ name, rate: Number(rate) });
    setIsOpen(false);
    setName("");
    setRate("");
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
          <Dialog.Title className="text-xl font-bold">Create Tax</Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Rate</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default CreateTaxModal;
