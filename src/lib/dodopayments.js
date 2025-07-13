import DodoPayments from "dodopayments";

// Get the appropriate API key based on environment
const getApiKey = () => {
  const apiKey =
    process.env.NODE_ENV === "development"
      ? process.env.DODO_API_KEY_TEST
      : process.env.DODO_API_KEY_LIVE;

  if (!apiKey) {
    console.warn(
      `Dodo Payments API key not found for ${process.env.NODE_ENV} environment`
    );
    return null;
  }

  return apiKey;
};

const apiKey = getApiKey();

// Only initialize if we have an API key
export const dodopayments = apiKey
  ? new DodoPayments({
      bearerToken: apiKey,
      environment:
        process.env.NODE_ENV === "development" ? "test_mode" : "live_mode",
    })
  : null;

// Helper function to check if dodopayments is properly configured
export const isDodoPaymentsConfigured = () => {
  return dodopayments !== null;
};
