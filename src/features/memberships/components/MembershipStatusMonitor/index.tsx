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
        {sortedExpired.length > 0 ? (
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
        ) : (
          <Alert
            severity="success"
            sx={{
              backgroundColor: "rgba(46, 125, 50, 0.08)",
              "& .MuiAlert-icon": {
                color: "#2e7d32",
              },
            }}
          >
            No hay membresías vencidas
          </Alert>
        )}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {sortedExpiring.length > 0 ? (
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
        ) : (
          <Alert
            severity="success"
            sx={{
              backgroundColor: "rgba(46, 125, 50, 0.08)",
              "& .MuiAlert-icon": {
                color: "#2e7d32",
              },
            }}
          >
            No hay membresías por vencer
          </Alert>
        )}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {sortedPending.length > 0 ? (
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
        ) : (
          <Alert
            severity="success"
            sx={{
              backgroundColor: "rgba(46, 125, 50, 0.08)",
              "& .MuiAlert-icon": {
                color: "#2e7d32",
              },
            }}
          >
            No hay pagos pendientes
          </Alert>
        )}
      </TabPanel>
    </Stack>
  );
};
