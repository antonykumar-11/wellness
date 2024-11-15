import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import ModalComponent from "./ModalComponent";
import {
  useGetItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} from "../store/api/ItemsApi";

function ItemsList() {
  const { data: items, error, isLoading, refetch } = useGetItemsQuery();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItemData, setNewItemData] = useState({
    name: "",
    price: 0,
    image: "",
  });

  const [createItem] = useCreateItemMutation();
  const [updateItem] = useUpdateItemMutation();
  const [deleteItem] = useDeleteItemMutation();

  useEffect(() => {
    if (!isLoading && !error) {
      refetch(); // Refetch items when component mounts or when isLoading or error changes
    }
  }, [isLoading, error, refetch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItemData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddModalShow = () => {
    setModalType("add");
    setShowModal(true);
    setNewItemData({ name: "", price: 0, image: "" });
  };

  const handleEditModalShow = (item) => {
    setModalType("edit");
    setSelectedItem(item);
    setNewItemData({ name: item.name, price: item.price, image: item.image });
    setShowModal(true);
  };

  const handleDeleteModalShow = (item) => {
    setModalType("delete");
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleAddItem = async () => {
    await createItem(newItemData);
    refetch(); // Refetch items after creating a new item
    handleModalClose();
  };

  const handleEditItem = async () => {
    if (selectedItem) {
      await updateItem({ id: selectedItem._id, updatedItem: newItemData });
      refetch(); // Refetch items after updating an item
      handleModalClose();
    }
  };

  const handleDeleteItem = async () => {
    if (selectedItem) {
      await deleteItem(selectedItem._id);
      refetch(); // Refetch items after deleting an item
      handleModalClose();
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="px-4 py-2 text-left">Image</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b dark:border-gray-700">
              <td className="px-4 py-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-full"
                />
              </td>
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">${item.price}</td>
              <td className="px-4 py-2">
                <button
                  className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600"
                  onClick={() => handleEditModalShow(item)}
                >
                  <FaEdit />
                </button>{" "}
                <button
                  className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  onClick={() => handleDeleteModalShow(item)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <ModalComponent
          type={modalType}
          newItemData={newItemData}
          handleChange={handleChange}
          onClose={handleModalClose}
          handleSubmit={
            modalType === "add"
              ? handleAddItem
              : modalType === "edit"
              ? handleEditItem
              : handleDeleteItem
          }
        />
      )}

      {/* Add Item Button */}
      <div className="flex justify-end mt-4">
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={handleAddModalShow}
        >
          <FaPlus className="mr-2" />
          Add Items
        </button>
      </div>
    </div>
  );
}

export default ItemsList;
