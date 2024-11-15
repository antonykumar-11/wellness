// PrintableSalarySlip.js
import React from "react";
import { format, parseISO } from "date-fns";
import moment from "moment";

const formatDate = (dateString) => moment(dateString).format("MMMM DD, YYYY");

const PrintableSalarySlip = ({ salaryResults, employee }) => {
  return (
    <div>
      {salaryResults.length === 0 ? (
        <p>Salary is not defined for this employee.</p>
      ) : (
        salaryResults.map((record, index) => {
          const { month, results, totalSalary } = record;
          const earnings = {};
          const deductions = {};

          for (const key in results) {
            if (isEarning(key)) {
              earnings[key] = results[key];
            } else {
              deductions[key] = results[key];
            }
          }

          const totalEarnings = Object.values(earnings).reduce(
            (sum, value) => sum + value,
            0
          );
          const totalDeductions = Object.values(deductions).reduce(
            (sum, value) => sum + value,
            0
          );
          const netPay = totalEarnings - totalDeductions;

          return (
            <div key={index} className="printable-salary-slip">
              <h2 className="text-center text-xl font-bold">
                SS Mobile Solution proprietorship firm
              </h2>
              <p className="text-center">
                2nd Floor, B&C Wing, SMR Vinay Estates, Commercial Complex,
                Outer Ring Road,
              </p>
              <p className="text-center font-bold mt-2">
                Pay Slip for the period of {formatDate(month)}
              </p>
              {employee && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p>
                      <span className="font-bold">Employee Id:</span>{" "}
                      {employee.employeeId}
                    </p>
                    <p>
                      <span className="font-bold">Name:</span> {employee.name}
                    </p>
                    <p>
                      <span className="font-bold">Department:</span>{" "}
                      {employee.department}
                    </p>
                    <p>
                      <span className="font-bold">Date Of Joining:</span>{" "}
                      {formatDate(employee.dateOfHire)}
                    </p>
                    <p>
                      <span className="font-bold">Designation:</span>{" "}
                      {employee.designation}
                    </p>
                    <p>
                      <span className="font-bold">Address:</span>{" "}
                      {employee.address}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-bold">Account Name:</span>{" "}
                      {employee.bankDetails?.bankName || "-"}
                    </p>
                    <p>
                      <span className="font-bold">Account Number:</span>{" "}
                      {employee.bankDetails?.accountNumber || "-"}
                    </p>
                    <p>
                      <span className="font-bold">IFSC Code:</span>{" "}
                      {employee.bankDetails?.ifscCode || "-"}
                    </p>
                    <p>
                      <span className="font-bold">Mobile:</span>{" "}
                      {employee.contact?.phone || "-"}
                    </p>
                    <p>
                      <span className="font-bold">
                        Father's/Husband's Name:
                      </span>{" "}
                      -
                    </p>
                    <p>
                      <span className="font-bold">Casual Leave:</span> -
                    </p>
                  </div>
                </div>
              )}
              <div className="mt-4 grid grid-cols-2 gap-4 border-t-2 border-b-2 border-gray-300 py-2">
                <div>
                  <p className="font-bold text-center">Earnings</p>
                  {Object.keys(earnings).map((key) => (
                    <div className="flex justify-between" key={key}>
                      <p>{key}</p>
                      <p>{earnings[key].toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-bold text-center">Deductions</p>
                  {Object.keys(deductions).map((key) => (
                    <div className="flex justify-between" key={key}>
                      <p>{key}</p>
                      <p>{deductions[key].toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <p className="font-bold">Total Earnings:</p>
                <p>{totalEarnings.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="font-bold">Total Deductions:</p>
                <p>{totalDeductions.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="font-bold">Net Pay:</p>
                <p>{netPay.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="font-bold">Total Salary:</p>
                <p>{totalSalary.toFixed(2)}</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default PrintableSalarySlip;
