import { Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useAccessLogs } from '@/features/access/hooks/useAccessLogs';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AccessLogWithMember } from '@/features/access/types';

export const AccessHistory = () => {
  const { data: accessLogs, isLoading } = useAccessLogs();

  if (isLoading) {
    return <Box>Cargando...</Box>;
  }

  return (
    <List>
      {accessLogs?.map((log) => (
        <Box key={log.id}>
          <ListItem>
            <ListItemText
              primary={`${log.members.first_name} ${log.members.last_name}`}
              secondary={format(new Date(log.check_in), 'PPpp', { locale: es })}
            />
          </ListItem>
          <Divider />
        </Box>
      ))}
    </List>
  );
};