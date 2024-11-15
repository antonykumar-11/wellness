import React, { useState, useEffect } from "react";
import {
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
} from "../store/api/Group";
import { groups, groupTypes } from "../vouchers/payment/LedgerData";

const GroupForm = ({ group }) => {
  const [name, setName] = useState(group?.name || "");
  const [nature, setNature] = useState(group?.nature || "");
  const [category, setCategory] = useState(group?.category || "");

  const [createGroup] = useCreateGroupMutation();
  const [updateGroup] = useUpdateGroupMutation();
  const [deleteGroup] = useDeleteGroupMutation();

  // Update nature and category based on selected name
  useEffect(() => {
    console.log("Selected Name:", name);
    if (name) {
      const selectedType = groupTypes[name];
      console.log("Selected Type:", selectedType);
      if (selectedType) {
        setNature(selectedType.nature);
        setCategory(selectedType.type);
      } else {
        setNature("");
        setCategory("");
      }
    }
  }, [name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (group) {
      await updateGroup({ id: group._id, name, nature, category });
    } else {
      await createGroup({ name, nature, category });
    }
  };

  const handleDelete = async () => {
    if (group) {
      await deleteGroup(group._id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-lg mx-auto">
      <div className="flex flex-col space-y-2">
        <label htmlFor="name" className="font-semibold">
          Name
        </label>
        <select
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded p-2"
          required
        >
          <option value="">Select a Group</option>
          {groups.map((groupName) => (
            <option key={groupName} value={groupName}>
              {groupName}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="nature" className="font-semibold">
          Nature
        </label>
        <input
          type="text"
          id="nature"
          value={nature}
          onChange={(e) => setNature(e.target.value)}
          placeholder="Nature"
          className="border rounded p-2"
          readOnly
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="category" className="font-semibold">
          Category
        </label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="border rounded p-2"
          readOnly
        />
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        {group && (
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
};

export default GroupForm;
