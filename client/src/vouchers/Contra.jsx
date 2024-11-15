import React, { useState } from "react";
import { useCreatePayHeadDetailsMutation } from "../store/api/payHeadDetailsApi";
import { useGetPayHeadsQuery } from "../store/api/PayHead";
import { FaPlus, FaTrash } from "react-icons/fa"; // Import icons

const SalarySlipTable = () => {
  const { data: payHeads, isLoading, isError } = useGetPayHeadsQuery();
  const [createPayHeadDetails] = useCreatePayHeadDetailsMutation();
  const [date, setDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [payHeadDetailsList, setPayHeadDetailsList] = useState([
    {
      payHead: null,
      rate: "",
      per: "",
      payHeadType: "",
      calculationType: "",
      computedOn: "",
    },
  ]);
  console.log("payHeadDetailsList", payHeadDetailsList);
  const handlePayHeadChange = (index, event) => {
    const selectedId = event.target.value;
    const payHead = payHeads.find((head) => head._id === selectedId);
    console.log("payhead", payHead);
    if (payHead) {
      const computedOn = payHead.operations
        ? payHead.operations.map((op) => `${op.operands} ${op.operator}`)
        : "";

      const newPayHeadDetailsList = [...payHeadDetailsList];
      newPayHeadDetailsList[index] = {
        ...newPayHeadDetailsList[index],
        payHead,
        rate: payHead.rate || "",
        per: payHead.per || "",
        payHeadType: payHead.payHeadType,
        calculationType: payHead.calculationType,
        computedOn,
      };
      setPayHeadDetailsList(newPayHeadDetailsList);
    }
  };

  const handleDetailChange = (index, field, value) => {
    const newPayHeadDetailsList = [...payHeadDetailsList];
    newPayHeadDetailsList[index][field] = value;
    setPayHeadDetailsList(newPayHeadDetailsList);
  };

  const handleSave = async () => {
    try {
      const newPayHeadDetails = {
        date,
        details: payHeadDetailsList.map((detail) => ({
          payHeadId: detail.payHead._id,
          rate: detail.rate,
          per: detail.per,
          payHeadType: detail.payHeadType,
          calculationType: detail.calculationType,
          computedOn: detail.computedOn,
        })),
      };
      await createPayHeadDetails(newPayHeadDetails).unwrap();
      alert("Pay head details saved successfully!");
    } catch (error) {
      console.error("Failed to save pay head details:", error);
      alert("Failed to save pay head details.");
    }
  };

  const addNewPayHeadDetail = () => {
    setPayHeadDetailsList([
      ...payHeadDetailsList,
      {
        payHead: null,
        rate: "",
        per: "",
        payHeadType: "",
        calculationType: "",
        computedOn: "",
      },
    ]);
  };

  const deletePayHeadDetail = (index) => {
    const newPayHeadDetailsList = payHeadDetailsList.filter(
      (_, i) => i !== index
    );
    setPayHeadDetailsList(newPayHeadDetailsList);
  };

  const filteredPayHeads = payHeads?.filter((head) =>
    head.displayNameInPayslip.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log("fi", filteredPayHeads);
  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Salary Slip</h2>
      <div className="mb-4">
        <label htmlFor="date" className="block mb-2">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
          id="date"
        />
      </div>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
        <thead>
          <tr>
            <th className="p-2 border-b">Pay Head</th>
            <th className="p-2 border-b">Rate</th>
            <th className="p-2 border-b">Per</th>
            <th className="p-2 border-b">Pay Head Type</th>
            <th className="p-2 border-b">Calculation Type</th>
            <th className="p-2 border-b">Computed On</th>
            <th className="p-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payHeadDetailsList.map((detail, index) => (
            <tr key={index}>
              <td className="p-2 border-b">
                <select
                  onChange={(e) => handlePayHeadChange(index, e)}
                  className="border border-gray-300 rounded px-2 py-1"
                  value={detail.payHead?._id || ""}
                >
                  <option value="">Select Pay Head</option>
                  {isLoading && <option>Loading...</option>}
                  {isError && <option>Error loading pay heads</option>}
                  {filteredPayHeads &&
                    filteredPayHeads.map((head) => (
                      <option key={head._id} value={head._id}>
                        {head.displayNameInPayslip}
                      </option>
                    ))}
                </select>
              </td>
              <td className="p-2 border-b">
                <input
                  type="text"
                  value={detail.rate}
                  onChange={(e) =>
                    handleDetailChange(index, "rate", e.target.value)
                  }
                  className="border border-gray-300 rounded px-2 py-1"
                />
              </td>
              <td className="p-2 border-b">
                <select
                  value={detail.per}
                  onChange={(e) =>
                    handleDetailChange(index, "per", e.target.value)
                  }
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="">Select Per</option>
                  <option value="days">Days</option>
                  <option value="month">Month</option>
                  <option value="%">%</option>
                </select>
              </td>
              <td className="p-2 border-b">{detail.payHeadType}</td>
              <td className="p-2 border-b">{detail.calculationType}</td>
              <td className="p-2 border-b">{detail.computedOn}</td>
              <td className="p-2 border-b">
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
      <button
        onClick={addNewPayHeadDetail}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        <FaPlus className="inline-block mr-2" /> Add Pay Head Detail
      </button>
      <button
        onClick={handleSave}
        className="mt-4 ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Pay Head Details
      </button>
    </div>
  );
};

export default SalarySlipTable;
