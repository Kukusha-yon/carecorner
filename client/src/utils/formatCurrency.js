/**
 * Formats a number as currency
 * @param {number} amount - The amount to format
 * @param {string} [currency='ETB'] - The currency code
 * @param {string} [locale='en-ET'] - The locale to use for formatting
 * @returns {string} The formatted currency string
 */
export const formatCurrency = (amount, currency = 'ETB', locale = 'en-ET') => {
  if (amount === null || amount === undefined) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Formats a number as a percentage
 * @param {number} value - The value to format
 * @param {number} [decimals=0] - Number of decimal places
 * @returns {string} The formatted percentage string
 */
export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined) return '';
  
  return new Intl.NumberFormat('en-ET', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
}; 