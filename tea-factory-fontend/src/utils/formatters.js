/**
 * Format currency values consistently throughout the application
 * @param {number} amount - The amount to format
 * @param {boolean} includeSymbol - Whether to include the currency symbol
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, includeSymbol = true) => {
  // Format number with commas as thousand separators and 2 decimal places
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  // Return with LKR symbol if includeSymbol is true
  return includeSymbol ? `LKR ${formattedAmount}` : formattedAmount;
};

/**
 * Format currency for HTML export (no symbol, just the number)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted number string
 */
export const formatCurrencyForExport = (amount) => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};