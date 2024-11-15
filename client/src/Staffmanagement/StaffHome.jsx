// EmployeeManagementApp.js
import { useState } from "react";
import EmployeeTable from "./EployeeTable";
import AddEmployee from "./AddEmployee";
import {
  useGetAllEmployeesQuery,
  useDeleteEmployeeByIdMutation,
  useCreateEmployeeMutation,
  useUpdateEmployeeByIdMutation,
} from "../store/api/StaffApi";
import { ToastContainer } from "react-toastify";
import { notify } from "../utils";

const EmployeeManagementApp = () => {
  const [showModal, setShowModal] = useState(false);
  const [employeeObj, setEmployeeObj] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const {
    data: employeesData,
    isLoading,
    isError,
  } = useGetAllEmployeesQuery({ search: searchTerm, page, limit: 5 });
  console.log("employee,employeedata", employeesData);
  const [createEmployee] = useCreateEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeByIdMutation();
  const [deleteEmployee] = useDeleteEmployeeByIdMutation();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUpdateEmployee = (emp) => {
    setEmployeeObj(emp);
    setShowModal(true);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <div className="flex flex-col items-center w-full p-6">
      <h1 className="text-2xl font-bold mb-4">Employee Management App</h1>
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setShowModal(true)}
          >
            Add
          </button>
          <input
            type="text"
            placeholder="Search Employees..."
            className="border border-gray-300 rounded px-4 py-2 w-1/2"
            onChange={handleSearch}
          />
        </div>
        <EmployeeTable
          employees={employeesData?.employees || []}
          pagination={employeesData?.pagination || {}}
          fetchEmployees={() => {}}
          handleUpdateEmployee={handleUpdateEmployee}
        />
        <AddEmployee
          fetchEmployees={() => {}}
          showModal={showModal}
          setShowModal={setShowModal}
          employeeObj={employeeObj}
        />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default EmployeeManagementApp;
