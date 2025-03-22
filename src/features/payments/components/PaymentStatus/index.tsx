import { StatusChip } from "@/components/common/StatusChip";
import { Payment } from "../../types";

interface PaymentStatusProps {
  status: Payment["status"];
}

export const PaymentStatus = ({ status }: PaymentStatusProps) => {
  return <StatusChip status={status} context="payment" />;
};