function InvoiceItem() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200">Item</th>
            <th className="py-2 px-4 border-b border-gray-200">Quantity</th>
            <th className="py-2 px-4 border-b border-gray-200">Price/Rate</th>
            <th className="py-2 px-4 border-b border-gray-200 text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody>{/* Table rows will go here */}</tbody>
      </table>
    </div>
  );
}

export default InvoiceItem;
