// // store.js or configureStore.js
// import { configureStore } from "@reduxjs/toolkit";
// import { setupListeners } from "@reduxjs/toolkit/query/react";
// import { userApi } from "./api/userapi";
// import { invoiceApi } from "./api/InvoiceApi";
// // import { ledgerApi } from "./api/AllLedgerApi";
// import itemsApi from "./api/ItemsApi";
// import stockApi from "./api/StockApi"; // Import your stock API
// import cartReducer from "./api/CartSlice";
// import { purchaseApi } from "./api/PurchaseApi";
// import { ledgerApi } from "./api/LedgerApi";
// import { taxApi } from "./api/TaxApi";
// import { staffApi } from "./api/StaffApi";
// import { payHeadApi } from "./api/PayHead";
// import { payHeadDetailsApi } from "./api/payHeadDetailsApi";
// import { employeegroupsApi } from "./api/EmployeeGroupApi";
// import { attendanceApi } from "./api/AttendenceApi";
// import { journalVoucherApi } from "./api/journalVoucherApi";
// import { salesVouchersApi } from "./api/SalesApi";
// import { receiptVouchersApi } from "./api/RecieptVoucher";
// import { contraVouchersApi } from "./api/ContraVoucherApi";
// import { creditNoteApi } from "./api/CreditNoteApi";
// import { debitNoteApi } from "./api/DebitNoteApi";
// import { getaAlledgerApi } from "./api/GetAllLedgerByTransaction";
// import { expenseIncomeApiSlice } from "./api/ExpenseIncomeApi";
// import { expenseApiSlice } from "./api/ExpenseExpenseApi";
// import { financialApi } from "./api/FinancialApi";
// import { paymentApi } from "./api/PaymentApi";
// import { companyApi } from "./api/CompanyApi";
// import { invoicesApi } from "./api/InvoicesApi";
// import { employeeHeadApi } from "./api/EmployeeHeadApi";
// import { vehicleRegistrationApi } from "./api/vehicleRegistrationApi";
// import { groupApi } from "./api/Group";
// import { profitAndLossApiSlice } from "./api/P&L";
// import { PaymasterApi } from "./api/PayMasterApi";
// import { attendanceEmployeeApi } from "./api/AttendenceEmployee";
// import { ledgerPayHeadApi } from "./api/LedgerPayHead";
// import { stockCategoryApi } from "./api/StockCategoryApi";
// import { stockGroupApi } from "./api/StockGroupApi";
// import { stockItemsApi } from "./api/StockItemsApi";
// import { transectionTrackApi } from "./api/TransactionTrackApi";
// import { vehicleRentApi } from "./api/VehicleRentApi";

// export const store = configureStore({
//   reducer: {
//     [userApi.reducerPath]: userApi.reducer,
//     [invoiceApi.reducerPath]: invoiceApi.reducer,
//     [ledgerApi.reducerPath]: ledgerApi.reducer,
//     [itemsApi.reducerPath]: itemsApi.reducer,
//     [stockApi.reducerPath]: stockApi.reducer, // Add stock API reducer
//     [purchaseApi.reducerPath]: purchaseApi.reducer,
//     [ledgerApi.reducerPath]: ledgerApi.reducer,
//     [taxApi.reducerPath]: taxApi.reducer,
//     [staffApi.reducerPath]: staffApi.reducer,
//     [payHeadApi.reducerPath]: payHeadApi.reducer,
//     [payHeadDetailsApi.reducerPath]: payHeadDetailsApi.reducer,
//     [employeegroupsApi.reducerPath]: employeegroupsApi.reducer,
//     [attendanceApi.reducerPath]: attendanceApi.reducer,
//     [journalVoucherApi.reducerPath]: journalVoucherApi.reducer,
//     [salesVouchersApi.reducerPath]: salesVouchersApi.reducer,
//     [receiptVouchersApi.reducerPath]: receiptVouchersApi.reducer,
//     [contraVouchersApi.reducerPath]: contraVouchersApi.reducer,
//     [creditNoteApi.reducerPath]: creditNoteApi.reducer,
//     [debitNoteApi.reducerPath]: debitNoteApi.reducer,
//     [getaAlledgerApi.reducerPath]: getaAlledgerApi.reducer,
//     [expenseIncomeApiSlice.reducerPath]: expenseIncomeApiSlice.reducer,
//     [expenseApiSlice.reducerPath]: expenseApiSlice.reducer,
//     [financialApi.reducerPath]: financialApi.reducer,
//     [paymentApi.reducerPath]: paymentApi.reducer,
//     [companyApi.reducerPath]: companyApi.reducer,
//     [invoicesApi.reducerPath]: invoicesApi.reducer,
//     [employeeHeadApi.reducerPath]: employeeHeadApi.reducer,
//     [vehicleRegistrationApi.reducerPath]: vehicleRegistrationApi.reducer,
//     [groupApi.reducerPath]: groupApi.reducer,
//     [profitAndLossApiSlice.reducerPath]: profitAndLossApiSlice.reducer,
//     [PaymasterApi.reducerPath]: PaymasterApi.reducer,
//     [attendanceEmployeeApi.reducerPath]: attendanceEmployeeApi.reducer,
//     [ledgerPayHeadApi.reducerPath]: ledgerPayHeadApi.reducer,
//     [stockCategoryApi.reducerPath]: stockCategoryApi.reducer,
//     [stockGroupApi.reducerPath]: stockGroupApi.reducer,
//     [stockItemsApi.reducerPath]: stockItemsApi.reducer,
//     [transectionTrackApi.reducerPath]: transectionTrackApi.reducer,
//     [vehicleRentApi.reducerPath]: transectionTrackApi.reducer,

