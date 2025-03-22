export const PAYMENT_METHODS = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
  other: "Otro",
} as const;

export const PAYMENT_STATUS = {
  pending: "Pendiente",
  paid: "Pagado",
} as const;