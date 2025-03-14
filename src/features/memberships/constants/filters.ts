import type { FilterGroup } from '@/components/common/InlineFilters';

export const MEMBERSHIP_STATUS_FILTERS: FilterGroup = {
  name: 'membership_status',
  options: [
    { id: 'active', label: 'Activa' },
    { id: 'expiring', label: 'Por vencer' },
    { id: 'expired', label: 'Vencida' },
    { id: 'pending', label: 'Pago pendiente' },
    { id: 'no_membership', label: 'Sin membresía' }
  ]
};