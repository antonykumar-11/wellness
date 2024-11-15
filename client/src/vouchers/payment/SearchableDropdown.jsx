import React, { useState } from "react";

const ChildComponent = ({ item, onInputChange }) => {
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onInputChange(item.id, name, value);
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    setFocusedField(name);
    // Clear default "0" value when focused
    if (item && item[name] === "0") {
      onInputChange(item.id, name, "");
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setFocusedField(null);
    // Restore default "0" value if input is empty
    if (item && item[name] === "") {
      onInputChange(item.id, name, "0");
    }
  };

  // Ensure item is defined before rendering
  if (!item) {
    return null;
  }

  return (
    <div>
      <h2>Child Component</h2>
      <div>
        <label>
          Ledger:
          <input
            type="text"
            name="ledger"
            value={
              focusedField === "ledger"
                ? item.ledger || ""
                : item.ledger === "0" && focusedField !== "ledger"
                ? ""
                : item.ledger || "0"
            }
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </label>
      </div>
      {/* Repeat similar structure for other input fields */}
    </div>
  );
};

export default ChildComponent;
