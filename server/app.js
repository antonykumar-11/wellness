const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const errorMiddleware = require("./middlewares/error");
const connectDatabase = require("./config/database");

// Load environment variables
dotenv.config({ path: path.join(__dirname, "config/config.env") });

const allowedOrigins = [
  "https://www.vedawellness.life",
  "https://wellness-eight.vercel.app",
  "https://wellness-csxhciu9b-antonykumar-11s-projects.vercel.app",
  "http://localhost:5173", // For local development
  process.env.FRONTEND_URL, // Should resolve to https://wellness-9.onrender.com
];

console.log("Frontend URL from .env:", process.env.FRONTEND_URL);

const corsOptions = {
  origin: (origin, callback) => {
    console.log("Request Origin:", origin); // Debug origin
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      console.error("CORS Blocked for Origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"],
};

// Create an instance of express
const app = express();

// Connect to database
connectDatabase();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests
// Handle preflight requests
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

// Routes
const User = require("./routes/userRoutes");
const taxRoutes = require("./routes/taxRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const purchaseVoucherRoutes = require("./routes/purchaseVoucher");
const salesVoucherRoutes = require("./routes/salesVoucherRoutes");
const receiptVouchers = require("./routes/recieptVoucher");
const journalVoucher = require("./routes/journalRoutes");
const paymasterVoucher = require("./routes/payMaster");
const contraVouchers = require("./routes/contraRoutes");
const creditNotes = require("./routes/creditNoteRoutes");
const companyRoutes = require("./routes/companyRoutes");
const tax = require("./routes/findTax");
const getAllTransactions = require("./routes/getAllTransaction");
const stockItems = require("./routes/stockItems");
const stockCategory = require("./routes/stockCategory");
const stockGroups = require("./routes/stockGroup");
const debitNoteRoutes = require("./routes/debitNote");
const EmployeeRoutes = require("./routes/staff/staffRoutes");
const employeeHead = require("./routes/staff/employeeHead");
const payHeadRoutes = require("./routes/staff/payHead");
const operationsRoute = require("./routes/staff/dummyStaff");
const payHeadDetailsRoutes = require("./routes/staff/payHeadDetailsRoutes");
const employeegroupRoutes = require("./routes/staff/employeegroupRoutes");
const attendanceRoutes = require("./routes/staff/attendanceRoutes");
const incomeRoutes = require("./routes/antony1");
const expenseRoutes = require("./routes/expenseExpense");
const clientledgerRoutes = require("./routes/ledgersRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const vehicleRegistrationRoutes = require("./routes/vehicleRegistrationRoutes");
const groupRoutes = require("./routes/Group");
const iin = require("./routes/p&l");
const iiin = require("./routes/antony3");
const attendanceemployees = require("./routes/attendanceEmployees");
const clientLedgeri = require("./routes/ledgerFor");
const transactionRoutes = require("./routes/antony");
const purchaseVoucherRoute = require("./routes/servicePurchaseRoutes");
const salesVoucher = require("./routes/salesService");
const assets = require("./routes/antony3");
const customerRoutes = require("./routes/Customer");

// Registering routes
app.use("/api/v1/auth", User);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/purchases", purchaseVoucherRoutes);
app.use("/api/v1/services/purchases", purchaseVoucherRoute);
app.use("/api/v1/service/sales-vouchers", salesVoucher);
app.use("/api/v1/sales-vouchers", salesVoucherRoutes);
app.use("/api/v1/receipt-vouchers", receiptVouchers);
app.use("/api/v1/journal-vouchers", journalVoucher);
app.use("/api/v1/paymaster", paymasterVoucher);
app.use("/api/v1/contra-vouchers", contraVouchers);
app.use("/api/v1/creditnote", creditNotes);
app.use("/api/v1/debitnote", debitNoteRoutes);
app.use("/api/v1", companyRoutes);
app.use("/api/v1/find", tax);
app.use("/api/v1", groupRoutes);
app.use("/api/v1/transactions", getAllTransactions);
app.use("/api/v1/items", require("./routes/itemRoutes"));
app.use("/api/v1/stocks", stockItems); //333
app.use("/api/v1/stocks", stockCategory); //222
app.use("/api/v1/stocks", stockGroups); //111
app.use("/api/v1/employees", EmployeeRoutes);
app.use("/api/v1/client/ledgers", clientledgerRoutes);
app.use("/api/v1/employeehead", employeeHead);
app.use("/api/v1/payheads", payHeadRoutes);
app.use("/api/v1/operations", operationsRoute);
app.use("/api/v1/payHeadDetails", payHeadDetailsRoutes);
app.use("/api/v1/employeegroups", employeegroupRoutes);
app.use("/api/v1/attendances", attendanceRoutes);
app.use("/api/v1/attendanceemployees", attendanceemployees);
app.use("/api/v1/client/ledger", clientLedgeri);
app.use("/api/v1", vehicleRegistrationRoutes);
app.use("/api/v1/", transactionRoutes);
app.use("/api/v1/expenseincomes", incomeRoutes);
app.use("/api/v1/expenseexpensee", iin);
app.use("/api/v1/expenseexpense", iiin);
app.use("/api/v1/assets", assets);
app.use("/api/v1/invoices", invoiceRoutes);
app.use("/api/v1/transections", require("./routes/transactionRoutes"));
app.use("/api/v1/transection", require("./routes/transectionRoute")); // personal app
app.use("/api/v1/vehicle-rent", require("./routes/vehicleRent")); // personal app
app.use("/api/v1/profits", require("./routes/monthProfit")); // personal app
app.use("/api/v1/customers", customerRoutes); // personal app

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

// Error handling middleware
app.use(errorMiddleware);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT} in ${process.env.NODE_ENV} mode`
  );
});
