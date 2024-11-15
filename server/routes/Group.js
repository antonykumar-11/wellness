// routes/groupRoutes.js
const express = require("express");
const router = express.Router();
const groupController = require("../controllers/Group");

// Create a new group
router.post("/groups", groupController.createGroup);

// Get all groups
router.get("/groups", groupController.getGroups);

// Get a group by ID
router.get("/groups/:id", groupController.getGroupById);

// Update a group by ID
router.put("/groups/:id", groupController.updateGroup);

// Delete a group by ID
router.delete("/groups/:id", groupController.deleteGroup);

module.exports = router;
