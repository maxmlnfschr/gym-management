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
import { ResponsiveCard, ResponsiveCardContent } from "@/components/common/ResponsiveCard";
import { TextField } from "@mui/material";  // Añadir esta importación
import { SearchBar } from "@/components/common/SearchBar";

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
    sortDirection: "asc"
  });
  const handleFilter = (newValues: Partial<FilterValues>) => {
    const newFilters: FilterValues = {
      ...filterValues,
      ...newValues
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
      filtered = filtered.filter((member) => member.status === newFilters.status);
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
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} mb={1}>
        <Box sx={{ flexGrow: 1 }}>
          <SearchBar
            placeholder="Buscar miembros..."
            value={filterValues.search}
            onChange={(value) => handleFilter({
              ...filterValues,
              search: value
            })}
          />
        </Box>
        <MemberFilters 
          onFilter={({status, sortBy, sortDirection}) => handleFilter({
            ...filterValues,
            status,
            sortBy,
            sortDirection
          })} 
        />
      </Stack>
      <Stack spacing={1}>
        {paginatedMembers.map((member) => (
          <ResponsiveCard
            key={member.id}
            actions={[
              {
                label: "Editar",
                icon: <EditIcon fontSize="small" />,
                onClick: () => navigate(`/members/edit/${member.id}`)
              },
              {
                label: "Eliminar",
                icon: <DeleteIcon fontSize="small" />,
                onClick: () => deleteMember(member.id)
                // Removido el color: 'error.main'
              }
            ]}
          >
            <ResponsiveCardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="h6">
                    {member.first_name} {member.last_name}
                  </Typography>
                  <Typography 
                    color="textSecondary"
                    sx={{
                      textTransform: 'capitalize',
                      color: member.status === 'active' ? 'success.main' : 'error.main'
                    }}
                  >
                    {member.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Typography>
                  {member.phone && (
                    <Typography color="textSecondary">
                      {member.phone}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </ResponsiveCardContent>
          </ResponsiveCard>
        ))}
        {hasMore && (
          <Box ref={ref} display="flex" justifyContent="center">
            <CircularProgress size={24} />
          </Box>
        )}
      </Stack>
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => navigate("/members/add")}
      >
        <AddIcon />
      </Fab>
    </>
  );
};
