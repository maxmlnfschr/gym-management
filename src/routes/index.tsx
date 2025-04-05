import { MemberPayments } from "@/features/payments/pages/MemberPayments";
import { NewPayment } from "@/features/payments/pages/NewPayment";

export const routes = [
  {
    path: "/members/:id/payments",
    element: <MemberPayments />,
  },
  {
    path: "/members/:id/payments/new",
    element: <NewPayment />,
  },
];