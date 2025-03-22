import { Container, Typography } from "@mui/material";
import { MemberForm } from "@/features/members/components/MemberForm";
import { useMemberStore } from "@/features/shared/stores/memberStore";
import type { MemberFormData } from "@/features/members/types";
import type { MembershipFormData } from "@/features/memberships/types";
import { useNavigate } from "react-router-dom";

export const AddMemberPage = () => {
  const navigate = useNavigate();
  const { addMember } = useMemberStore();

  const handleSubmit = async (data: MemberFormData & { membership?: MembershipFormData }) => {
    try {
      await addMember(data);
      navigate("/members");
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  return (
    <>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Agregar nuevo miembro
      </Typography>
      <MemberForm onSubmit={handleSubmit} />
    </>
  );
};
