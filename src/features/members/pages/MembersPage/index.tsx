import { Container, Typography } from '@mui/material';
import { MemberList } from '../../components/MemberList';

export const MembersPage = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Members
      </Typography>
      <MemberList />
    </Container>
  );
};