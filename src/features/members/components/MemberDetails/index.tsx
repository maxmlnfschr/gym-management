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
// Modificar el import para solo traer lo necesario
import { MembershipList } from "@/features/memberships/components/MembershipList";
import { MembershipStatus } from "@/features/memberships/components/MembershipStatus";
import { PaymentHistory } from "@/features/memberships/components/PaymentHistory";
import { useMember } from "@/features/members/hooks/useMember";
import {
  Email,
  Phone,
  Edit,
  MoreVert,
  Delete,
  Payment,
} from "@mui/icons-material";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material"; // Añadir estos imports
// Agregar este import junto a los demás
import { useMemberships } from "@/features/memberships/hooks/useMemberships";

export const MemberDetails = () => {
  const theme = useTheme();
  // Modificar esta línea
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Cambiado de "sm" a "md"
  const [showQR, setShowQR] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { member, isLoading } = useMember(id);
  const { deleteMember } = useMember();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // Agregar este hook junto a los demás hooks
  const { currentMembership } = useMemberships(id!);
  // Agregar esta función antes del return
  const handleMembershipAction = () => {
    if (currentMembership) {
      navigate(`/members/${id}/membership`, {
        state: {
          isRenewal: true,
          previousMembership: currentMembership,
        },
      });
    } else {
      navigate(`/members/${id}/membership`);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMember(id!);
      handleMenuClose();
      navigate("/members");
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
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
            {isMobile ? (
              // Vista móvil
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h5">
                    {member?.first_name} {member?.last_name}
                  </Typography>
                  <IconButton onClick={handleMenuClick}>
                    <MoreVert />
                  </IconButton>
                </Stack>
                <MembershipStatus memberId={id!} />
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    onClick={handleMembershipAction}
                    sx={{
                      flex: 1,
                      whiteSpace: "normal",
                      lineHeight: 1.2,
                    }}
                  >
                    {currentMembership ? 'Renovar\nmembresía' : 'Nueva\nmembresía'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setShowQR(true)}
                    sx={{ flex: 1 }}
                  >
                    Mostrar QR
                  </Button>
                </Stack>
                <Button
                  startIcon={<Payment />}
                  variant="outlined"
                  onClick={() => navigate(`/members/${id}/payments`)}
                  fullWidth
                >
                  Ver pagos
                </Button>
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
                <Stack direction="row" spacing={2} alignItems="center">
                  <MembershipStatus memberId={id!} />
                  <Button variant="contained" onClick={handleMembershipAction}>
                    {currentMembership ? 'Renovar membresía' : 'Nueva membresía'}
                  </Button>
                  <Button variant="outlined" onClick={() => setShowQR(true)}>
                    Mostrar QR
                  </Button>
                  <Button
                    startIcon={<Payment />}
                    variant="outlined"
                    onClick={() => navigate(`/members/${id}/payments`)}
                  >
                    Ver pagos
                  </Button>
                  <IconButton onClick={handleMenuClick}>
                    <MoreVert />
                  </IconButton>
                </Stack>
              </Stack>
            )}

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
            <Typography variant="h6">
              Historial de membresías y pagos
            </Typography>
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
