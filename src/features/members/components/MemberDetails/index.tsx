import {
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  Paper,
  Grid,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react"; // Added this import
import { MembershipList } from "@/features/memberships/components/MembershipList";
import { MembershipStatus } from "@/features/memberships/components/MembershipStatus";
import { MembershipActions } from "@/features/memberships/components/MembershipActions";
import { PaymentHistory } from "@/features/memberships/components/PaymentHistory";
import { useMember } from "@/features/members/hooks/useMember";
import { Email, Phone, Edit, MoreVert, Delete } from "@mui/icons-material";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material"; // Añadir estos imports

export const MemberDetails = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showQR, setShowQR] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { member, isLoading } = useMember(id);
  const { deleteMember } = useMember();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (isLoading) {
    return <Typography>Cargando...</Typography>;
  }

  if (!member) {
    return <Typography>Miembro no encontrado</Typography>;
  }
 
  const handleDelete = async () => {
    try {
      await deleteMember(id!);
      handleMenuClose();
      navigate('/members');
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Stack spacing={3}>
        {/* Primera Paper - Información del miembro */}
        <Paper sx={{ p: 3 }}>
          <Stack spacing={3}>
            {isMobile ? (
              // Vista móvil
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h5">
                    {member.first_name} {member.last_name}
                  </Typography>
                  <IconButton onClick={handleMenuClick}>
                    <MoreVert />
                  </IconButton>
                </Stack>

                <Stack spacing={1} width="100%">
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/members/${id}/membership`)}
                    fullWidth
                  >
                    Nueva Membresía
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setShowQR(true)}
                    fullWidth
                  >
                    Mostrar QR
                  </Button>
                </Stack>
              </Stack>
            ) : (
              // Vista desktop
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h5">
                  {member.first_name} {member.last_name}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/members/${id}/membership`)}
                  >
                    Nueva Membresía
                  </Button>
                  <Button variant="outlined" onClick={() => setShowQR(true)}>
                    Mostrar QR
                  </Button>
                  <IconButton onClick={handleMenuClick}>
                    <MoreVert />
                  </IconButton>
                </Stack>
              </Stack>
            )}
            {/* Rest of the content remains unchanged */}
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

        {/* Segunda Paper - Historial */}
        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6">Historial de Membresías y Pagos</Typography>
            <PaymentHistory memberId={id!} />
          </Stack>
        </Paper>
      </Stack>

      {/* Menu y Dialog se mantienen igual */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            navigate(`/members/edit/${id}`);
            handleMenuClose();
          }}
        >
          <Edit sx={{ mr: 1 }} fontSize="small" />
          Editar
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Delete sx={{ mr: 1 }} fontSize="small" />
          Eliminar
        </MenuItem>
      </Menu>

      <Dialog open={showQR} onClose={() => setShowQR(false)}>
        <DialogTitle>
          QR de Acceso - {member.first_name} {member.last_name}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <QRCodeSVG value={id || ""} size={256} />
        </DialogContent>
      </Dialog>
    </>
  );
};
