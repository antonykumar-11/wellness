const computeComputedValue = (head, results) => {
  const { computedOn } = head;

  // Ensure computedOn is defined and a string
  if (!computedOn || typeof computedOn !== "string") {
    console.error(`Invalid computedOn value for ${head.payHeadName}`);
    return 0;
  }

  // Replace placeholders with actual values
  const expression = computedOn
    .split(/\s*\+\s*/)
    .map((item) => {
      const name = item.trim();
      if (results[name] !== undefined) {
        return results[name];
      }
      return 0; // Default to 0 if the value is not found
    })
    .join(" + ");

  // Create a function to evaluate the expression
  let result = 0;
  try {
    result = eval(expression);
  } catch (e) {
    console.error("Error evaluating expression:", e);
  }

  return isNaN(result) ? 0 : result;
};
