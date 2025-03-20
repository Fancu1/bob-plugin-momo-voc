/**
 * Convert a string to an array of words
 * @param {string|string[]} input - The input to convert
 * @returns {string[]} Array of trimmed words
 */
function stringToArray(input) {
  // If already an array, just return it
  if (Array.isArray(input)) {
    return input.map(item => String(item).trim()).filter(Boolean);
  }
  
  // Convert to string and handle empty input
  const str = String(input || '').trim();
  if (!str) {
    return [];
  }
  
  // Split by comma if present
  if (str.includes(",")) {
    return str.split(",").map(word => word.trim()).filter(Boolean);
  }
  
  // If no comma, treat as a single word
  return [str];
}

/**
 * Convert an array to a comma-separated string
 * @param {string[]|string} arr - The array or string to convert
 * @returns {string} The converted comma-separated string
 */
function arrayToString(arr) {
  // If already a string, just return it
  if (typeof arr === 'string') {
    return arr.trim();
  }
  
  // If not an array, convert to array first
  if (!Array.isArray(arr)) {
    return String(arr || '').trim();
  }
  
  // Filter out empty values, trim and join
  return arr.filter(Boolean).map(item => String(item).trim()).join(", ");
}

module.exports = {
  stringToArray,
  arrayToString,
};
