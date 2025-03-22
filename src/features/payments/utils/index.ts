import { Payment } from "../types";

export const getPaymentStatusColor = (status: Payment["status"]) => {
  switch (status) {
    case "paid":
      return "success";
    case "pending":
      return "warning";
    default:
      return "default";
  }
};
