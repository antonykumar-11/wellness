const Customer = require("../models/CustomerSchema");

// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const { name, phone_number, last_called, next_call } = req.body;

    // Create new customer without passing an 'id'
    const newCustomer = new Customer({
      name,
      phone_number,
      last_called: last_called || null,
      next_call: next_call || null,
    });

    await newCustomer.save();
    res
      .status(201)
      .json({ message: "Customer created successfully", newCustomer });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Phone number already exists." });
    }
    res.status(500).json({ message: "Error creating customer", error });
  }
};

// Fetch all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error });
  }
};
// Fetch a single customer by phone number
exports.getCustomerByPhone = async (req, res) => {
  try {
    const { phone_number } = req.params;
    const customer = await Customer.findOne({ phone_number });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer", error });
  }
};
// Update a customer's details
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params; // Get id from request parameters
    console.log("id", id);
    const updatedData = req.body;

    // Find the customer by its _id, not id
    const customer = await Customer.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res
      .status(200)
      .json({ message: "Customer updated successfully", customer });
  } catch (error) {
    res.status(500).json({ message: "Error updating customer", error });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params; // Get id from request parameters

    // Use findByIdAndDelete instead of findOneAndDelete and query by _id
    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting customer", error });
  }
};
