import React from "react";
import { useGetDebitNotesQuery } from "../store/api/DebitNoteApi";

const DebitNotePriview = () => {
  const { data: debitNotes = [], isLoading, isError } = useGetDebitNotesQuery();

  // Calculate the yearly total debit amount
  const yearlyTotalDebitAmount = debitNotes.reduce((total, note) => {
    return total + parseFloat(note.debitAmount);
  }, 0);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching debit notes data</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Yearly Debit Note Balance
      </h2>
      <div className="text-center">
        <p className="text-xl font-medium text-gray-700">
          Total Debit Amount for the Year:
        </p>
        <p className="text-2xl font-bold text-gray-900">
          {yearlyTotalDebitAmount.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default DebitNotePriview;
