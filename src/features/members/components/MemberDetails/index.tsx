import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Grid,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
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
import { TabPanel } from "@/components/common/TabPanel";
import { Tabs, Tab } from "@mui/material";
import { usePayments } from "@/features/payments/hooks/usePayments";
import { PaymentHistory } from "@/features/payments/components/PaymentHistory";
import { formatCurrency } from "@/utils/formatters";
import { Tooltip } from "@mui/material";
import { PaymentDialog } from "@/features/payments/components/PaymentDialog";

export const MemberDetails = () => {
  // Add this state with the others at the top
  const [selectedMembership, setSelectedMembership] = useState<any>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [showQR, setShowQR] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const { member, isLoading } = useMember(id);
  const { currentMembership, memberships } = useMemberships(id!);
  const hasPendingPayments = memberships?.some(
    (m) => m.payment_status === "pending"
  );
  const { deleteMember } = useMember();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { payments, isLoading: isLoadingPayments } = usePayments(id!);

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

  // Modificar el handlePaymentAction
  const handlePaymentAction = () => {
    const pendingMembership = memberships?.find(
      (m) => m.payment_status === "pending"
    );
    if (pendingMembership) {
      setSelectedMembership(pendingMembership);
      setShowPaymentDialog(true);
    }
  };

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
                  {hasPendingPayments ? (
                    <Tooltip title="Debe saldar la membresía pendiente antes de renovar">
                      <span style={{ flex: 1 }}>
                        <Button
                          variant="contained"
                          disabled
                          onClick={handleMembershipAction}
                          sx={{
                            width: "100%",
                            whiteSpace: "normal",
                            lineHeight: 1.2,
                          }}
                        >
                          {currentMembership
                            ? "Renovar\nmembresía"
                            : "Nueva\nmembresía"}
                        </Button>
                      </span>
                    </Tooltip>
                  ) : (
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
                  )}
                  {/* Resto de los botones se mantienen igual */}
                  {memberships?.some((m) => m.payment_status === "pending") && (
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={handlePaymentAction}
                      sx={{ flex: 1 }}
                      startIcon={<Payment />}
                    >
                      Pago{"\n"}Pendiente
                    </Button>
                  )}
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
                  {member?.first_name} {member?.last_name}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <MembershipStatus memberId={id!} />
                  <Stack direction="row" spacing={2}>
                    {hasPendingPayments ? (
                      <Tooltip title="Debe saldar la membresía pendiente antes de renovar">
                        <span style={{ flex: 1 }}>
                          <Button
                            variant="contained"
                            disabled
                            onClick={handleMembershipAction}
                            sx={{
                              width: "100%",
                              whiteSpace: "normal",
                              lineHeight: 1.2,
                            }}
                          >
                            {currentMembership
                              ? "Renovar\nmembresía"
                              : "Nueva\nmembresía"}
                          </Button>
                        </span>
                      </Tooltip>
                    ) : (
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
                    )}
                    {memberships?.some(
                      (m) => m.payment_status === "pending"
                    ) && (
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={handlePaymentAction}
                        sx={{ flex: 1 }}
                        startIcon={<Payment />}
                      >
                        Pago{"\n"}Pendiente
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      onClick={() => setShowQR(true)}
                      sx={{ flex: 1 }}
                    >
                      Mostrar QR
                    </Button>
                  </Stack>
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
                  <Typography>{member?.email}</Typography>
                </Stack>
              </Grid>
              {member?.phone && (
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Phone color="action" />
                    <Typography>{member?.phone}</Typography>
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
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
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
                    icon={
                      <CardMembership
                        sx={{ fontSize: 40, color: "text.secondary" }}
                      />
                    }
                    title="Sin historial de membresías"
                    description="Este miembro aún no tiene registros de membresías"
                  />
                }
              />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <PaymentHistory
                memberId={id!}
                emptyState={
                  <EmptyState
                    icon={<Payment />}
                    title="Sin pagos"
                    description="Este miembro no tiene pagos registrados"
                  />
                }
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
          QR de Acceso - {member?.first_name} {member?.last_name}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <QRCodeSVG
            value={JSON.stringify({
              v: "1",
              id: id,
              n: `${member?.first_name} ${member?.last_name}`,
            })}
            size={256}
          />
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

      <Dialog
        open={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Pagos Pendientes</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {memberships
              ?.filter((m) => m.payment_status === "pending")
              .map((membership) => (
                <Paper
                  key={membership.id}
                  sx={{ p: 2, bgcolor: "background.default" }}
                >
                  <Stack spacing={1}>
                    <Typography variant="subtitle1">
                      Plan: {membership.membership_plans?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fecha:{" "}
                      {new Date(membership.start_date).toLocaleDateString()}
                    </Typography>
                    <Typography color="warning.main" fontWeight="medium">
                      Pendiente: {formatCurrency(membership.pending_amount)}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        navigate(`/members/${id}/membership-payments/new`, {
                          state: {
                            membership,
                            isPendingPayment: true,
                          },
                        });
                        setShowPaymentDialog(false);
                      }}
                    >
                      Registrar Pago
                    </Button>
                  </Stack>
                </Paper>
              ))}
          </Stack>
        </DialogContent>
      </Dialog>
      {/* Eliminar este diálogo */}
      {/* <Dialog
        open={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Pagos Pendientes</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {memberships
              ?.filter((m) => m.payment_status === "pending")
              .map((membership) => (
                <Paper
                  key={membership.id}
                  sx={{ p: 2, bgcolor: "background.default" }}
                >
                  <Stack spacing={1}>
                    <Typography variant="subtitle1">
                      Plan: {membership.membership_plans?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fecha:{" "}
                      {new Date(membership.start_date).toLocaleDateString()}
                    </Typography>
                    <Typography color="warning.main" fontWeight="medium">
                      Pendiente: {formatCurrency(membership.pending_amount)}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        navigate(`/members/${id}/membership-payments/new`, {
                          state: {
                            membership,
                            isPendingPayment: true,
                          },
                        });
                        setShowPaymentDialog(false);
                      }}
                    >
                      Registrar Pago
                    </Button>
                  </Stack>
                </Paper>
              ))}
          </Stack>
        </DialogContent>
      </Dialog> */}

      {/* Mantener este PaymentDialog */}
      {showPaymentDialog && selectedMembership && (
        <PaymentDialog
          open={showPaymentDialog}
          onClose={() => {
            setShowPaymentDialog(false);
            setSelectedMembership(null);
          }}
          membershipId={selectedMembership.id}
          totalAmount={selectedMembership.amount}
          paidAmount={selectedMembership.paid_amount}
          memberId={id!}
        />
      )}
    </>
  );
};