//     cart: cartReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(
//       userApi.middleware,
//       invoiceApi.middleware,
//       ledgerApi.middleware,
//       itemsApi.middleware,
//       stockApi.middleware, // Add stock API middleware
//       purchaseApi.middleware,
//       ledgerApi.middleware,
//       taxApi.middleware,
//       staffApi.middleware,
//       payHeadApi.middleware,
//       payHeadDetailsApi.middleware,
//       employeegroupsApi.middleware,
//       attendanceApi.middleware,
//       journalVoucherApi.middleware,
//       salesVouchersApi.middleware,
//       receiptVouchersApi.middleware,
//       contraVouchersApi.middleware,
//       creditNoteApi.middleware,
//       debitNoteApi.middleware,
//       getaAlledgerApi.middleware,
//       expenseIncomeApiSlice.middleware,
//       expenseApiSlice.middleware,
//       financialApi.middleware,
//       paymentApi.middleware,
//       companyApi.middleware,
//       invoicesApi.middleware,
//       employeeHeadApi.middleware,
//       vehicleRegistrationApi.middleware,
//       groupApi.middleware,
//       profitAndLossApiSlice.middleware,
//       PaymasterApi.middleware,
//       attendanceEmployeeApi.middleware,
//       ledgerPayHeadApi.middleware,
//       stockCategoryApi.middleware,
//       stockGroupApi.middleware,
//       stockItemsApi.middleware,
//       transectionTrackApi.middleware,
//       vehicleRentApi.middleware
//     ),
// });

// setupListeners(store.dispatch);

