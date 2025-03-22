import { MemberPayments } from "@/features/payments/pages/MemberPayments";

export const routes = [
  {
    path: "/members/:id/payments",
    element: <MemberPayments />,
  },
];