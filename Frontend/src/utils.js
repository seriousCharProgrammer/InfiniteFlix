export function extractErrorMessage(error) {
  // Check if the response has the 'error' field in the data
  return (
    error.response?.data?.error ||
    error.response?.data?.message ||
    error.message ||
    error.toString()
  );
}