// export default store;
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { userApi } from "./api/userapi";
import { invoiceApi } from "./api/InvoiceApi";
import itemsApi from "./api/ItemsApi";
import stockApi from "./api/StockApi";
import cartReducer from "./api/CartSlice";
import { purchaseApi } from "./api/PurchaseApi";
import { ledgerApi } from "./api/LedgerApi";
import { taxApi } from "./api/TaxApi";
import { staffApi } from "./api/StaffApi";
import { payHeadApi } from "./api/PayHead";
import { payHeadDetailsApi } from "./api/payHeadDetailsApi";
import { employeegroupsApi } from "./api/EmployeeGroupApi";
import { attendanceApi } from "./api/AttendenceApi";
import { journalVoucherApi } from "./api/journalVoucherApi";
import { salesVouchersApi } from "./api/SalesApi";
import { receiptVouchersApi } from "./api/RecieptVoucher";
import { contraVouchersApi } from "./api/ContraVoucherApi";
import { creditNoteApi } from "./api/CreditNoteApi";
import { debitNoteApi } from "./api/DebitNoteApi";
import { getaAlledgerApi } from "./api/GetAllLedgerByTransaction";
import { expenseIncomeApiSlice } from "./api/ExpenseIncomeApi";
import { expenseApiSlice } from "./api/ExpenseExpenseApi";
import { financialApi } from "./api/FinancialApi";
import { paymentApi } from "./api/PaymentApi";
import { companyApi } from "./api/CompanyApi";
import { invoicesApi } from "./api/InvoicesApi";
import { employeeHeadApi } from "./api/EmployeeHeadApi";
import { vehicleRegistrationApi } from "./api/vehicleRegistrationApi";
import { groupApi } from "./api/Group";
import { profitAndLossApiSlice } from "./api/P&L";
import { PaymasterApi } from "./api/PayMasterApi";
import { attendanceEmployeeApi } from "./api/AttendenceEmployee";
import { ledgerPayHeadApi } from "./api/LedgerPayHead";
import { stockCategoryApi } from "./api/StockCategoryApi";
import { stockGroupApi } from "./api/StockGroupApi";
import { stockItemsApi } from "./api/StockItemsApi";
import { transectionTrackApi } from "./api/TransactionTrackApi";
import { vehicleRentApiSlice } from "./api/VehicleRentApi"; // Corrected import
import { monthProfitApi } from "./api/MonthProfitApi"; // Corrected import
import { servicePurchaseApi } from "./api/ServicePurchaseApi"; // Corrected import
import { SalesServiceApi } from "./api/SalesServiceApi"; // Corrected import
import { AssetApiSlice } from "./api/SalaryDisplayApi"; // Corrected import

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [invoiceApi.reducerPath]: invoiceApi.reducer,
    [ledgerApi.reducerPath]: ledgerApi.reducer,
    [itemsApi.reducerPath]: itemsApi.reducer,
    [stockApi.reducerPath]: stockApi.reducer,
    [purchaseApi.reducerPath]: purchaseApi.reducer,
    [taxApi.reducerPath]: taxApi.reducer,
    [staffApi.reducerPath]: staffApi.reducer,
    [payHeadApi.reducerPath]: payHeadApi.reducer,
    [payHeadDetailsApi.reducerPath]: payHeadDetailsApi.reducer,
    [employeegroupsApi.reducerPath]: employeegroupsApi.reducer,
    [attendanceApi.reducerPath]: attendanceApi.reducer,
    [journalVoucherApi.reducerPath]: journalVoucherApi.reducer,
    [salesVouchersApi.reducerPath]: salesVouchersApi.reducer,
    [receiptVouchersApi.reducerPath]: receiptVouchersApi.reducer,
    [contraVouchersApi.reducerPath]: contraVouchersApi.reducer,
    [creditNoteApi.reducerPath]: creditNoteApi.reducer,
    [debitNoteApi.reducerPath]: debitNoteApi.reducer,
    [getaAlledgerApi.reducerPath]: getaAlledgerApi.reducer,
    [expenseIncomeApiSlice.reducerPath]: expenseIncomeApiSlice.reducer,
    [expenseApiSlice.reducerPath]: expenseApiSlice.reducer,
    [financialApi.reducerPath]: financialApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [invoicesApi.reducerPath]: invoicesApi.reducer,
    [employeeHeadApi.reducerPath]: employeeHeadApi.reducer,
    [vehicleRegistrationApi.reducerPath]: vehicleRegistrationApi.reducer,
    [groupApi.reducerPath]: groupApi.reducer,
    [profitAndLossApiSlice.reducerPath]: profitAndLossApiSlice.reducer,
    [PaymasterApi.reducerPath]: PaymasterApi.reducer,
    [attendanceEmployeeApi.reducerPath]: attendanceEmployeeApi.reducer,
    [ledgerPayHeadApi.reducerPath]: ledgerPayHeadApi.reducer,
    [stockCategoryApi.reducerPath]: stockCategoryApi.reducer,
    [stockGroupApi.reducerPath]: stockGroupApi.reducer,
    [stockItemsApi.reducerPath]: stockItemsApi.reducer,
    [transectionTrackApi.reducerPath]: transectionTrackApi.reducer,
    [vehicleRentApiSlice.reducerPath]: vehicleRentApiSlice.reducer, // Fixed reducer path
    [monthProfitApi.reducerPath]: monthProfitApi.reducer, // Fixed reducer path
    [servicePurchaseApi.reducerPath]: servicePurchaseApi.reducer, // Fixed reducer path
    [SalesServiceApi.reducerPath]: SalesServiceApi.reducer, // Fixed reducer path
    [AssetApiSlice.reducerPath]: AssetApiSlice.reducer, // Fixed reducer path

    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      invoiceApi.middleware,
      ledgerApi.middleware,
      itemsApi.middleware,
      stockApi.middleware,
      purchaseApi.middleware,
      taxApi.middleware,
      staffApi.middleware,
      payHeadApi.middleware,
      payHeadDetailsApi.middleware,
      employeegroupsApi.middleware,
      attendanceApi.middleware,
      journalVoucherApi.middleware,
      salesVouchersApi.middleware,
      receiptVouchersApi.middleware,
      contraVouchersApi.middleware,
      creditNoteApi.middleware,
      debitNoteApi.middleware,
      getaAlledgerApi.middleware,
      expenseIncomeApiSlice.middleware,
      expenseApiSlice.middleware,
      financialApi.middleware,
      paymentApi.middleware,
      companyApi.middleware,
      invoicesApi.middleware,
      employeeHeadApi.middleware,
      vehicleRegistrationApi.middleware,
      groupApi.middleware,
      profitAndLossApiSlice.middleware,
      PaymasterApi.middleware,
      attendanceEmployeeApi.middleware,
      ledgerPayHeadApi.middleware,
      stockCategoryApi.middleware,
      stockGroupApi.middleware,
      stockItemsApi.middleware,
      transectionTrackApi.middleware,
      vehicleRentApiSlice.middleware, // Fixed middleware path
      monthProfitApi.middleware, // Fixed middleware path
      servicePurchaseApi.middleware, // Fixed middleware path
      SalesServiceApi.middleware, // Fixed middleware path
      AssetApiSlice.middleware
    ),
});

setupListeners(store.dispatch);

export default store;
