import { PlanType } from "../types";

export const getPlanTypeLabel = (type: PlanType): string => {
  const labels: Record<PlanType, string> = {
    monthly: "Mensual",
    quarterly: "Trimestral",
    annual: "Anual",
    modify: "Modificado",
  };
  return labels[type] || "Desconocido";
};

export const getMembershipPlanName = (membership: {
  membership_plans?: { name: string } | null;
  plan_type: PlanType;
}): string => {
  // Si existe un plan personalizado, usamos su nombre
  if (membership.membership_plans?.name) {
    return membership.membership_plans.name;
  }

  // Si no hay plan personalizado, usamos el tipo de plan
  return getPlanTypeLabel(membership.plan_type);
};
