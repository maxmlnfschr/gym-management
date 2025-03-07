import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Stack,
  CircularProgress,
  Fab,
  Container,
  FormControl,
  InputLabel,
  Select,
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
import { FileDownload as DownloadIcon } from "@mui/icons-material";
import { DataTable } from "@/components/common/DataTable";
import { formatMembershipDate } from "@/utils/dateUtils";
import {
  ResponsiveCard,
  ResponsiveCardContent,
} from "@/components/common/ResponsiveCard";
import { TextField } from "@mui/material"; // Añadir esta importación
import { SearchBar } from "@/components/common/SearchBar";
import { MemberCard } from "@/features/members/components/MemberCard";
import { Chip } from "@mui/material";
import { Collapse } from "@mui/material";
import { FilterChip } from "@/components/common/FilterChip";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { FloatingActions } from "@/components/common/FloatingActions";
import { useTheme } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { StatusChip } from "@/components/common/StatusChip";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { LoadingScreen } from '@/components/common/LoadingScreen';

export const MemberList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { members, loading, fetchMembers, deleteMember } = useMemberStore();
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const { ref, inView } = useInView();
  const itemsPerPage = 10;
  const [showFilters, setShowFilters] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterValues>({
    search: "",
    status: "all",
    sortBy: "name",
    sortDirection: "asc",
  });
  // Agregar estos estados aquí, fuera de handleFilter
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

  const handleConfirmDelete = async () => {
    if (memberToDelete) {
      try {
        await deleteMember(memberToDelete);
        // La lista se actualizará automáticamente gracias al store
      } catch (error) {
        console.error("Error al eliminar miembro:", error);
      }
    }
    setConfirmDialogOpen(false);
    setMemberToDelete(null);
  };
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setShowFilters(!showFilters);
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
  // Replace loading indicators with LoadingScreen
  if (loading) {
    return <LoadingScreen fullScreen={false} message="Cargando miembros..." />;
  }

  if (isMobile) {
    return (
      <Box>
        <Stack spacing={3}>
          {/* Barra de búsqueda y botón */}
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
                onFilterClick={handleFilterClick}
                isFilterActive={showFilters}
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
          {/* Filtros en línea */}
          <Collapse in={showFilters}>
            <Stack
              spacing={2}
              sx={{
                backgroundColor: "background.paper",
                borderRadius: 1.5,
                p: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    minWidth: "auto",
                    fontWeight: 500,
                  }}
                >
                  Estado:
                </Typography>
                <Stack direction="row" spacing={0.5}>
                  <FilterChip
                    label="Todos"
                    isSelected={filterValues.status === "all"}
                    onSelect={() =>
                      handleFilter({ ...filterValues, status: "all" })
                    }
                  />
                  <FilterChip
                    label="Membresía activa"
                    isSelected={filterValues.status === "active_membership"}
                    onSelect={() =>
                      handleFilter({
                        ...filterValues,
                        status: "active_membership",
                      })
                    }
                  />
                  <FilterChip
                    label="Pago vencido"
                    isSelected={filterValues.status === "overdue"}
                    onSelect={() =>
                      handleFilter({ ...filterValues, status: "overdue" })
                    }
                  />
                  <FilterChip
                    label="Sin membresía"
                    isSelected={filterValues.status === "no_membership"}
                    onSelect={() =>
                      handleFilter({ ...filterValues, status: "no_membership" })
                    }
                  />
                </Stack>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    minWidth: "auto",
                    fontWeight: 500,
                  }}
                >
                  Ordenar por:
                </Typography>
                <Stack direction="row" spacing={0.5}>
                  <Chip
                    label="Nombre"
                    size="small"
                    onClick={() =>
                      handleFilter({ ...filterValues, sortBy: "name" })
                    }
                    sx={{
                      height: "24px",
                      fontSize: "0.75rem",
                      backgroundColor:
                        filterValues.sortBy === "name"
                          ? `${theme.palette.text.primary}15`
                          : "grey.100",
                      color: theme.palette.text.primary,
                      border: "none",
                      fontWeight: 500,
                      "&:hover": {
                        backgroundColor:
                          filterValues.sortBy === "name"
                            ? `${theme.palette.text.primary}25`
                            : "grey.200",
                      },
                    }}
                  />
                  {/* Aplicar el mismo estilo a los otros chips */}
                  <Chip
                    label="Fecha"
                    size="small"
                    onClick={() =>
                      handleFilter({ ...filterValues, sortBy: "date" })
                    }
                    sx={{
                      height: "24px",
                      fontSize: "0.75rem",
                      backgroundColor:
                        filterValues.sortBy === "date"
                          ? `${theme.palette.text.primary}15`
                          : "grey.100",
                      color: theme.palette.text.primary,
                      border: "none",
                      fontWeight: 500,
                      "&:hover": {
                        backgroundColor:
                          filterValues.sortBy === "date"
                            ? `${theme.palette.text.primary}25`
                            : "grey.200",
                      },
                    }}
                  />
                  <Chip
                    label="Estado"
                    size="small"
                    onClick={() =>
                      handleFilter({ ...filterValues, sortBy: "status" })
                    }
                    sx={{
                      height: "24px",
                      fontSize: "0.75rem",
                      backgroundColor:
                        filterValues.sortBy === "status"
                          ? `${theme.palette.text.primary}15`
                          : "grey.100",
                      color: theme.palette.text.primary,
                      border: "none",
                      fontWeight: 500,
                      "&:hover": {
                        backgroundColor:
                          filterValues.sortBy === "status"
                            ? `${theme.palette.text.primary}25`
                            : "grey.200",
                      },
                    }}
                  />
                </Stack>
              </Stack>
            </Stack>
          </Collapse>
          {/* Lista de miembros */}
          <Stack spacing={2}>
            {paginatedMembers.map((member: Member) => (
              <Box
                key={member.id}
                onClick={() => navigate(`/members/${member.id}`)}
                sx={{ cursor: "pointer" }}
              >
                <MemberCard
                  key={member.id}
                  member={member}
                  onEdit={(id: string) => navigate(`/members/edit/${id}`)}
                  onDelete={(id: string) => handleDeleteClick(id)}
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
  return (
    <Box>
      <Stack spacing={3}>
        {/* Barra de búsqueda y botón */}
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
              onFilterClick={handleFilterClick}
              isFilterActive={showFilters}
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
        {/* Filtros en línea */}
        <Collapse in={showFilters}>
          {/* ... contenido existente de los filtros ... */}
        </Collapse>
        {/* Tabla de miembros para desktop */}
        {!isMobile && (
          <DataTable
            columns={[
              {
                id: "name",
                label: "Nombre",
                render: (member: Member) =>
                  `${member.first_name} ${member.last_name}`,
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
              {
                id: "plan_type",
                label: "Plan",
                render: (member: Member) => {
                  // Añadir console.log para depuración
                  console.log(
                    "Member plan type:",
                    member.current_membership?.plan_type
                  );

                  if (!member.current_membership) return "-";

                  // Convertir el plan_type a un formato más legible
                  const planTypeMap: Record<string, string> = {
                    monthly: "Mensual",
                    quarterly: "Trimestral",
                    annual: "Anual",
                  };

                  const planType = member.current_membership.plan_type;

                  // Si planType es undefined o null, mostrar un mensaje más descriptivo
                  if (!planType) {
                    console.log("Plan type is missing for member:", member.id);
                    return "No especificado";
                  }

                  return planTypeMap[planType] || planType;
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
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/members/edit/${member.id}`);
                      }}
                      color="inherit"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(member.id);
                      }}
                      color="inherit"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                ),
              },
            ]}
            data={paginatedMembers}
            keyExtractor={(member) => member.id}
            isLoading={loading}
            emptyMessage="No hay miembros registrados"
          />
        )}
        {hasMore && (
          <Box ref={ref} display="flex" justifyContent="center" sx={{ mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
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
