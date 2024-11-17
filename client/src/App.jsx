import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import your components
import Layout from "./home/Layouts";
import VoucherOutlet from "./Staffmanagement/VoucherOutlet";
import PaymentForm from "./payment1/PaymentDetails";

import Contra from "./vouchers/Contra";
import DebitNote from "./vouchers/DebitNote";
import ItemsOutlet from "./items/ItemsOutlet";
import ItemsMain from "./items/ItemsMain";
import ItemsHome from "./items/ItemHome";
import ItemsList from "./items/ItemLists";
import StaffOutlet from "./Staffmanagement/StaffOutlet";
import PurchaseForm from "./purchase/purchaseDetails";
import StaffDashBord from "./Staffmanagement/StaffDashBoard";
import Staff from "./Staffmanagement/Staff";
import Setting from "./Staffmanagement/Setting";
import PayHeadDetails from "./Staffmanagement/GetPayHead";
import SalesStaff from "./Staffmanagement/SalesStaff";
import EmployeeSalary from "./Staffmanagement/EmployeeSalary";
import Attendence from "./Staffmanagement/Atendence";
import EmpolyeeManagementSystem from "./Staffmanagement/EmpolyeeManagementSystem";
import SalarySlipTable from "./Staffmanagement/SalarySlip";
import SalaryPayHeadForm from "./Staffmanagement/EmployeeMainHead";
import PayHeadDetailss from "./Staffmanagement/PayheadDetails";
import PurchaseDetailsPreview from "./PurchasePreview/PurchaseDetailsPreview";
import PurchaseUpdate from "./PurchasePreview/PurchaseUpdate";
import ReceiptDatails from "./ReceiptCreate/ReceiptDetails";
import SalesDatails from "./sales/SalesDetails";
import JournalVoucher from "./journal/JournalVoucher";
import JournalByMonth from "./journal/JournalByMonth";
import ContraVoucher from "./contraa/ContraVoucher";
import CreditNoteee from "./CreditNotee/CreditNote";
import DebitNoteee from "./DebitNotee/DebitNoteee";
import ExpenseOutlet from "./expenseTracker/ExpenseOutlet";
import ExpenseIncome from "./expenseTracker/ExpenseIncome";
import ExpenseDashBoard from "./expenseTracker/ExpenseDashBoard";
import ExpenseExpense from "./expenseTracker/ExpenseExpense";
import AllLedgerView from "./allledger/AllLeadgerView";
import SalePrevieweOutlet from "./salesPriview/SalesPreviewOutLet";
import ReceiptPriview from "./receiptpreview/ReceiptPriview";
import DebitNotePriview from "./salesPriview/DebitNotePreview";
import CreditNotePreview from "./salesPriview/CreditNotPreview";
import JournalPreview from "./salesPriview/JournalPriview";
import ContraPreview from "./salesPriview/ContraPreview";
import PaymentView from "./paymentPreview/Paymenrview";
import IndirectExpenses from "./calculation/IndirectExpenses";
import IndirectExpensesDetails from "./admin/IndirectExpensesDetails";
import ProfitAndLoss from "./BalanceSheet/LedgerViewLink";
import LedgerDeailsAllNeeed from "./ledgerdetails/LedgerDeailsAllNeed";
import DashboardOutlet from "./dashboard/DashboardOutlet";
import DashboarDisplay from "./dashboard/DashboarDisplay";
import AllHeads from "./salesPriview/Allheads";
import LedgerDetailsPage from "./BalanceSheet/LedgerViewLink";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Loader from "./auth/Loader";
import BalanceSheeetDetail from "./admin/BalanceSheeetDetail";
import BalanceSheet from "./admin/BalanceSheet";
import BalanceSheetrOutlett from "./admin/AdminDashBoardOutlet";
import DashBoard from "./admin/DashBoard";
import CreateCompany from "./compnayCreate/CompnayCreate";
import CompanyList from "./compnayCreate/CompanyDetails";
import EditCompany from "./compnayCreate/EditCompany";
import EditCompanyModal from "./compnayCreate/EditCompanyModel";
import InvoiceEdit from "./invoice/InvoiceEdit";
import { ThemeProvider } from "./context/Theme";
import CreateEmployeeGroup from "./Staffmanagement/CreteEoyeeGroup";
import CreateEmployeeGroup1 from "./Staffmanagement/CreteEoyeeGroup1";
import EmployeeMainHead from "./Staffmanagement/EmployeeMainHead";
import AddVehicleRegistration from "./Staffmanagement/AddVehicleRegistration";
import VehicleRegistrationDetail from "./Staffmanagement/VehicleRegistrationDetail";
import VehicleDetailsPage from "./Staffmanagement/VehicleDetailsPage";
import GroupDetails from "./AllHeadersPreview/GroupDetails";
import IdDetails from "./admin/StockCategoryList";
import AllEmployeeSalary from "./Staffmanagement/AllEmployeeSalary";
import { SalaryProvider } from "./Staffmanagement/SalaryContext";
import { ProfitLossProvider } from "./BalanceSheet/ProfitAndLossProvider";
import TaxTransactions from "./purchase/Taxtransaction";
import DutiesAndTaxesBalances from "./purchase/DutiesAndTaxesBalances";
import JournalViewEdit from "./AllLedgerViewAdnEdit/JournalViewEdit";
import PurchasePreview from "./paymentPreview/PurchasePreview";
import PurchaseAccountView from "./AllHeadersPreview/PurchaseAccountView";
import SalesPreview from "./paymentPreview/SalesPreview";
import ReceiptPriviews from "./paymentPreview/ReceitPreview";
import CreditNotePreviews from "./paymentPreview/CreditNotePreview";
import DebitNotePreviews from "./paymentPreview/DebitNotePreview";
import EmployeeCategory from "./Staffmanagement/EmployeeCategory";
import PayMaster from "./Staffmanagement/PayMaster";
import Employees from "./Staffmanagement/Employees";
import Drivers from "./Staffmanagement/Drivers";
import StaffDashBoard from "./Staffmanagement/StaffDashBord";
import AllEmployeeSalaryCalculator from "./Staffmanagement/AllEmployeeSalaries";
import PayMasterPreview from "./AllLedgerViewAdnEdit/PayMasterPreview";
import StafPreviw from "./employeepreview/StafPreview";
import StockView from "./compnayCreate/StockView";
import LedgerCreation from "./compnayCreate/LedgerCreation";
import LedgerList from "./compnayCreate/LedgerList";
import StockCategoryForm from "./compnayCreate/StockCategoryForm";
import CreateStockGroupForm from "./compnayCreate/CreateStockGroupForm";
import StockGrouViewList from "./compnayCreate/StockGroupViewList";
import CreateStockItems from "./compnayCreate/CreateStockItems";
import StockItemsList from "./compnayCreate/StockItemsList";
import StockItemDetails from "./compnayCreate/StockItemDetails";
import ProtectedRoute from "./auth/ProtectedRoute"; // Import ProtectedRoute
import { AuthProvider } from "./auth/AuthContext"; // Import AuthProvider
import ExpenseTrackerOutlet from "./ExpenseTrackers/ExpenseOutLet";
import ExpenseDashBoards from "./ExpenseTrackers/ExpenseDashboard";
import ExpenseChart from "./ExpenseTrackers/ExpenseChart";
import ExpenseTable from "./ExpenseTrackers/ExpenseTable";
import ExpenseCreate from "./ExpenseTrackers/ExpenseCreate";
import ReportTrackerOutlet from "./report/ReportTrackerOutlet";
import ReportDashBoards from "./report/ReportDashBoards";
import PurchaseReport from "./report/PurchaseReport";
import DailyTransactionReport from "./report/DailyTransactionReport";
import StockOutlet from "./compnayCreate/StockOutlet";
import StockDashBoard from "./compnayCreate/StockDashBoard";
import VehicleRentCreate from "./Staffmanagement/VehicleRentCreate";
import MVehicleRentTable from "./Staffmanagement/MVehicleRentTable";
import VehicleRentDetails from "./Staffmanagement/VehicleRentDetails";
import SalesReport from "./report/SalesReports";
import SalesMontReport from "./report/SalesReport";
import MonthProfit from "./compnayCreate/MonthProfit";
import MonthProfitTable from "./compnayCreate/MonthProfitTable";
import PaymentReport from "./report/PaymentReport";
import PaymentMontReport from "./report/PaymentMonthReport";
import ReceiptReport from "./report/ReceiptReport";
import ReceiptMonthReport from "./report/ReceiptMonthReport";
import JournalReport from "./report/JournalReport";
import JournalReportMonth from "./report/JournalReportMonth";
import ContraReport from "./report/ContraReport";
import ContraReportMonth from "./report/ContraReportMonth";
import DebitNoteReport from "./report/DebitNoteReport";
import DebitNoteMonthReport from "./report/DebitNoteMonthReport";
import CreditNoteReport from "./report/CreditNoteReport";
import CreditNoteMonthReport from "./report/CreditNoteMonthReport";
import ContraViewEdit from "./AllLedgerViewAdnEdit/ContraViewEdit";
import Profile from "./auth/Profile";
import MonthProfittableEdit from "./compnayCreate/MonthProfittableEdit";
import PurchaseYearSearch from "./report/PurchaseYearSearch";
import PayMasterPriview from "./Staffmanagement/PayMasterPriview ";
import PayMasterReportMonth from "./report/PayMasterReportMonth";
import PayMasterViewEdit from "./AllLedgerViewAdnEdit/PayMasterViewEdit";

