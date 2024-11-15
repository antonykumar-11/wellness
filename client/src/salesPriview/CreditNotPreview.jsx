import React from "react";
import { useGetCreditNotesQuery } from "../store/api/CreditNoteApi";

const CreditNote = () => {
  const {
    data: creditNotes = [],
    isLoading,
    isError,
  } = useGetCreditNotesQuery();

  // Calculate the yearly total credit amount
  const yearlyTotalCreditAmount = creditNotes.reduce((total, note) => {
    return total + parseFloat(note.creditAmount);
  }, 0);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching credit notes data</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Yearly Credit Note Balance
      </h2>
      <div className="text-center">
        <p className="text-xl font-medium text-gray-700">
          Total Credit Amount for the Year:
        </p>
        <p className="text-2xl font-bold text-gray-900">
          {yearlyTotalCreditAmount.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default CreditNote;
