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
    isError: payHeadsError,
    refetch,
  } = useGetLedgerQuery();
  useEffect(() => {
    refetch();
  }, []);

  const { data: payHeadDetails = [], refetch: refetchPayHeadDetails } =
    useGetPayHeadDetailsByIdQuery({
      employeeId,
      startDate: startDate,
      endDate: endDate,
    });
  useEffect(() => {
    console.log("hai it work");
    refetchPayHeadDetails(); // Refetch data whenever startDate or endDate changes
  }, [startDate, endDate, refetchPayHeadDetails]);
  console.log("payHeadDetails", payHeadDetails);
  const [updatePayHeadDetails] = useUpdatePayHeadDetailsMutation();
  const [createPayHeadDetails] = useCreatePayHeadDetailsMutation();
  const [deletePayHeadDetails] = useDeletePayHeadDetailsMutation();
  const [date, setDate] = useState("");
  const [payHeadDetailsList, setPayHeadDetailsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [manualTotalHours, setManualTotalHours] = useState("");
  const [manualDaysInMonth, setManualDaysInMonth] = useState("");

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
            rate: detail.rate || payHead.rate || "", // Ensure rate is assigned
            totalDays: detail.totalDays || 0,
            payHeadType: payHead.payHeadType || detail.payHeadType || "",
            calculationType:
              payHead.calculationType || detail.calculationType || "",
            computedOn: payHead.computedOn || detail.computedOn || "",
            group: payHead.group || detail.group || "", // Add group
            nature: payHead.nature || detail.nature || "", // Add nature
            under: payHead.under || detail.under || "", // Add under
            operations: payHead.operations || detail.operations || [],
          };
        });

        setPayHeadDetailsList(newPayHeadDetailsList);

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

  const handlePayHeadChange = (index, event) => {
    const selectedId = event.target.value;
    const payHead = payHeads.find((head) => head._id === selectedId);

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

  // const handleCreate = async () => {
  //   try {
  //     const newPayHeadDetails = {
  //       date,
  //       details: payHeadDetailsList.map((detail) => ({
  //         payHeadId: detail.payHead?._id,
  //         displayNameInPayslip: detail.displayNameInPayslip,
  //         payHeadName: detail.displayNameInPayslip,
  //         rate: detail.rate,
  //         totalDays: detail.totalDays,
  //         payHeadType: detail.payHeadType,
  //         calculationType: detail.calculationType,
  //         computedOn: detail.computedOn,
  //         totalHoursPerDay: manualTotalHours || 0,
  //         totalDaysPerMonth: manualDaysInMonth || 0,
  //         group: detail.group, // Add group
  //         nature: detail.nature, // Add nature
  //         under: detail.under, // Add under
  //       })),
  //     };

  //     const response = await createPayHeadDetails({
  //       ...newPayHeadDetails,
  //       employeeId,
  //     }).unwrap();
  //     setLoading(true); // Start loading
  //     setPayHeadDetailsList([]);
  //     setDate("");

  //     alert("Pay head details saved successfully!");
  //     await refetchPayHeadDetails();

  //     setLoading(false); // End loading
  //   } catch (error) {
  //     console.error("Save error:", error);
  //     alert("Failed to save pay head details.");
  //   }
  // };
  const handleDateRangeChange = (event) => {
    const { name, value } = event.target;
    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    }
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

  if (payHeadsLoading || loading) {
    return <Loader />;
  }

  if (payHeadsError) {
    return <div>Error loading pay heads. Please try again.</div>;
  }

  if (!payHeadDetails || payHeadDetails.length === 0) {
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

  //   try {
  //     const newPayHeadDetails = {
  //       date,
  //       details: payHeadDetailsList.map((detail) => ({
  //         payHeadId: detail.payHead?._id,
  //         payHeadName: detail.payHeadName,
  //         displayNameInPayslip: detail.displayNameInPayslip,
  //         rate: detail.rate,
  //         totalDays: detail.totalDays,
  //         payHeadType: detail.payHeadType,
  //         calculationType: detail.calculationType,
  //         computedOn: detail.computedOn,
  //         group: detail.group, // Include group
  //         nature: detail.nature, // Include nature
  //         under: detail.under, // Include under
  //         totalHoursPerDay: manualTotalHours || 0,
  //         totalDaysPerMonth: manualDaysInMonth || 0,
  //       })),
  //     };

  //     const response = await updatePayHeadDetails({
  //       ...newPayHeadDetails,
  //       employeeId,
  //     }).unwrap();
  //     setLoading(true); // Start loading

  //     setPayHeadDetailsList([]);
  //     setDate("");

  //     alert("Pay head details updated successfully!");
  //     await refetchPayHeadDetails();

  //     setLoading(false); // End loading
  //   } catch (error) {
  //     console.error("Save error:", error);
  //     alert("Failed to update pay head details.");
  //   }
  // };

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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4 max-w-full overflow-x-auto bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 ease-in-out mt-10">
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

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 rounded-lg shadow">
          <thead>
            <tr>
              <th className="border-b border-gray-300 dark:border-gray-600 p-2 text-left text-sm font-semibold">
                Pay Head
              </th>
              <th className="border-b border-gray-300 dark:border-gray-600 p-2 text-left text-sm font-semibold">
                Rate
              </th>
              <th className="border-b border-gray-300 dark:border-gray-600 p-2 text-left text-sm font-semibold">
                Total Days for Driver
              </th>
              <th className="border-b border-gray-300 dark:border-gray-600 p-2 text-left text-sm font-semibold">
                Pay Head Type
              </th>
              <th className="border-b border-gray-300 dark:border-gray-600 p-2 text-left text-sm font-semibold">
                Calculation Type
              </th>
              <th className="border-b border-gray-300 dark:border-gray-600 p-2 text-left text-sm font-semibold">
                Computed On
              </th>
              <th className="border-b border-gray-300 dark:border-gray-600 p-2 text-left text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {payHeadDetailsList.map((detail, index) => (
              <tr key={index}>
                <td className="p-2">
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
