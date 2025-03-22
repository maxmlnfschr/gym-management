import { createContext, useContext, ReactNode } from "react";
import { usePayments } from "../hooks/usePayments";

interface PaymentContextProps {
  children: ReactNode;
  memberId?: string;
}

const PaymentContext = createContext<ReturnType<typeof usePayments> | undefined>(
  undefined
);

export const PaymentProvider = ({ children, memberId }: PaymentContextProps) => {
  const paymentData = usePayments(memberId);

  return (
    <PaymentContext.Provider value={paymentData}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePaymentContext = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error("usePaymentContext must be used within a PaymentProvider");
  }
  return context;
};