import VehicleRentEdit from "./Staffmanagement/VehicleRentEdit";
import useTheme from "./context/Theme";
import IndirectDreditNote from "./CreditNotee/IndirectDreditNote";
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { themeMode } = useTheme();

  useEffect(() => {
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [themeMode]);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <Router>
      <ThemeProvider>
        <ToastContainer />
        <ProfitLossProvider>
          <SalaryProvider>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Loader />} />
                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />
                {/* Redirect to /login by default */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <Layout
                        isSidebarOpen={isSidebarOpen}
                        toggleSidebar={toggleSidebar}
                      />
                    </ProtectedRoute>
                  }
                >
                  <Route path="" element={<BalanceSheetrOutlett />}>
                    <Route index element={<DashBoard />} />
                    <Route path="balancesheet" element={<BalanceSheet />} />
                    <Route path="profitandloss" element={<ProfitAndLoss />} />
                    <Route path="createcompany" element={<CreateCompany />} />
                    <Route
                      path="vehicleRentCreate"
                      element={<VehicleRentCreate />}
                    />
                    <Route
                      path="vehicle-rent/:id"
                      element={<VehicleRentEdit />}
                    />

                    <Route
                      path="paymasterreport/:month"
                      element={<PayMasterReportMonth />}
                    />
                    <Route
                      path="mvehicleRentTable"
                      element={<MVehicleRentTable />}
                    />
                    <Route path="companydetails" element={<CompanyList />} />
                    <Route path="company/:id" element={<EditCompany />} />
                    <Route path="monthprofit" element={<MonthProfit />} />
                    <Route
                      path="monthprofittable"
                      element={<MonthProfitTable />}
                    />
                    <Route
                      path="monthprofittableedit/:id"
                      element={<MonthProfittableEdit />}
                    />

                    <Route
                      path="companies/update/:id"
                      element={<EditCompanyModal />}
                    />

                    <Route
                      path="group-detail/:group"
                      element={<BalanceSheeetDetail />}
                    />
                  </Route>
                </Route>
                <Route
                  path="/stock"
                  element={
                    <ProtectedRoute>
                      <Layout
                        isSidebarOpen={isSidebarOpen}
                        toggleSidebar={toggleSidebar}
                      />
                    </ProtectedRoute>
                  }
                >
                  <Route path="" element={<StockOutlet />}>
                    <Route index element={<StockDashBoard />} />
                    <Route path="balancesheet" element={<BalanceSheet />} />
                    <Route path="profitandloss" element={<ProfitAndLoss />} />
                    <Route path="createcompany" element={<CreateCompany />} />
                    <Route path="companydetails" element={<CompanyList />} />
                    <Route path="company/:id" element={<EditCompany />} />
                    {/* 4 ivide stock list*/}
                    <Route path="stockcategorylist" element={<IdDetails />} />
                    <Route path="stockview" element={<StockView />} />
                    <Route path="ledgerCreate" element={<LedgerCreation />} />
                    <Route path="ledgerlist" element={<LedgerList />} />
                    {/* 1 ivide stock gategory */}
                    <Route path="iddetails" element={<StockCategoryForm />} />
                    {/* 3 ivide stock items */}
                    <Route
                      path="createstockitems"
                      element={<CreateStockItems />}
                    />
                    <Route
                      path="stock/item/:itemId"
                      element={<StockItemDetails />}
                    />

                    <Route
                      path="createstockgroupform/:id"
                      element={<StockGrouViewList />}
                    />
                    <Route path="group/:id" element={<StockItemsList />} />
                    {/* 2 ivide stock stock group*/}
                    <Route
                      path="createstockgroupform"
                      element={<CreateStockGroupForm />}
                    />

                    <Route
                      path="companies/update/:id"
                      element={<EditCompanyModal />}
                    />

                    <Route
                      path="group-detail/:group"
                      element={<BalanceSheeetDetail />}
                    />
                  </Route>
                </Route>
                <Route
                  path="/vouchers"
                  element={
                    <ProtectedRoute>
                      <Layout
                        isSidebarOpen={isSidebarOpen}
                        toggleSidebar={toggleSidebar}
                      />
                    </ProtectedRoute>
                  }
                >
                  <Route path="" element={<VoucherOutlet />}>
                    <Route index element={<EmpolyeeManagementSystem />} />

                    <Route path="purchaseform" element={<PurchaseForm />} />
                    <Route path="paymentform" element={<PaymentForm />} />

                    <Route path="month/:month" element={<DebitNote />} />
                    <Route
                      path="day/:id"
                      element={<PurchaseDetailsPreview />}
                    />
                    <Route path="purchase/:id" element={<PurchaseUpdate />} />
                    <Route path="contra" element={<Contra />} />
                    <Route path="sales" element={<SalesDatails />} />
                    <Route path="receipt" element={<ReceiptDatails />} />
                    <Route path="journal" element={<JournalVoucher />} />
                    <Route
                      path="journals/:journalId"
                      element={<JournalByMonth />}
                    />
                    <Route path="contravoucher" element={<ContraVoucher />} />
                    <Route path="creditnote" element={<CreditNoteee />} />
                    <Route path="debitnote" element={<DebitNoteee />} />
                    <Route
                      path="indirectdebitnote"
                      element={<IndirectDreditNote />}
                    />
                  </Route>
                </Route>
                <Route
                  path="/transactions"
                  element={
                    <ProtectedRoute>
                      <Layout
                        isSidebarOpen={isSidebarOpen}
                        toggleSidebar={toggleSidebar}
                      />
                    </ProtectedRoute>
                  }
                >
                  <Route path="" element={<ExpenseTrackerOutlet />}>
                    <Route index element={<ExpenseDashBoards />} />
                    <Route path="expensechart" element={<ExpenseChart />} />
                    <Route path="expensetable" element={<ExpenseTable />} />
                    <Route path="expensecreate" element={<ExpenseCreate />} />
                  </Route>
                </Route>
                <Route
                  path="/preview"
                  element={
                    <ProtectedRoute>
                      <Layout
                        isSidebarOpen={isSidebarOpen}
                        toggleSidebar={toggleSidebar}
                      />
                    </ProtectedRoute>
                  }
                >
                  <Route path="" element={<SalePrevieweOutlet />}>
                    <Route index element={<AllHeads />} />
                    <Route path="receiptPriview" element={<ReceiptPriview />} />
                    <Route
                      path="duties-and-taxes"
                      element={<DutiesAndTaxesBalances />}
                    />

                    <Route
                      path="debitnotepriview"
                      element={<DebitNotePriview />}
                    />
                    <Route
                      path="creditnotepriview"
                      element={<CreditNotePreview />}
                    />
                    <Route path="journalpreview" element={<JournalPreview />} />
                    <Route path="contrapreview" element={<ContraPreview />} />
                    <Route path="paymentpreview" element={<PaymentView />} />
                    <Route
                      path="indirectexpenses"
                      element={<IndirectExpenses />}
                    />

                    <Route
                      path="group-details/:group"
                      element={<GroupDetails />}
                    />
                    <Route
                      path="group-detailsed/purchase-accounts"
                      element={<PurchaseAccountView />}
                    />
                    <Route
                      path="indirectexpensesdetails"
                      element={<IndirectExpensesDetails />}
                    />
                    <Route path="profitandloss" element={<ProfitAndLoss />} />
                  </Route>
                </Route>
                <Route
                  path="/previewAll"
                  element={
                    <ProtectedRoute>
                      <Layout
                        isSidebarOpen={isSidebarOpen}
                        toggleSidebar={toggleSidebar}
                      />
                    </ProtectedRoute>
                  }
                >
                  <Route path="" element={<SalePrevieweOutlet />}>
                    <Route index element={<AllHeads />} />
                    <Route
                      path="journal-voucher/:ledgerId/transaction/:transactionId"
                      element={<JournalViewEdit />}
                    />
                    <Route
                      path="pay-master/:ledgerId/transaction/:transactionId"
                      element={<PayMasterPreview />}
                    />

                    <Route
                      path="sales-voucher/:ledgerId/transaction/:transactionId"
                      element={<SalesPreview />}
                    />
                    <Route
                      path="purchase-voucher/:ledgerId/transaction/:transactionId"
                      element={<PurchasePreview />}
                    />
                    <Route
                      path="debit-note/:ledgerId/transaction/:transactionId"
                      element={<DebitNotePreviews />}
                    />

                    <Route
                      path="credit-note/:ledgerId/transaction/:transactionId"
                      element={<CreditNotePreviews />}
                    />

                    <Route
                      path="receipt-voucher/:ledgerId/transaction/:transactionId"
                      element={<ReceiptPriviews />}
                    />
                    <Route
                      path="duties-and-taxes"
                      element={<DutiesAndTaxesBalances />}
                    />

                    <Route
                      path="debitnotepriview"
                      element={<DebitNotePriview />}
                    />
                    <Route
                      path="creditnotepriview"
                      element={<CreditNotePreview />}
                    />
                    <Route path="journalpreview" element={<JournalPreview />} />
                    <Route path="contrapreview" element={<ContraPreview />} />
                    <Route
                      path="payment-voucher/:ledgerId/transaction/:transactionId"
                      element={<PaymentView />}
                    />
                    <Route
                      path="indirectexpenses"
                      element={<IndirectExpenses />}
                    />
                    <Route
                      path="group-details/:group"
                      element={<GroupDetails />}
                    />
                    <Route
                      path="indirectexpensesdetails"
                      element={<IndirectExpensesDetails />}
                    />
                    <Route path="profitandloss" element={<ProfitAndLoss />} />
                  </Route>
                </Route>
                <Route
                  path="/invoice"
                  element={
                    <ProtectedRoute>
                      <Layout
                        isSidebarOpen={isSidebarOpen}
                        toggleSidebar={toggleSidebar}
                      />
                    </ProtectedRoute>
                  }
                >
                  <Route path="" element={<ItemsOutlet />}>
                    <Route index element={<ItemsHome />} />
                    <Route path="invoice-preview" element={<ItemsMain />} />
                    <Route path="invoice/edit/:id" element={<InvoiceEdit />} />
                  </Route>
                </Route>
                <Route
                  path="/details"
                  element={
                    <ProtectedRoute>
                      <Layout
                        isSidebarOpen={isSidebarOpen}
                        toggleSidebar={toggleSidebar}
                      />
                    </ProtectedRoute>
                  }
                >
                  <Route path="" element={<ItemsOutlet />}>
                    <Route index element={<ItemsHome />} />

                    <Route path="details/:id" element={<PurchasePreview />} />
                  </Route>
                </Route>
                <Route
                  path="/staff"
                  element={
                    <ProtectedRoute>
                      <Layout
                        isSidebarOpen={isSidebarOpen}
                        toggleSidebar={toggleSidebar}
                      />
                    </ProtectedRoute>
                  }
                >
                  <Route path="" element={<StaffOutlet />}>
                    <Route index element={<StaffDashBoard />} />
                    <Route
                      path="dashboard/:groupId"
                      element={<StaffDashBord />}
                    />
                    <Route
                      path="indirectexpencedetails/:group"
                      element={<IndirectExpensesDetails />}
                    />

                    <Route path="staff" element={<Staff />} />

                    <Route
                      path="staff/all/:employeeId"
                      element={<StafPreviw />}
                    />
                    <Route
                      path="paymasterreports/:transactionId"
                      element={<PayMasterViewEdit />}
                    />
                    <Route
                      path="Pay/:employeeId"
                      element={<EmployeeSalary />}
                    />
                    <Route
                      path="employees/:employeeId"
                      element={<Employees />}
                    />
                    <Route path="driver/:employeeId" element={<Drivers />} />
                    <Route path="setting/:employeeId" element={<Setting />} />

                    <Route
                      path="settings"
                      element={<AllEmployeeSalaryCalculator />}
                    />

                    <Route
                      path="employee/:employeeId"
                      element={<SalesStaff />}
                    />
                    <Route path="attendence" element={<Attendence />} />
                    <Route path="payHeadDetails" element={<PayHeadDetails />} />
                    <Route path="salarySlip" element={<SalarySlipTable />} />
                    <Route
                      path="salarypayheadform"
                      element={<SalaryPayHeadForm />}
                    />
                    <Route path="payhaddetails" element={<PayHeadDetailss />} />
                    <Route path="paymaster" element={<PayMaster />} />
                    <Route
                      path="paymasterpriview"
                      element={<PayMasterPriview />}
                    />
                    <Route
                      path="createemployee"
                      element={<CreateEmployeeGroup />}
                    />
                    <Route
                      path="createemployee/:id"
                      element={<CreateEmployeeGroup1 />}
                    />
                    {/* <Route path="createemployeemain" element={<EmployeeMainHead />} /> */}
                    <Route path="vehicles" element={<VehicleDetailsPage />} />
                    <Route
                      path="vehicle-rent/:ownerName/:vehicleNumber"
                      element={<VehicleRentDetails />}
                    />
                    <Route
                      path="createmainhead"
                      element={<EmployeeCategory />}
                    />
                    <Route
                      path="createvehicle"
                      element={<AddVehicleRegistration />}
                    />
                    <Route
                      path="vehiclesdetails/:groupId"
                      element={<VehicleRegistrationDetail />}
                    />
                  </Route>
                </Route>
                <Route
                  path="/expense"
                  element={
                    <ProtectedRoute>
                      <Layout
                        isSidebarOpen={isSidebarOpen}
                        toggleSidebar={toggleSidebar}
                      />
                    </ProtectedRoute>
                  }
                >
                  <Route path="" element={<ExpenseOutlet />}>
                    <Route path="dashboard" element={<ExpenseDashBoard />} />
                    <Route path="expenseexpense" element={<ExpenseExpense />} />

                    <Route path="allledgerview" element={<AllLedgerView />} />
                  </Route>
                </Route>
                <Route path="/manu" element={<Layout />}>
                  <Route
                    path="ledgerdetails/:groupName"
                    element={<LedgerDetailsPage />}
                  />
                </Route>
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <Layout
                        isSidebarOpen={isSidebarOpen}
                        toggleSidebar={toggleSidebar}
                      />
                    </ProtectedRoute>
                  }
                >
                  <Route path="" element={<ReportTrackerOutlet />}>
                    <Route index element={<ReportDashBoards />} />
                    <Route
                      path="purchaseyearreport"
                      element={<PurchaseYearSearch />}
                    />
                    <Route
                      path="purchasereport/:selectedYear"
                      element={<PurchaseReport />}
                    />
                    <Route path="purchasereport" element={<PurchaseReport />} />
                    <Route path="paymentreport" element={<PaymentReport />} />
                    <Route path="salesereports" element={<SalesReport />} />
                    <Route path="receiptreports" element={<ReceiptReport />} />
                    <Route path="journalreports" element={<JournalReport />} />
                    <Route path="contrareports" element={<ContraReport />} />
                    <Route
                      path="debitNotereports"
                      element={<DebitNoteReport />}
                    />
                    <Route path="profile/:id" element={<Profile />} />
                    <Route
                      path="creditNotereports"
                      element={<CreditNoteReport />}
                    />
                    <Route path="incomemain" element={<ExpenseIncome />} />
                    <Route path="droupreports" element={<AllHeads />} />

                    <Route
                      path="purchasereports/:transactionId"
                      element={<PurchasePreview />}
                    />
                    <Route
                      path="salesreports/:transactionId"
                      element={<SalesPreview />}
                    />
                    <Route
                      path="receiptreports/:transactionId"
                      element={<ReceiptPriviews />}
                    />
                    <Route
                      path="main/:transactionId"
                      element={<PurchasePreview />}
                    />
                    <Route
                      path="paymentreports/:transactionId"
                      element={<PaymentView />}
                    />
                    <Route
                      path="jornalreports/:transactionId"
                      element={<JournalViewEdit />}
                    />
                    <Route
                      path="contrareports/:transactionId"
                      element={<ContraViewEdit />}
                    />
                    <Route
                      path="debitnotes/:transactionId"
                      element={<DebitNotePreviews />}
                    />
                    <Route
                      path="creditnotes/:transactionId"
                      element={<CreditNotePreviews />}
                    />
                    <Route
                      path="purchasereportss/:monthName"
                      element={<DailyTransactionReport />}
                    />
                    <Route
                      path="salesreport/:month"
                      element={<SalesMontReport />}
                    />
                    <Route
                      path="paymentreport/:month"
                      element={<PaymentMontReport />}
                    />
                    <Route
                      path="receiptreport/:month"
                      element={<ReceiptMonthReport />}
                    />
                    <Route
                      path="jornalreport/:month"
                      element={<JournalReportMonth />}
                    />

                    <Route
                      path="contrareport/:month"
                      element={<ContraReportMonth />}
                    />
                    <Route
                      path="debitnote/:month"
                      element={<DebitNoteMonthReport />}
                    />
                    <Route
                      path="creditnote/:month"
                      element={<CreditNoteMonthReport />}
                    />
                  </Route>
                </Route>
              </Routes>
            </AuthProvider>
          </SalaryProvider>
        </ProfitLossProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
