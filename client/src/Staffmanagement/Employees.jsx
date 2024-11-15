import React, { useState, useEffect } from "react";
import { useCreatePayHeadDetailsMutation } from "../store/api/payHeadDetailsApi";
import { useGetLedgerQuery } from "../store/api/LedgerPayHead";
import { FaPlus, FaTrash, FaSave, FaUndo } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Loader from "../auth/Loader";
const EmployeeSalarySlipEdit = () => {
  const { employeeId } = useParams();

  const {
    data: payHeads = [],
    isLoading: payHeadsLoading,
    isError: payHeadsError,
  } = useGetLedgerQuery();

  const [createPayHeadDetails] = useCreatePayHeadDetailsMutation();

  const [date, setDate] = useState("");
  const [payHeadDetailsList, setPayHeadDetailsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [manualTotalHours, setManualTotalHours] = useState("");

  const handlePayHeadChange = (index, event) => {
    const selectedId = event.target.value;
    const payHead = payHeads.find((head) => head._id === selectedId);

    if (payHead) {
      const computedOn =
        payHead.operations
          ?.map((op) => `${op.operands.join(", ")} ${op.operator}`)
          .join(" ") || "";

      const updatedPayHeadDetailsList = [...payHeadDetailsList];
      updatedPayHeadDetailsList[index] = {
        ...updatedPayHeadDetailsList[index],
        payHead,
        displayNameInPayslip: payHead.displayNameInPayslip || "",
        rate: payHead.rate || "",
        totalDays: 0,
        payHeadType: payHead.payHeadType,
        calculationType: payHead.calculationType,
        computedOn,
        operations: payHead.operations || [],
        group: payHead.group || "", // Add group
        nature: payHead.nature || "", // Add nature
        under: payHead.under || "", // Add under
      };
      setPayHeadDetailsList(updatedPayHeadDetailsList);
    }
  };

  const handleDetailChange = (index, field, value) => {
    const updatedPayHeadDetailsList = [...payHeadDetailsList];
    updatedPayHeadDetailsList[index][field] = value;
    setPayHeadDetailsList(updatedPayHeadDetailsList);
  };

  const handleSave = async () => {
    try {
      const newPayHeadDetails = {
        date,
        details: payHeadDetailsList.map((detail) => ({
          payHeadId: detail.payHead?._id,
          displayNameInPayslip: detail.displayNameInPayslip,
          payHeadName: detail.displayNameInPayslip,
          rate: detail.rate,
          totalDays: detail.totalDays,
          payHeadType: detail.payHeadType,
          calculationType: detail.calculationType,
          computedOn: detail.computedOn,
          totalHoursPerDay: manualTotalHours || 0,
          group: detail.group, // Add group
          nature: detail.nature, // Add nature
          under: detail.under, // Add under
        })),
      };

      const response = await createPayHeadDetails({
        ...newPayHeadDetails,
        employeeId,
      }).unwrap();
      console.log("Save response:", response);
      setLoading(true); // Start loading
      setPayHeadDetailsList([]);
      setDate("");

      alert("Pay head details saved successfully!");

      setLoading(false); // End loading
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save pay head details.");
    }
  };

  const addNewPayHeadDetail = () => {
    setPayHeadDetailsList([
      ...payHeadDetailsList,
      {
        payHead: null,
        displayNameInPayslip: "",
        rate: "",
        totalDays: 0,
        payHeadType: "",
        calculationType: "",
        computedOn: "",
        operations: [],
      },
    ]);
  };
  const deletePayHeadDetail = (index) => {
    const updatedPayHeadDetailsList = payHeadDetailsList.filter(
      (_, i) => i !== index
    );
    setPayHeadDetailsList(updatedPayHeadDetailsList);
  };
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="p-4 max-w-full overflow-x-auto bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 ease-in-out mt-10">
      <h2 className="text-2xl mb-4 text-gray-900 dark:text-gray-100">
        Salary Slip
      </h2>
      <div className="flex flex-col lg:flex-row lg:space-x-4 mb-4">
        <div className="flex-1 mb-4 lg:mb-0">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="flex-1 mb-4 lg:mb-0">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Total Hours Per Day
          </label>
          <input
            type="number"
            value={manualTotalHours}
            onChange={(e) => setManualTotalHours(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="hour in day"
          />
        </div>
      </div>

      <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 rounded-lg shadow">
        <thead>
          <tr>
            <th className="border-b border-gray-300 dark:border-gray-600">
              Pay Head
            </th>
            <th className="border-b border-gray-300 dark:border-gray-600">
              Rate
            </th>
            <th className="border-b border-gray-300 dark:border-gray-600">
              Total Days
            </th>
            <th className="border-b border-gray-300 dark:border-gray-600">
              Pay Head Type
            </th>
            <th className="border-b border-gray-300 dark:border-gray-600">
              Calculation Type
            </th>
            <th className="border-b border-gray-300 dark:border-gray-600">
              Computed On
            </th>
            <th className="border-b border-gray-300 dark:border-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {payHeadDetailsList.map((detail, index) => (
            <tr key={index}>
              <td>
                <select
                  onChange={(e) => handlePayHeadChange(index, e)}
                  value={detail.payHead?._id || ""}
                  className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select Pay Head</option>
                  {payHeadsLoading && <option>Loading...</option>}
                  {payHeadsError && <option>Error loading pay heads</option>}
                  {payHeads.map((head) => (
                    <option key={head._id} value={head._id}>
                      {head.displayNameInPayslip}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={detail.rate}
                  onChange={(e) =>
                    handleDetailChange(index, "rate", e.target.value)
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={detail.totalDays}
                  onChange={(e) =>
                    handleDetailChange(index, "totalDays", e.target.value)
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={detail.payHeadType}
                  onChange={(e) =>
                    handleDetailChange(index, "payHeadType", e.target.value)
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={detail.calculationType}
                  onChange={(e) =>
                    handleDetailChange(index, "calculationType", e.target.value)
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={detail.computedOn}
                  onChange={(e) =>
                    handleDetailChange(index, "computedOn", e.target.value)
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={detail.group}
                  onChange={(e) =>
                    handleDetailChange(index, "group", e.target.value)
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={detail.nature}
                  onChange={(e) =>
                    handleDetailChange(index, "nature", e.target.value)
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={detail.under}
                  onChange={(e) =>
                    handleDetailChange(index, "under", e.target.value)
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </td>
              <td>
                <button
                  onClick={() => deletePayHeadDetail(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex space-x-2 mt-4">
        <button
          onClick={addNewPayHeadDetail}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        >
          <FaPlus className="mr-2" />
          Add Pay Head
        </button>

        <button
          onClick={handleSave}
          className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center"
        >
          <FaSave className="mr-2" />
          Save
        </button>
      </div>
    </div>
  );
};

export default EmployeeSalarySlipEdit;
