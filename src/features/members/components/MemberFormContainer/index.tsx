import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { MemberForm } from "@/features/members/components/MemberForm";
import { useMemberStore } from "@/features/shared/stores/memberStore";
import type { MemberFormData } from "@/features/members/types";

export const MemberFormContainer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMember, updateMember, addMember } = useMemberStore(); // changed createMember to addMember
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
          console.error("Error al obtener miembro:", error);
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
        await addMember(data);
      }
      navigate("/members");
    } catch (error) {
      console.error("Error al guardar miembro:", error);
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
          Miembro no encontrado
        </Typography>
      </Container>
    );
  }
  return (
    <Box sx={{ mt: 1 }}>
      <MemberForm onSubmit={handleSubmit} initialData={member} />
    </Box>
  );
};
