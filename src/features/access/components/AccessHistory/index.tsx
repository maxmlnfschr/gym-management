import { Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useAccessLogs } from '@/features/access/hooks/useAccessLogs';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AccessLogWithMember } from '@/features/access/types';
import { AccessList } from '../AccessList';

export const AccessHistory = () => {
  return <AccessList />;
};