import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { PaymentHistory } from "../PaymentHistory";
import { EmptyState } from "@/components/common/EmptyState";
import { Payments as PaymentsIcon } from "@mui/icons-material";

interface MembershipPaymentsProps {
  memberId: string;
}

export const MembershipPayments = ({ memberId }: MembershipPaymentsProps) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Historial de Pagos
      </Typography>
      <PaymentHistory
        memberId={memberId}
        emptyState={
          <EmptyState
            icon={<PaymentsIcon />}
            title="No hay pagos registrados"
            description="No se encontraron pagos para esta membresía"
          />
        }
      />
    </Box>
  );
};