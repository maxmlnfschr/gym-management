import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useMemberStore } from "@/features/shared/stores/memberStore";
import { useNavigate } from "react-router-dom";
import type { FilterValues, Member } from "@/features/members/types";
import { DataTable } from "@/components/common/DataTable";
import { formatMembershipDate } from "@/utils/dateUtils";
import { SearchBar } from "@/components/common/SearchBar";
import { FloatingActions } from "@/components/common/FloatingActions";
import { useTheme } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { StatusChip } from "@/components/common/StatusChip";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { People } from "@mui/icons-material";
import { EmptyState } from "@/components/common/EmptyState";
import { InlineFilters } from "@/components/common/InlineFilters";
import { MEMBERSHIP_STATUS_FILTERS } from "@/features/memberships/constants/filters";
import { LoadingButton } from "@/components/common/LoadingButton";
import { InfoCard } from "@/components/common/InfoCard";
import { UserAvatar } from "@/components/common/UserAvatar";
import { getMembershipPlanName } from "@/features/memberships/utils/planUtils";
import { PlanType } from "@/features/memberships/types";

export const MemberList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { members, loading, fetchMembers, deleteMember } = useMemberStore();
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {}
  ); // Moved here
  const { ref, inView } = useInView();
  const itemsPerPage = 10;
  const [filterValues, setFilterValues] = useState<FilterValues>({
    search: "",
    status: "all",
    sortBy: "name",
    sortDirection: "asc",
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  const handleFilter = (newValues: Partial<FilterValues>) => {
    const newFilters: FilterValues = {
      ...filterValues,
      ...newValues,
    };
    setFilterValues(newFilters);

    // Primero filtramos los miembros eliminados
    let filtered = [...members].filter(
      (member) => !member.deleted_at && member.status !== "deleted"
    );

    // Luego aplicamos los demás filtros
    if (newFilters.search) {
      const searchLower = newFilters.search.toLowerCase();
      filtered = filtered.filter(
        (member: Member) =>
          member.first_name.toLowerCase().includes(searchLower) ||
          member.last_name.toLowerCase().includes(searchLower) ||
          member.email.toLowerCase().includes(searchLower)
      );
    }

    if (newFilters.status !== "all") {
      filtered = filtered.filter((member) => {
        // Añadir console.log para debug
        console.log(
          "Filtering member:",
          member.first_name,
          member.current_membership
        );

        const membership = member.current_membership;
        switch (newFilters.status) {
          case "active_membership":
            const isActive =
              membership &&
              membership.payment_status === "paid" &&
              new Date(membership.end_date) > new Date();
            console.log("Is active?", isActive);
            return isActive;
          case "overdue":
            const isOverdue =
              membership &&
              (new Date(membership.end_date) < new Date() ||
                membership.payment_status === "pending");
            console.log("Is overdue?", isOverdue);
            return isOverdue;
          case "no_membership":
            return !membership;
          default:
            return true;
        }
      });
    }
    filtered.sort((a, b) => {
      switch (newFilters.sortBy) {
        case "name":
          return `${a.first_name} ${a.last_name}`.localeCompare(
            `${b.first_name} ${b.last_name}`
          );
        case "date":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "status":
          const getMembershipStatus = (member: Member) => {
            const membership = member.current_membership;
            if (!membership) return "3_no_membership";
            if (
              membership.payment_status === "pending" ||
              new Date(membership.end_date) < new Date()
            ) {
              return "2_overdue"; // Pago vencido
            }
            return "1_active_membership"; // Membresía activa
          };
          return getMembershipStatus(a).localeCompare(getMembershipStatus(b));
        default:
          return 0;
      }
    });

    setFilteredMembers(filtered);
  };

  // Agregar estas funciones aquí
  const handleDeleteClick = (memberId: string) => {
    setMemberToDelete(memberId);
    setConfirmDialogOpen(true);
  };

  // Agregar estado para controlar la carga de eliminación
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (memberToDelete) {
      try {
        setIsDeletingId(memberToDelete);
        await deleteMember(memberToDelete);
      } catch (error) {
        console.error("Error al eliminar miembro:", error);
      } finally {
        setIsDeletingId(null);
        setConfirmDialogOpen(false);
        setMemberToDelete(null);
      }
    }
    setConfirmDialogOpen(false);
    setMemberToDelete(null);
  };

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);
  useEffect(() => {
    // Filtrar miembros eliminados al inicializar
    const activeMembers = members.filter(
      (member) => !member.deleted_at && member.status !== "deleted"
    );
    setFilteredMembers(activeMembers);
  }, [members]);
  // Añadir estas definiciones antes del return
  const paginatedMembers = filteredMembers.slice(0, page * itemsPerPage);
  const hasMore = paginatedMembers.length < filteredMembers.length;
  useEffect(() => {
    if (inView && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, hasMore]);

  if (loading) {
    return <LoadingScreen fullScreen={false} message="Cargando miembros..." />;
  }

  // Update the handleInlineFilterChange function
  const handleInlineFilterChange = (
    groupName: string,
    selectedFilters: string[]
  ) => {
    setActiveFilters((prev) => ({
      ...prev,
      [groupName]: selectedFilters,
    }));

    let filtered = [...members].filter(
      (member) => !member.deleted_at && member.status !== "deleted"
    );

    if (selectedFilters.length > 0) {
      filtered = filtered.filter((member) => {
        const membership = member.current_membership;
        return selectedFilters.some((filter) => {
          switch (filter) {
            case "active":
              // Solo verificamos la fecha de vencimiento, no el estado de pago
              return membership && new Date(membership.end_date) > new Date();
            case "expiring":
              const endDate = membership ? new Date(membership.end_date) : null;
              const today = new Date();
              const daysUntilExpiration = endDate
                ? Math.ceil(
                    (endDate.getTime() - today.getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                : 0;
              return daysUntilExpiration <= 7 && daysUntilExpiration > 0;
            case "expired":
              return membership && new Date(membership.end_date) < new Date();
            case "pending":
              return membership && membership.payment_status === "pending";
            case "no_membership":
              return !membership;
            default:
              return false;
          }
        });
      });
    }

    setFilteredMembers(filtered);
  };

  // En la vista móvil, después del SearchBar y antes del EmptyState:
  if (isMobile) {
    return (
      <Box>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ flex: 1 }}>
              <SearchBar
                placeholder="Buscar miembros..."
                value={filterValues.search}
                onChange={(value) =>
                  handleFilter({
                    ...filterValues,
                    search: value,
                  })
                }
              />
            </Box>
            <IconButton
              color="primary"
              onClick={() => navigate("/members/add")}
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                width: 48,
                height: 48,
                borderRadius: "50%", // Hacemos el botón redondo
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                "&:hover": {
                  backgroundColor: "primary.dark",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                },
              }}
            >
              <AddIcon fontSize="medium" />
            </IconButton>
          </Stack>

          {/* Añadir InlineFilters aquí */}
          <InlineFilters
            filterGroups={[MEMBERSHIP_STATUS_FILTERS]}
            onFilterChange={handleInlineFilterChange}
          />

          {/* Lista de miembros o EmptyState */}
          {filteredMembers.length === 0 ? (
            <EmptyState
              icon={<People sx={{ fontSize: 48, color: "text.secondary" }} />}
              title={
                filterValues.search ||
                activeFilters[MEMBERSHIP_STATUS_FILTERS.name]?.length > 0
                  ? "No se encontraron miembros"
                  : "No hay miembros"
              }
              description={
                filterValues.search ||
                activeFilters[MEMBERSHIP_STATUS_FILTERS.name]?.length > 0
                  ? "Prueba ajustando los filtros aplicados"
                  : "Comienza agregando un nuevo miembro"
              }
              actionText={
                filterValues.search ||
                activeFilters[MEMBERSHIP_STATUS_FILTERS.name]?.length > 0
                  ? undefined
                  : "Agregar miembro"
              }
              onAction={
                filterValues.search ||
                activeFilters[MEMBERSHIP_STATUS_FILTERS.name]?.length > 0
                  ? undefined
                  : () => navigate("/members/add")
              }
            />
          ) : (
            <Stack spacing={2}>
              {paginatedMembers.map((member: Member) => (
                <Box
                  key={member.id}
                  onClick={() => navigate(`/members/${member.id}`)}
                  sx={{ cursor: "pointer" }}
                >
                  <InfoCard
                    avatar={
                      <UserAvatar
                        firstName={member.first_name}
                        lastName={member.last_name}
                        membershipStatus={
                          !member.current_membership
                            ? "no_membership"
                            : new Date(member.current_membership.end_date) >
                              new Date()
                            ? "active"
                            : "expired"
                        }
                      />
                    }
                    title={`${member.first_name} ${member.last_name}`}
                    subtitle={
                      <Stack spacing={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          {member.email}
                        </Typography>
                        {member.phone && (
                          <Typography variant="body2" color="text.secondary">
                            {member.phone}
                          </Typography>
                        )}
                      </Stack>
                    }
                    action={
                      member.current_membership && (
                        <StatusChip
                          status={
                            member.current_membership.payment_status ||
                            "pending"
                          }
                          context="payment"
                        />
                      )
                    }
                  />
                </Box>
              ))}
              {hasMore && (
                <Box
                  ref={ref}
                  display="flex"
                  justifyContent="center"
                  sx={{ mt: 2 }}
                >
                  <CircularProgress size={24} />
                </Box>
              )}
            </Stack>
          )}
        </Stack>
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
        <FloatingActions />
      </Box>
    );
  }

  // Desktop view
  return (
    <Box>
      <Stack spacing={3}>
        {/* Search bar and filters remain the same */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ flex: 1 }}>
            <SearchBar
              placeholder="Buscar miembros..."
              value={filterValues.search}
              onChange={(value) =>
                handleFilter({
                  ...filterValues,
                  search: value,
                })
              }
            />
          </Box>
          <IconButton
            color="primary"
            onClick={() => navigate("/members/add")}
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              width: 48,
              height: 48,
              borderRadius: "50%", // Hacemos el botón redondo
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              "&:hover": {
                backgroundColor: "primary.dark",
                boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
              },
            }}
          >
            <AddIcon fontSize="medium" />
          </IconButton>
        </Stack>

        {/* Añadir InlineFilters aquí */}
        <InlineFilters
          filterGroups={[MEMBERSHIP_STATUS_FILTERS]}
          onFilterChange={handleInlineFilterChange}
        />

        {/* Table or EmptyState for desktop */}
        {filteredMembers.length === 0 ? (
          <EmptyState
            icon={<People sx={{ fontSize: 48, color: "text.secondary" }} />}
            title={
              filterValues.search ||
              activeFilters[MEMBERSHIP_STATUS_FILTERS.name]?.length > 0
                ? "No se encontraron resultados"
                : "No hay miembros"
            }
            description={
              filterValues.search ||
              activeFilters[MEMBERSHIP_STATUS_FILTERS.name]?.length > 0
                ? "Prueba ajustando los filtros aplicados"
                : "Comienza agregando un nuevo miembro"
            }
            actionText={
              filterValues.search ||
              activeFilters[MEMBERSHIP_STATUS_FILTERS.name]?.length > 0
                ? undefined
                : "Agregar miembro"
            }
            onAction={
              filterValues.search ||
              activeFilters[MEMBERSHIP_STATUS_FILTERS.name]?.length > 0
                ? undefined
                : () => navigate("/members/add")
            }
          />
        ) : (
          <>
            <DataTable
              columns={[
                {
                  id: "name",
                  label: "Nombre",
                  render: (member: Member) => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <UserAvatar
                        firstName={member.first_name}
                        lastName={member.last_name}
                        membershipStatus={
                          !member.current_membership
                            ? "no_membership"
                            : new Date(member.current_membership.end_date) >
                              new Date()
                            ? "active"
                            : "expired"
                        }
                        size={32}
                      />
                      <Typography>{`${member.first_name} ${member.last_name}`}</Typography>
                    </Box>
                  ),
                },
                {
                  id: "email",
                  label: "Email",
                  render: (member: Member) => member.email,
                },
                {
                  id: "phone",
                  label: "Teléfono",
                  render: (member: Member) => member.phone || "-",
                },
                // En la definición de columnas para la tabla de escritorio
                {
                  id: "status",
                  label: "Membresía",
                  render: (member: Member) => {
                    // Determinar el estado real de la membresía basado solo en la fecha
                    let status = "no_membership";
                    let customLabel;
                    if (member.current_membership) {
                      const endDate = new Date(
                        member.current_membership.end_date
                      );
                      const today = new Date();
                      if (endDate > today) {
                        status = "active";
                      } else {
                        status = "expired";
                      }
                    } else {
                      customLabel = "Sin membresía";
                    }
                    return (
                      <StatusChip
                        status={status}
                        customLabel={customLabel}
                        // No pasamos context porque queremos usar el contexto de membresía por defecto
                      />
                    );
                  },
                },
                // En la columna plan_type del DataTable
                {
                  id: "plan_type",
                  label: "Plan",
                  render: (member: Member) => {
                    if (!member.current_membership) return "-";
                    return getMembershipPlanName({
                      membership_plans:
                        member.current_membership.membership_plans,
                      plan_type: member.current_membership
                        .plan_type as PlanType,
                    });
                  },
                },
                {
                  id: "expiration",
                  label: "Vencimiento",
                  render: (member: Member) =>
                    member.current_membership
                      ? formatMembershipDate(member.current_membership.end_date)
                      : "-",
                },
                {
                  id: "payment",
                  label: "Pago",
                  render: (member: Member) => {
                    if (!member.current_membership) {
                      return "-";
                    }
                    return (
                      <StatusChip
                        status={
                          member.current_membership.payment_status || "pending"
                        }
                        context="payment"
                      />
                    );
                  },
                },
                {
                  id: "actions",
                  label: "Acciones",
                  render: (member: Member) => (
                    <>
                      <LoadingButton
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/members/edit/${member.id}`);
                        }}
                        color="inherit"
                        size="small"
                        startIcon={<EditIcon />}
                      >
                        Editar
                      </LoadingButton>
                      <LoadingButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(member.id);
                        }}
                        color="error"
                        size="small"
                        loading={isDeletingId === member.id}
                        loadingText="Eliminando..."
                        startIcon={<DeleteIcon />}
                      >
                        Eliminar
                      </LoadingButton>
                    </>
                  ),
                },
              ]}
              data={paginatedMembers}
              keyExtractor={(member) => member.id}
              isLoading={loading}
              emptyMessage="No hay miembros registrados"
            />
            {hasMore && (
              <Box
                ref={ref}
                display="flex"
                justifyContent="center"
                sx={{ mt: 2 }}
              >
                <CircularProgress size={24} />
              </Box>
            )}
          </>
        )}
      </Stack>
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
      <FloatingActions />
    </Box>
  );
};
