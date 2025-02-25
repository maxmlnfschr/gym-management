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
import { MemberFilters } from "@/features/members/components/MemberFilters";
import type { Member } from "@/features/members/types";
import type { FilterValues } from "@/features/members/components/MemberFilters";
import { FileDownload as DownloadIcon } from "@mui/icons-material";
import { exportToCsv } from "@/features/members/utils/exportToCsv";
import {
  ResponsiveCard,
  ResponsiveCardContent,
} from "@/components/common/ResponsiveCard";
import { TextField } from "@mui/material"; // Añadir esta importación
import { SearchBar } from "@/components/common/SearchBar";
import { MemberCard } from "@/features/members/components/MemberCard";

export const MemberList = () => {
  const navigate = useNavigate();
  const { members, loading, fetchMembers, deleteMember } = useMemberStore();
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const { ref, inView } = useInView();
  const itemsPerPage = 10;

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  useEffect(() => {
    setFilteredMembers(members);
  }, [members]);

  const [filterValues, setFilterValues] = useState<FilterValues>({
    search: "",
    status: "all",
    sortBy: "name",
    sortDirection: "asc",
  });
  const handleFilter = (newValues: Partial<FilterValues>) => {
    const newFilters: FilterValues = {
      ...filterValues,
      ...newValues,
    };
    setFilterValues(newFilters);

    let filtered = [...members];

    // Apply search
    if (newFilters.search) {
      const searchLower = newFilters.search.toLowerCase();
      filtered = filtered.filter(
        (member: Member) =>
          member.first_name.toLowerCase().includes(searchLower) ||
          member.last_name.toLowerCase().includes(searchLower) ||
          member.email.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (newFilters.status !== "all") {
      filtered = filtered.filter(
        (member) => member.status === newFilters.status
      );
    }

    // Apply sorting
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
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredMembers(filtered);
  };
  const paginatedMembers = filteredMembers.slice(0, page * itemsPerPage);
  const hasMore = paginatedMembers.length < filteredMembers.length;

  return (
    <Stack spacing={1}>
      {" "}
      {/* Cambiado de 2 a 1 para mantener consistencia */}
      {/* Barra de búsqueda y botón agregar */}
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
          onClick={() =>
            navigate("/members/add", {
              state: { defaultName: filterValues.search },
            })
          }
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            width: 48,
            height: 48,
            borderRadius: 1,
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          <AddIcon fontSize="medium" />
        </IconButton>
      </Stack>
      {/* Nueva sección de filtros */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          backgroundColor: "background.paper",
          p: 2,
          borderRadius: 1,
          boxShadow: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={filterValues.status}
                label="Estado"
                onChange={(e) =>
                  handleFilter({
                    ...filterValues,
                    status: e.target.value as FilterValues["status"],
                  })
                }
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="active">Activos</MenuItem>
                <MenuItem value="inactive">Inactivos</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={filterValues.sortBy}
                label="Ordenar por"
                onChange={(e) =>
                  handleFilter({
                    ...filterValues,
                    sortBy: e.target.value as FilterValues["sortBy"],
                  })
                }
              >
                <MenuItem value="name">Nombre</MenuItem>
                <MenuItem value="date">Fecha</MenuItem>
                <MenuItem value="status">Estado</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </Stack>
      {/* Lista de miembros */}
      <Stack spacing={1}>
        {paginatedMembers.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            onEdit={(id: string) => navigate(`/members/edit/${id}`)}
            onDelete={(id: string) => deleteMember(id)}
          />
        ))}
        {hasMore && (
          <Box ref={ref} display="flex" justifyContent="center">
            <CircularProgress size={24} />
          </Box>
        )}
      </Stack>
    </Stack>
  );
};
