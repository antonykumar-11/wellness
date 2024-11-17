import React, { useState, useEffect } from "react";
import {
  useCreatePayHeadDetailsMutation,
  useUpdatePayHeadDetailsMutation,
  useDeletePayHeadDetailsMutation,
  useGetPayHeadDetailsByIdQuery,
} from "../store/api/payHeadDetailsApi";

import { useGetLedgerQuery } from "../store/api/LedgerPayHead";
import { FaPlus, FaTrash, FaSave, FaUndo } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Loader from "../auth/Loader";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const EmployeeSalarySlipEdit = () => {
  const currentMonthStart = moment().startOf("month").format("YYYY-MM-DD");
  const currentMonthEnd = moment().endOf("month").format("YYYY-MM-DD");
  const [startDate, setStartDate] = useState(currentMonthStart);
  const [endDate, setEndDate] = useState(currentMonthEnd);

  console.log("startDate", startDate);
  const { employeeId } = useParams();

  const {
    data: payHeads = [],
    isLoading: payHeadsLoading,

    refetch,
  } = useGetLedgerQuery();
  useEffect(() => {
    refetch();
  }, []);

  const {
    data: payHeadDetails = [],
    refetch: refetchPayHeadDetails,
    isError: payHeadsError,
  } = useGetPayHeadDetailsByIdQuery({
    employeeId,
    startDate,
    endDate,
  });

  // useEffect to trigger refetch whenever employeeId, startDate, or endDate changes
  useEffect(() => {
    if (employeeId && startDate && endDate) {
      // Ensure all parameters are available
      refetchPayHeadDetails(); // Refetch with the updated parameters
    }
  }, [employeeId, startDate, endDate, refetchPayHeadDetails]);

  // Optional logging to check query parameters
  useEffect(() => {
    console.log("Fetching pay head details with:", {
      employeeId,
      startDate,
      endDate,
    });
  }, [employeeId, startDate, endDate]);
  console.log("payHeadDetails", payHeadDetails);
  const [updatePayHeadDetails] = useUpdatePayHeadDetailsMutation();
  const [createPayHeadDetails] = useCreatePayHeadDetailsMutation();
  const [deletePayHeadDetails] = useDeletePayHeadDetailsMutation();
  const [date, setDate] = useState("");
  const [payHeadDetailsList, setPayHeadDetailsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [manualTotalHours, setManualTotalHours] = useState("");
  const [manualDaysInMonth, setManualDaysInMonth] = useState("");
  const [searchTerm, setSearchTerm] = useState({});
  useEffect(() => {
    if (Array.isArray(payHeadDetails) && payHeadDetails.length > 0) {
      const allDetails = payHeadDetails.flatMap(
        (record) => record.details || []
      );

      if (allDetails.length > 0) {
        const newPayHeadDetailsList = allDetails.map((detail) => {
          const payHead =
            payHeads.find((head) => head._id === detail.payHeadId) || {};

          return {
            ...detail,
            payHead,
            payHeadName:
              payHead.displayNameInPayslip || detail.payHeadName || "",
            displayNameInPayslip:
              payHead.displayNameInPayslip || detail.displayNameInPayslip || "",
            rate: detail.rate || payHead.rate || "",
            totalDays: detail.totalDays || 0,
            payHeadType: payHead.payHeadType || detail.payHeadType || "",
            calculationType:
              payHead.calculationType || detail.calculationType || "",
            computedOn: payHead.computedOn || detail.computedOn || "",
            group: payHead.group || detail.group || "",
            nature: payHead.nature || detail.nature || "",
            under: payHead.under || detail.under || "",
            operations: payHead.operations || detail.operations || [],
          };
        });

        setPayHeadDetailsList(newPayHeadDetailsList);

        // Set initial search terms
        const initialSearchTerms = newPayHeadDetailsList.reduce(
          (acc, detail, index) => {
            acc[index] =
              detail.payHeadName || detail.displayNameInPayslip || "";
            return acc;
          },
          {}
        );

        setSearchTerm(initialSearchTerms);

        // Additional existing setup logic
        const firstDetail = newPayHeadDetailsList[0];
        const manu = firstDetail.totalHoursPerDay || 0;
        const month = firstDetail.totalDaysPerMonth || 0;
        setManualTotalHours(manu);
        setManualDaysInMonth(month);

        const latestRecordDate = payHeadDetails[0]?.date;
        const formattedDate = latestRecordDate
          ? new Date(latestRecordDate).toISOString().split("T")[0]
          : "";
        setDate(formattedDate);
      }
    }
  }, [payHeadDetails, payHeads]);

  const [isDropdownOpen, setIsDropdownOpen] = useState({});

  const filteredPayHeads = (index) =>
    payHeads.filter((head) =>
      (head.displayNameInPayslip || "")
        .toLowerCase()
        .includes((searchTerm[index] || "").toLowerCase())
    );

  const handleSearchTermChange = (index, value) => {
    setSearchTerm((prev) => ({ ...prev, [index]: value }));
    setIsDropdownOpen((prev) => ({ ...prev, [index]: true }));
  };

  const handlePayHeadChange = (index, payHead) => {
    if (payHead) {
      const computedOn =
        payHead.operations
          ?.map((op) => `${op.operands.join(", ")} ${op.operator}`)
          .join(" ") || "";
      console.log("computedOn", computedOn);
      const updatedPayHeadDetailsList = [...payHeadDetailsList];
      updatedPayHeadDetailsList[index] = {
        ...updatedPayHeadDetailsList[index],
        payHead,
        payHeadName: payHead.displayNameInPayslip || "",
        displayNameInPayslip: payHead.displayNameInPayslip || "",
        rate: payHead.rate || "",
        totalDays: 0,
        payHeadType: payHead.payHeadType || "",
        calculationType: payHead.calculationType || "",
        computedOn,
        group: payHead.group || "",
        nature: payHead.nature || "",
        under: payHead.under || "",
        operations: payHead.operations || [],
      };
      setPayHeadDetailsList(updatedPayHeadDetailsList);
    }
  };

  const handleDetailChange = (index, field, value) => {
    const updatedPayHeadDetailsList = [...payHeadDetailsList];
    updatedPayHeadDetailsList[index][field] = value;
    setPayHeadDetailsList(updatedPayHeadDetailsList);
  };
  const handleDateRangeChange = (event) => {
    const { name, value } = event.target;
    name === "startDate" ? setStartDate(value) : setEndDate(value);
  };
  console.log("detail.computedOn", payHeadDetailsList);
  const handleCreate = async () => {
    setLoading(true); // Start loading
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
          totalDaysPerMonth: manualDaysInMonth || 0,
          group: detail.group,
          nature: detail.nature,
          under: detail.under,
        })),
      };

      await createPayHeadDetails({ ...newPayHeadDetails, employeeId }).unwrap();
      alert("Pay head details saved successfully!");
      await refetchPayHeadDetails();
      setPayHeadDetailsList([]); // Reset details after save
      setDate(""); // Reset date after save
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save pay head details.");
    } finally {
      setLoading(false); // Ensure loading is turned off
    }
  };

  const handleUpdate = async () => {
    setLoading(true); // Start loading
    try {
      const newPayHeadDetails = {
        date,
        details: payHeadDetailsList.map((detail) => ({
          payHeadId: detail.payHead?._id,
          payHeadName: detail.payHeadName,
          displayNameInPayslip: detail.displayNameInPayslip,
          rate: detail.rate,
          totalDays: detail.totalDays,
          payHeadType: detail.payHeadType,
          calculationType: detail.calculationType,
          computedOn: detail.computedOn,
          group: detail.group,
          nature: detail.nature,
          under: detail.under,
          totalHoursPerDay: manualTotalHours || 0,
          totalDaysPerMonth: manualDaysInMonth || 0,
        })),
      };

      await updatePayHeadDetails({ ...newPayHeadDetails, employeeId }).unwrap();
      alert("Pay head details updated successfully!");
      await refetchPayHeadDetails();
      setPayHeadDetailsList([]); // Reset details after update
      setDate(""); // Reset date after update
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update pay head details.");
    } finally {
      setLoading(false); // Ensure loading is turned off
    }
  };

  if (payHeadsError || !payHeadDetails || payHeadDetails.length === 0) {
    return (
      <div className="">
        {" "}
        <div>
          {" "}
          <label htmlFor="startDate" className="mr-2">
            Start Date:
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={startDate}
            onChange={handleDateRangeChange}
            className="border p-2 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
          <label htmlFor="endDate" className="ml-4 mr-2">
            End Date:
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={endDate}
            onChange={handleDateRangeChange}
            className="border p-2 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
        </div>
        <h1 className="flex items-center justify-center mt-56 text-2xl">
          No salary this month : {startDate}
        </h1>
      </div>
    );
  }

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
        group: "", // Initialize group
        nature: "", // Initialize nature
        under: "", // Initialize under
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

  const handleDeleteAll = async () => {
    try {
      await deletePayHeadDetails(employeeId).unwrap();
      toast.success("All pay head details deleted successfully!");
      setPayHeadDetailsList([]);
      refetchPayHeadDetails();
    } catch (err) {
      alert("Failed to delete pay head details.");
    }
  };

  if (payHeadsLoading || loading) return <Loader />;

  return (
    <div className="p-4 max-w-full  bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 ease-in-out mt-10">
      <ToastContainer />
      <div>
        {" "}
        <label htmlFor="startDate" className="mr-2">
          Start Date:
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={startDate}
          onChange={handleDateRangeChange}
          className="border p-2 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        />
        <label htmlFor="endDate" className="ml-4 mr-2">
          End Date:
        </label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={endDate}
          onChange={handleDateRangeChange}
          className="border p-2 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        />
      </div>
      <h2 className="text-2xl mb-4 text-gray-900 dark:text-gray-100">
        Salary Slip
      </h2>
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
        <div className="flex-1 mb-4 sm:mb-0">
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
        <div className="flex-1 mb-4 sm:mb-0">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Total Hours Per Day for owner
          </label>
          <input
            type="number"
            value={manualTotalHours}
            onChange={(e) => setManualTotalHours(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="hour in day"
          />
        </div>
        <div className="flex-1 mb-4 sm:mb-0">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Total days in month for owner
          </label>
          <input
            type="number"
            value={manualDaysInMonth}
            onChange={(e) => setManualDaysInMonth(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="hour in day"
          />
        </div>
      </div>

      <div className="">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 rounded-lg shadow">
          <thead>
            <tr>
              {[
                "Pay Head",
                "Rate",
                "Total Days for Driver",
                "Pay Head Type",
                "Calculation Type",
                "Computed On",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="border-b border-gray-300 dark:border-gray-600 p-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payHeadDetailsList.map((detail, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className=" relative">
                  <input
                    type="text"
                    placeholder="Search Pay Head..."
                    value={searchTerm[index] || ""}
                    onChange={(e) =>
                      handleSearchTermChange(index, e.target.value)
                    }
                    onClick={() =>
                      setIsDropdownOpen((prev) => ({ ...prev, [index]: true }))
                    }
                    className="w-full  py-1 border border-gray-300 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
                  />
                  {isDropdownOpen[index] && (
                    <div
                      className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full dark:bg-gray-800 dark:border-gray-600"
                      style={{
                        maxHeight: "200px",
                        overflowY: "auto",
                        display: "flex",
                        alignItems: "flex-start", // Align content to the top
                      }}
                    >
                      <ul className="flex flex-col">
                        {filteredPayHeads(index).length > 0 ? (
                          filteredPayHeads(index).map((head) => (
                            <li
                              key={head._id}
                              onClick={() => {
                                handlePayHeadChange(index, head);
                                setIsDropdownOpen((prev) => ({
                                  ...prev,
                                  [index]: false,
                                }));
                                setSearchTerm((prev) => ({
                                  ...prev,
                                  [index]: head.displayNameInPayslip,
                                }));
                              }}
                              className="py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              {head.displayNameInPayslip}
                            </li>
                          ))
                        ) : (
                          <li className="px-3 py-2 text-gray-500 dark:text-gray-400">
                            No results found
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </td>

                <td className="p-2">
                  <input
                    type="text"
                    value={detail.rate}
                    onChange={(e) =>
                      handleDetailChange(index, "rate", e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={detail.totalDays}
                    onChange={(e) =>
                      handleDetailChange(index, "totalDays", e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={detail.payHeadType}
                    onChange={(e) =>
                      handleDetailChange(index, "payHeadType", e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={detail.calculationType}
                    onChange={(e) =>
                      handleDetailChange(
                        index,
                        "calculationType",
                        e.target.value
                      )
                    }
                    className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={detail.computedOn}
                    onChange={(e) =>
                      handleDetailChange(index, "computedOn", e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </td>
                <td className="p-2 text-center">
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
      </div>

      <div className="flex flex-col sm:flex-row sm:space-x-2 mt-4">
        <button
          onClick={addNewPayHeadDetail}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center mb-2 sm:mb-0"
        >
          <FaPlus className="mr-2" />
          Add Pay Head
        </button>
        <button
          onClick={handleCreate}
          className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center mb-2 sm:mb-0"
        >
          <FaSave className="mr-2" />
          Save
        </button>
        <button
          onClick={handleUpdate}
          className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center mb-2 sm:mb-0"
        >
          <FaUndo className="mr-2" />
          Update
        </button>
        <button
          onClick={handleDeleteAll}
          className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
        >
          <FaTrash className="mr-2" />
          Delete All
        </button>
      </div>
    </div>
  );
};

export default EmployeeSalarySlipEdit;
