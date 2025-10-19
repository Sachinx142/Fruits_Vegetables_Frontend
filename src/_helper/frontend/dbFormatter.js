/**
 * Format a date string or Date object to "YYYY-MM-DD"
 * for HTML <input type="date">
 * @param {string|Date} dateInput
 * @returns {string} formatted date or empty string if invalid
 */
function formatDateForInput(dateInput) {
  if (!dateInput) return "";

  var date = new Date(dateInput);

  if (isNaN(date.getTime())) return "";

  return date.toISOString().split("T")[0];
}

// Export the function
module.exports = { formatDateForInput };
