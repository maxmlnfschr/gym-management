import { useNavigate, useParams } from 'react-router-dom';
import { MembershipForm } from '@/features/memberships/components/MembershipForm';
import { useMemberships } from '@/features/memberships/hooks/useMemberships';
import { MembershipFormData } from '@/features/memberships/types';
import { useToast } from '@/features/shared/hooks/useToast';

export const MembershipFormContainer = () => {
  const { id: memberId } = useParams();
  const navigate = useNavigate();
  const { createMembership } = useMemberships();
  const { showToast } = useToast();

  const handleSubmit = async (data: MembershipFormData) => {
    try {
      await createMembership.mutateAsync({
        ...data,
        memberId: memberId!,
      });
      
      showToast('Membresía creada exitosamente', 'success');
      navigate(`/members/${memberId}`);
    } catch (error) {
      showToast('Error al crear la membresía', 'error');
    }
  };

  return <MembershipForm onSubmit={handleSubmit} />;
};