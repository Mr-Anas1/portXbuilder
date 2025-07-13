import DodoPayments from "dodopayments";

let dodopaymentsClient = null;

function getDodopaymentsClient() {
  if (!dodopaymentsClient) {
    const bearerToken =
      process.env.NODE_ENV === "development"
        ? process.env.DODO_API_KEY_TEST
        : process.env.DODO_API_KEY_LIVE;

    const environment =
      process.env.NODE_ENV === "development" ? "test_mode" : "live_mode";

    if (!bearerToken) {
      throw new Error(
        `Dodo Payments API key not configured for ${environment} environment`
      );
    }

    dodopaymentsClient = new DodoPayments({
      bearerToken,
      environment,
    });
  }
  return dodopaymentsClient;
}

export const dodopayments = {
  get customers() {
    return getDodopaymentsClient().customers;
  },
  get subscriptions() {
    return getDodopaymentsClient().subscriptions;
  },
  // Add other methods as needed
  ...getDodopaymentsClient(),
};
