import React from "react";
import { Link } from "react-router-dom";
import { useDeleteEmployeeByIdMutation } from "../store/api/StaffApi";
import { notify } from "../utils";

function EmployeeTable({
  employees,
  pagination,
  fetchEmployees,
  handleUpdateEmployee,
}) {
  const headers = ["Name", "Email", "Phone", "Department", "Actions"];
  const { currentPage, totalPages } = pagination;

  const [c] = useDeleteEmployeeByIdMutation();

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePagination(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePagination(currentPage - 1);
    }
  };

  const handlePagination = (page) => {
    fetchEmployees("", page, 5);
  };

  const handleDeleteEmployee = async (id) => {
    try {
      const response = await deleteEmployeeById(id).unwrap();
      notify(response.message, "success");
      fetchEmployees();
    } catch (err) {
      console.error(err);
      notify("Failed to delete Employee", "error");
    }
  };

  const TableRow = ({ employee }) => (
    <tr>
      <td>
        <Link
          to={`/employee/${employee._id}`}
          className="text-blue-500 hover:underline"
        >
          {employee.name}
        </Link>
      </td>
      <td>{employee.email}</td>
      <td>{employee.phone}</td>
      <td>{employee.department}</td>
      <td>
        <button
          className="text-yellow-500 hover:text-yellow-600"
          onClick={() => handleUpdateEmployee(employee)}
        >
          Edit
        </button>
        <button
          className="text-red-500 hover:text-red-600 ml-4"
          onClick={() => handleDeleteEmployee(employee._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <>
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            {headers.map((header, i) => (
              <th
                key={i}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {employees.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-6 py-4 text-center">
                Data Not Found
              </td>
            </tr>
          ) : (
            employees.map((emp) => <TableRow employee={emp} key={emp._id} />)
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center my-4">
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <div>
          <button
            className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {pageNumbers.map((page) => (
            <button
              key={page}
              className={`px-4 py-2 mx-1 rounded-md ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              } border border-blue-500`}
              onClick={() => handlePagination(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default EmployeeTable;
