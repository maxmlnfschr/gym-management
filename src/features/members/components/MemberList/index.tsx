import { useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Stack,
  CircularProgress,
  Fab
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useMemberStore } from '@/features/shared/stores/memberStore';
import { useNavigate } from 'react-router-dom';

export const MemberList = () => {
  const navigate = useNavigate();
  const { members, loading, fetchMembers, deleteMember } = useMemberStore();

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Stack spacing={2}>
        {members.map((member) => (
          <Card key={member.id}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6">
                    {member.first_name} {member.last_name}
                  </Typography>
                  <Typography color="textSecondary">{member.email}</Typography>
                  {member.phone && (
                    <Typography color="textSecondary">{member.phone}</Typography>
                  )}
                </Box>
                <Stack direction="row" spacing={1}>
                  <IconButton 
                    onClick={() => navigate(`/members/edit/${member.id}`)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => deleteMember(member.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
      
      <Fab 
        color="primary" 
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => navigate('/members/add')}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};