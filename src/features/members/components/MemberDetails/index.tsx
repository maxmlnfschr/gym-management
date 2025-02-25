import { Box, Typography, Button, Stack, Divider, Paper, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';  // Added this import
import { MembershipList } from '@/features/memberships/components/MembershipList';
import { MembershipStatus } from '@/features/memberships/components/MembershipStatus';
import { MembershipActions } from '@/features/memberships/components/MembershipActions';
import { PaymentHistory } from '@/features/memberships/components/PaymentHistory';
import { useMember } from '@/features/members/hooks/useMember';
import { Email, Phone, Edit } from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

export const MemberDetails = () => {
  const [showQR, setShowQR] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { member, isLoading } = useMember(id);

  if (isLoading) {
    return <Typography>Cargando...</Typography>;
  }

  if (!member) {
    return <Typography>Miembro no encontrado</Typography>;
  }

  return (
    <>
      <Stack spacing={3}>
        <Paper sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h5">
                {member.first_name} {member.last_name}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button 
                  startIcon={<Edit />}
                  onClick={() => navigate(`/members/edit/${id}`)}
                >
                  Editar
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => navigate(`/members/${id}/membership`)}
                >
                  Nueva Membresía
                </Button>
                <Button 
                  variant="outlined"
                  onClick={() => setShowQR(true)}
                >
                  Mostrar QR
                </Button>
              </Stack>
            </Stack>
        
            <MembershipStatus memberId={id!} />
            <MembershipActions memberId={id!} />
        
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Email color="action" />
                  <Typography>{member.email}</Typography>
                </Stack>
              </Grid>
              {member.phone && (
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Phone color="action" />
                    <Typography>{member.phone}</Typography>
                  </Stack>
                </Grid>
              )}
            </Grid>
          </Stack>
        </Paper>
        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6">Historial de Membresías y Pagos</Typography>
            <PaymentHistory memberId={id!} />
          </Stack>
        </Paper>
      </Stack>
      <Dialog open={showQR} onClose={() => setShowQR(false)}>
        <DialogTitle>QR de Acceso - {member.first_name} {member.last_name}</DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <QRCodeSVG 
            value={id || ''} 
            size={256}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};