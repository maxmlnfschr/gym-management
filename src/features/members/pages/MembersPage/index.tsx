import { Container, Typography } from '@mui/material';
import { MemberList } from '@/features/members/components/MemberList';

export const MembersPage = () => {
  return (
    <Container maxWidth="md">
      <MemberList />
    </Container>
  );
};