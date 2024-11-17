import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useFetchEmployeeGroupsQuery,
  useDeleteEmployeeGroupMutation,
} from "../store/api/EmployeeGroupApi"; // Added delete mutation

const CombinedDataDisplay = () => {
  const {
    data: employeeGroupData,
    isLoading,
    error,
    refetch,
  } = useFetchEmployeeGroupsQuery();
  const [deleteEmployeeGroup] = useDeleteEmployeeGroupMutation(); // Use delete mutation
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const navigate = useNavigate();
  const location = useLocation();
  const [askHelp, setAskHelp] = useState(false); // State to manage modal visibility

  const openModalAsk = () => {
    setAskHelp(true); // Function to open the modal
  };

  const closeModalAsk = () => {
    setAskHelp(false); // Function to close the modal
  };
  useEffect(() => {
    if (location.state?.refetchData) {
      refetch();
    }
  }, [location, refetch]);

  // Handle delete functionality
  const handleDelete = async (id) => {
    try {
      await deleteEmployeeGroup(id).unwrap();
      refetch(); // Refetch the employee groups after deletion
    } catch (error) {
      console.error("Failed to delete the group:", error);
    }
  };

  // Handle edit group navigation
  const handleEdit = (id) => {
    navigate(`/staff/createemployee/${id}`); // Navigate to the edit page with group id
  };

  // Handle create group navigation
  const handleCreate = () => {
    navigate("/staff/createemployee"); // Navigate to create employee group page
  };
  // Handle create group navigation
  const handleCreate1 = () => {
    navigate("/staff/staff"); // Navigate to create employee group page
  };

  // Handle create group navigation
  const handleCreate2 = () => {
    navigate("/staff/createvehicle"); // Navigate to create employee group page
  };

  // Filter employee groups based on search term
  const filteredGroups = employeeGroupData?.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error)
    return <p className="text-center text-red-600">Error loading data.</p>;

  return (
    <>
      <div className="hidden sm:block lg:block p-6 mx-auto max-w-6xl bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Welcome to Employee Management
        </h2>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by group name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-2 w-full rounded-lg shadow border border-gray-300 dark:bg-gray-700 dark:text-white"
        />

        <section>
          <h3 className="text-2xl font-semibold mb-4">Employee Groups</h3>
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="py-2 px-4 text-left">#</th>
                <th className="py-2 px-4 text-left">Group Name</th>
                <th className="py-2 px-4 text-left">Image</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroups?.length ? (
                filteredGroups.map((group, index) => (
                  <tr
                    key={group._id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => navigate(`/staff/dashboard/${group._id}`)} // Redirect to the group details page
                  >
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{group.name}</td>
                    <td className="py-2 px-4">
                      <img
                        src={group.avatar || "/images/default_avatar.png"}
                        alt={group.name}
                        className="w-16 h-16 rounded-full"
                      />
                    </td>
                    <td className="py-2 px-4 space-x-2">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(group._id);
                        }}
                      >
                        Edit Group
                      </button>
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(group._id);
                        }}
                      >
                        Delete Group
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-2 text-center">
                    No employee group data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <button
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded mr-4"
            onClick={handleCreate}
          >
            Add Group
          </button>
          <button
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded mr-4"
            onClick={handleCreate1}
          >
            Create Staff
          </button>
          <button
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
            onClick={handleCreate2}
          >
            Create Owner
          </button>
          <button
            onClick={openModalAsk} // On button click, open the modal
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2"
          >
            Any Help
          </button>

          {askHelp && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 overflow-y-auto">
              <div className="bg-white lg:mr-24 rounded-lg p-6 md:p-8 max-w-lg md:max-w-6xl mx-auto relative shadow-lg border border-blue-300">
                <button
                  onClick={closeModalAsk} // Close modal when "Thank You" is clicked
                  className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
                >
                  Thank You
                </button>
                <h2 className="text-xl font-bold text-center mb-4 text-blue-600 tracking-wide">
                  Information Guide
                </h2>
                <div className="overflow-y-auto max-h-[70vh]">
                  {" "}
                  {/* Limit height for scrolling */}
                  <p className="text-sm mb-4 leading-relaxed tracking-wide">
                    <span className="font-semibold">Add Group:</span>
                    ഇവിടെ നമ്മൾ ജോലിക്കാരുടെ ഗ്രൂപ്പ് ( Group) ആണ് Create
                    ചെയുന്നത് പൊതുവെ Driver , Owner ആയിരിക്കും നമ്മുടെ 2 Group .
                  </p>
                  <p className="text-sm mb-4 leading-relaxed tracking-wide">
                    <span className="font-semibold">Create Staff:</span>
                    ഇവിടെ നാം നമ്മുടെ കമ്പനിയിലെ ജോലിക്കാരെ Create ചെയുന്നു
                  </p>
                  <p className="text-sm mb-4 leading-relaxed tracking-wide">
                    <span className="font-semibold">Create Owner:</span> ഇവിടെ
                    Tax ഇവിടെ നാം നമ്മുടെ കമ്പനിയിലെ വാഹനങ്ങൾ വാടകയ്ക്കു തന്നവരെ
                    Owner ആയി Create ചെയുന്നു
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
      <div className=" sm:hidden lg:hidden p-6 mx-auto max-w-6xl bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Welcome to Employee Management
        </h2>

        <input
          type="text"
          placeholder="Search by group name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-2 w-full rounded-lg shadow border border-gray-300 dark:bg-gray-700 dark:text-white"
        />

        <section className="flex flex-col items-center">
          <h3 className="text-2xl font-semibold mb-4">Employee Groups</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
            {filteredGroups?.length ? (
              filteredGroups.map((group, index) => (
                <div
                  key={group._id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg flex flex-col items-center text-center hover:shadow-xl transition duration-200 cursor-pointer"
                  onClick={() => navigate(`/staff/dashboard/${group._id}`)}
                >
                  <img
                    src={group.avatar || "/images/default_avatar.png"}
                    alt={group.name}
                    className="w-16 h-16 rounded-full mb-4"
                  />
                  <h4 className="font-semibold text-lg mb-2">{group.name}</h4>
                  <div className="flex justify-around w-full mt-2 space-x-2">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(group._id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(group._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center">
                No employee group data found.
              </p>
            )}
          </div>

          <div className="flex flex-wrap justify-center mt-6 gap-4">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={handleCreate}
            >
              Add Group
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={handleCreate1}
            >
              Create Staff
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={handleCreate2}
            >
              Create Owner
            </button>
            <button
              onClick={() => setAskHelp(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Any Help
            </button>
          </div>

          {askHelp && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 overflow-y-auto">
              <div className="bg-white lg:mr-24 rounded-lg p-6 md:p-8 max-w-lg md:max-w-6xl mx-auto relative shadow-lg border border-blue-300">
                <button
                  onClick={() => setAskHelp(false)}
                  className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Thank You
                </button>
                <h2 className="text-xl font-bold text-center mb-4 text-blue-600 tracking-wide">
                  Information Guide
                </h2>
                <div className="overflow-y-auto max-h-[70vh]">
                  <p className="text-sm mb-4 leading-relaxed tracking-wide">
                    <span className="font-semibold">Add Group:</span> Add a
                    group for employees like Drivers or Owners.
                  </p>
                  <p className="text-sm mb-4 leading-relaxed tracking-wide">
                    <span className="font-semibold">Create Staff:</span>{" "}
                    Register staff members in the company.
                  </p>
                  <p className="text-sm mb-4 leading-relaxed tracking-wide">
                    <span className="font-semibold">Create Owner:</span>{" "}
                    Register vehicle owners renting out to the company.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default CombinedDataDisplay;
