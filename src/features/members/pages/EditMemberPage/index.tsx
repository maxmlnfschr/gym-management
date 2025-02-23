import { Container, Typography, CircularProgress, Box } from '@mui/material';
import { MemberForm } from '@/features/members/components/MemberForm';
import { useMemberStore } from '@/features/shared/stores/memberStore';
import type { MemberFormData } from '@/features/members/types';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

export const EditMemberPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { updateMember, selectedMember, loading } = useMemberStore();

  const handleSubmit = async (data: MemberFormData) => {
    try {
      if (!id) return;
      await updateMember(id, data);
      navigate('/members');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (!selectedMember) {
    return (
      <Typography color="error" align="center">
        Member not found
      </Typography>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Edit Member
      </Typography>
      <MemberForm 
        onSubmit={handleSubmit} 
        initialData={{
          first_name: selectedMember.first_name,
          last_name: selectedMember.last_name,
          email: selectedMember.email,
          phone: selectedMember.phone || '',
          notes: selectedMember.notes || ''
        }} 
      />
    </Container>
  );
};