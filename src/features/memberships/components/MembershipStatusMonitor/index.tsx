import {
  Alert,
  AlertTitle,
  Stack,
  Tabs,
  Tab,
  Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useExpirationNotifications } from "../../hooks/useExpirationNotifications";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Membership } from "../../types";
import { useState } from "react";
import { TabPanel } from "@/components/common/TabPanel";
import { formatRelativeDate } from "@/utils/dateUtils";
import { FitnessCenter } from "@mui/icons-material";
import { EmptyState } from "@/components/common/EmptyState";

export const MembershipStatusMonitor = () => {
  const [tabValue, setTabValue] = useState(0);
  const {
    expiringMemberships,
    expiredMemberships,
    pendingMemberships,
    isLoading,
  } = useExpirationNotifications();
  // Ordenar las membresías
  const sortedExpired = [...expiredMemberships].sort(
    (a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
  );
  const sortedExpiring = [...expiringMemberships].sort(
    (a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
  );
  const sortedPending = [...pendingMemberships].sort(
    (a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
  );
  // Cambiar esta condición para que solo retorne null cuando está cargando
  if (isLoading) {
    return null;
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const renderEmptyState = () => {
    if (tabValue === 0 && sortedExpired.length === 0) {
      return (
        <EmptyState
          icon={<FitnessCenter sx={{ fontSize: 40, color: "success.main" }} />}
          title="Sin membresías vencidas"
          description="No hay membresías vencidas en este momento"
        />
      );
    }
    
    if (tabValue === 1 && sortedExpiring.length === 0) {
      return (
        <EmptyState
          icon={<FitnessCenter sx={{ fontSize: 40, color: "warning.main" }} />}
          title="Sin membresías por vencer"
          description="No hay membresías próximas a vencer"
        />
      );
    }
    
    if (tabValue === 2 && sortedPending.length === 0) {
      return (
        <EmptyState
          icon={<FitnessCenter sx={{ fontSize: 40, color: "info.main" }} />}
          title="Sin pagos pendientes"
          description="No hay membresías con pagos pendientes"
        />
      );
    }
    
    return null;
  };

  return (
    <Stack spacing={1}>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        TabIndicatorProps={{
          sx: { display: "none" },
        }}
        sx={{
          "& .MuiTab-root": {
            color: "#666",
            borderRadius: "6px",
            marginRight: 1,
            minHeight: "32px",
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            minWidth: { xs: "100px", sm: 160 },
            padding: { xs: "6px 12px", sm: "8px 20px" },
            backgroundColor: "transparent",
            border: "1px solid #e0e0e0",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
            "&.Mui-selected": {
              color: "#fff",
              backgroundColor: "black",
              border: "1px solid black",
              fontWeight: 500,
              transition: "all 0.2s ease-in-out",
            },
          },
          "& .MuiTabs-scrollButtons": {
            width: "20px",
            "&.Mui-disabled": {
              display: "none",
            },
          },
        }}
      >
        <Tab
          label={
            sortedExpired.length > 0
              ? `Vencidos (${sortedExpired.length})`
              : "Vencidos"
          }
        />
        <Tab
          label={
            sortedExpiring.length > 0
              ? `Por vencer (${sortedExpiring.length})`
              : "Por vencer"
          }
        />
        <Tab
          label={
            sortedPending.length > 0
              ? `Pagos pendientes (${sortedPending.length})`
              : "Pagos pendientes"
          }
        />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        {sortedExpired.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {sortedExpired.map((membership) => (
              <Alert
                key={membership.id}
                severity="error"
                sx={{
                  mb: 1,
                  backgroundColor: "rgba(244, 67, 54, 0.08)",
                  "& .MuiAlert-icon": { color: "#f44336" },
                }}
              >
                <Link
                  to={`/members/${membership.member_id}`}
                  style={{ textDecoration: "none" }}
                >
                  <MuiLink
                    component="span"
                    sx={{
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {membership.members.first_name}{" "}
                    {membership.members.last_name}
                  </MuiLink>
                </Link>{" "}
                - Venció hace{" "}
                {formatDistanceToNow(new Date(membership.end_date), {
                  locale: es,
                })}
              </Alert>
            ))}
          </>
        )}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {sortedExpiring.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {sortedExpiring.map((membership) => (
              <Alert
                key={membership.id}
                severity="warning"
                sx={{
                  mb: 1,
                  backgroundColor: "rgba(255, 152, 0, 0.08)",
                  "& .MuiAlert-icon": { color: "#ff9800" },
                }}
              >
                <Link
                  to={`/members/${membership.member_id}`}
                  style={{ textDecoration: "none" }}
                >
                  <MuiLink
                    component="span"
                    sx={{
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {membership.members.first_name}{" "}
                    {membership.members.last_name}
                  </MuiLink>
                </Link>{" "}
                - Vence en{" "}
                {formatDistanceToNow(new Date(membership.end_date), {
                  locale: es,
                })}
              </Alert>
            ))}
          </>
        )}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {sortedPending.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {sortedPending.map((membership) => (
              <Alert
                key={membership.id}
                severity="info"
                sx={{
                  mb: 1,
                  backgroundColor: "rgba(255, 152, 0, 0.08)",
                  "& .MuiAlert-icon": { color: "#ff9800" },
                }}
              >
                <Link
                  to={`/members/${membership.member_id}`}
                  style={{ textDecoration: "none" }}
                >
                  <MuiLink
                    component="span"
                    sx={{
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {membership.members.first_name}{" "}
                    {membership.members.last_name}
                  </MuiLink>
                </Link>{" "}
                - Pago pendiente - Vence{" "}
                {formatDistanceToNow(new Date(membership.end_date), {
                  locale: es,
                  addSuffix: true
                })}
              </Alert>
            ))}
          </>
        )}
      </TabPanel>
    </Stack>
  );
};
