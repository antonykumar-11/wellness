import { useState } from "react";

import CreateTaxModal from "./tax/Tax";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Create Tax
      </button>
      <CreateTaxModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
};

export default App;
