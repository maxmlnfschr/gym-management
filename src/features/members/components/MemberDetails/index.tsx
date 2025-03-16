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
import { useState } from "react";
import { MembershipList } from "@/features/memberships/components/MembershipList";
import { MembershipStatus } from "@/features/memberships/components/MembershipStatus";
import { MembershipHistory } from "@/features/memberships/components/MembershipHistory";
import { useMember } from "@/features/members/hooks/useMember";
import {
  Email,
  Phone,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Payment,
} from "@mui/icons-material";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import { useMemberships } from "@/features/memberships/hooks/useMemberships";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { ActionMenu } from "@/components/common/ActionMenu";
import { CardMembership } from "@mui/icons-material";
import { EmptyState } from "@/components/common/EmptyState";
import { TabPanel } from "@/components/common/TabPanel";  // Añadir esta importación
import { Tabs, Tab } from "@mui/material";  // Añadir esta importación
import { useMembershipPayments } from "@/features/memberships/hooks/useMembershipPayments"; // Añadir esta importación
import { MembershipPayments } from "@/features/memberships/components/MembershipPayments";  // Añadir esta importación

export const MemberDetails = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [showQR, setShowQR] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const { member, isLoading } = useMember(id);
  const { deleteMember } = useMember();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  // Agregar este hook junto a los demás hooks
  const { currentMembership } = useMemberships(id!);
  const { payments, isLoading: isLoadingPayments } = useMembershipPayments(id!);

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteMember(id!);
      setConfirmDialogOpen(false);
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
    return (
      <LoadingScreen
        fullScreen={false}
        message="Cargando información del miembro..."
      />
    );
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
                  <ActionMenu
                    actions={[
                      {
                        label: "Editar",
                        icon: <EditIcon fontSize="small" />,
                        onClick: () => navigate(`/members/edit/${id}`),
                        color: "inherit" as const,
                      },
                      {
                        label: "Eliminar",
                        icon: <DeleteIcon fontSize="small" />,
                        onClick: handleDeleteClick,
                        color: "inherit" as const,
                      },
                    ]}
                  />
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
                    {currentMembership
                      ? "Renovar\nmembresía"
                      : "Nueva\nmembresía"}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setShowQR(true)}
                    sx={{ flex: 1 }}
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
                <Stack direction="row" spacing={2} alignItems="center">
                  <MembershipStatus memberId={id!} />
                  <Button variant="contained" onClick={handleMembershipAction}>
                    {currentMembership
                      ? "Renovar membresía"
                      : "Nueva membresía"}
                  </Button>
                  <Button variant="outlined" onClick={() => setShowQR(true)}>
                    Mostrar QR
                  </Button>
                  <ActionMenu
                    actions={[
                      {
                        label: "Editar",
                        icon: <EditIcon fontSize="small" />,
                        onClick: () => navigate(`/members/edit/${id}`),
                        color: "inherit" as const,
                      },
                      {
                        label: "Eliminar",
                        icon: <DeleteIcon fontSize="small" />,
                        onClick: handleDeleteClick,
                        color: "inherit" as const,
                      },
                    ]}
                  />
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

        {/* Segunda Paper - Historial Unificado */}
        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6">Historial</Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Membresías" />
                <Tab label="Pagos" />
              </Tabs>
            </Box>
            <TabPanel value={activeTab} index={0}>
              <MembershipHistory 
                memberId={id!} 
                emptyState={
                  <EmptyState
                    icon={<CardMembership sx={{ fontSize: 40, color: "text.secondary" }} />}
                    title="Sin historial de membresías"
                    description="Este miembro aún no tiene registros de membresías"
                  />
                }
              />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <MembershipPayments 
                payments={payments || []}
                isLoading={isLoadingPayments}
              />
            </TabPanel>
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
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Editar
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
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

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Eliminar miembro"
        message="¿Estás seguro de que deseas eliminar este miembro? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialogOpen(false)}
        severity="error"
      />
    </>
  );
};
