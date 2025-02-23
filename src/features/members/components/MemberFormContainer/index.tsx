import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { MemberForm } from '../MemberForm';
import { useMemberStore } from '@/features/shared/stores/memberStore';
import type { MemberFormData } from '@/features/members/types';

export const MemberFormContainer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMember, updateMember, addMember } = useMemberStore();  // changed createMember to addMember
  const [loading, setLoading] = useState(false);
  // Cambiamos null por undefined para coincidir con el tipo esperado
  const [member, setMember] = useState<MemberFormData | undefined>(undefined);
  
  useEffect(() => {
    if (id) {
      const fetchMember = async () => {
        setLoading(true);
        try {
          const data = await getMember(id);
          setMember(data);
        } catch (error) {
          console.error('Error fetching member:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchMember();
    }
  }, [id, getMember]);

  const handleSubmit = async (data: MemberFormData) => {
    try {
      if (id) {
        await updateMember(id, data);
      } else {
        await addMember(data);  // changed createMember to addMember
      }
      navigate('/members');
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (id && !member) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h5" textAlign="center" py={3}>
          Member not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" mb={3}>
        {id ? 'Edit Member' : 'Add New Member'}
      </Typography>
      <MemberForm onSubmit={handleSubmit} initialData={member} />
    </Container>
  );
};