import React, { useState } from "react";
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
import PurchaseDetails from "./vouchers/PurchaseDetails";
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
import SalaryPayHeadForm from "./Staffmanagement/SalaryPayHeadForm";
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
import IndirectExpensesDetails from "./calculation/IndirectIncomeDetails";
import ProfitAndLoss from "./BalanceSheet/ProfitAndLossAccount";
import LedgerDeailsAllNeeed from "./ledgerdetails/LedgerDeailsAllNeed";
import DashboardOutlet from "./dashboard/DashboardOutlet";
import DashboarDisplay from "./dashboard/DashboarDisplay";
import AllHeads from "./salesPriview/Allheads";
import LedgerDetailsPage from "./BalanceSheet/LedgerViewLink";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Loader from "./auth/Loader";
import AdminDashBoard from "./admin/AdminDashBoard";
import ProtectedRoute from "./auth/ProtectRoute";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Loader />} />
        <Route
          path="/login"
          element={<Login onLogin={() => setIsAuthenticated(true)} />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/admin" : "/login"} />}
        />

        {/* Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              element={<Layout />}
            />
          }
        >
          <Route index element={<AdminDashBoard />} />
        </Route>

        <Route
          path="/vouchers"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              element={<Layout />}
            />
          }
        >
          <Route path="" element={<VoucherOutlet />} />
          <Route index element={<PurchaseForm />} />
          <Route path="paymentform" element={<PaymentForm />} />
          <Route path="purchasedetails" element={<PurchaseDetails />} />
          <Route path="month/:month" element={<DebitNote />} />
          <Route path="day/:id" element={<PurchaseDetailsPreview />} />
          <Route path="purchase/:id" element={<PurchaseUpdate />} />
          <Route path="contra" element={<Contra />} />
          <Route path="sales" element={<SalesDatails />} />
          <Route path="receipt" element={<ReceiptDatails />} />
          <Route path="journal" element={<JournalVoucher />} />
          <Route path="journals/:journalId" element={<JournalByMonth />} />
          <Route path="contravoucher" element={<ContraVoucher />} />
          <Route path="creditnote" element={<CreditNoteee />} />
          <Route path="debitnote" element={<DebitNoteee />} />
        </Route>

        {/* Other protected routes follow the same pattern */}
        <Route
          path="/preview"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              element={<Layout />}
            />
          }
        >
          <Route index element={<SalePrevieweOutlet />} />
          <Route path="receiptPriview" element={<ReceiptPriview />} />
          <Route path="debitnotepriview" element={<DebitNotePriview />} />
          <Route path="creditnotepriview" element={<CreditNotePreview />} />
          <Route path="journalpreview" element={<JournalPreview />} />
          <Route path="contrapreview" element={<ContraPreview />} />
          <Route path="paymentpreview" element={<PaymentView />} />
          <Route path="indirectexpenses" element={<IndirectExpenses />} />
          <Route
            path="indirectexpensesdetails"
            element={<IndirectExpensesDetails />}
          />
          <Route path="profitandloss" element={<ProfitAndLoss />} />
        </Route>

        {/* Remaining routes follow the same pattern */}
        <Route
          path="/invoice"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              element={<Layout />}
            />
          }
        >
          <Route index element={<ItemsOutlet />} />
          <Route path="item-home" element={<ItemsMain />} />
          <Route path="item-lists" element={<ItemsList />} />
        </Route>

        <Route
          path="/staff"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              element={<Layout />}
            />
          }
        >
          <Route index element={<EmpolyeeManagementSystem />} />
          <Route path="dashboard/:groupId" element={<StaffDashBord />} />
          <Route path="staff" element={<Staff />} />
          <Route path="Pay/:employeeId" element={<EmployeeSalary />} />
          <Route path="setting/:employeeId" element={<Setting />} />
          <Route path="employee/:employeeId" element={<SalesStaff />} />
          <Route path="attendence" element={<Attendence />} />
          <Route path="payHeadDetails" element={<PayHeadDetails />} />
          <Route path="salarySlip" element={<SalarySlipTable />} />
          <Route path="salarypayheadform" element={<SalaryPayHeadForm />} />
          <Route path="payhaddetails" element={<PayHeadDetailss />} />
        </Route>

        <Route
          path="/expense"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              element={<Layout />}
            />
          }
        >
          <Route index element={<ExpenseOutlet />} />
          <Route path="dashboard" element={<ExpenseDashBoard />} />
          <Route path="expenseexpense" element={<ExpenseExpense />} />
          <Route path="incomemain" element={<ExpenseIncome />} />
          <Route path="allledgerview" element={<AllLedgerView />} />
          <Route path="ledgerdetails/:id" element={<LedgerDeailsAllNeeed />} />
        </Route>

        <Route
          path="/manu"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              element={<Layout />}
            />
          }
        >
          <Route index element={<DashboardOutlet />} />
          <Route
            path="ledgerdetails/:groupName"
            element={<LedgerDetailsPage />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
