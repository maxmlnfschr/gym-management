import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  CircularProgress,
  Fab,
  Container,
} from "@mui/material";
import {
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

export const MemberList = () => {
  const navigate = useNavigate();
  const { members, loading, fetchMembers, deleteMember } = useMemberStore();
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [page, setPage] = useState(1);
  const { ref, inView } = useInView();
  const itemsPerPage = 10;

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  useEffect(() => {
    setFilteredMembers(members);
  }, [members]);

  const handleFilter = ({ search, status, sortBy }: FilterValues) => {
    let filtered = [...members];

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (member) =>
          member.first_name.toLowerCase().includes(searchLower) ||
          member.last_name.toLowerCase().includes(searchLower) ||
          member.email.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (status !== "all") {
      filtered = filtered.filter((member) => member.status === status);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
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

  useEffect(() => {
    if (inView && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [inView, hasMore]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Stack direction="row" justifyContent="flex-end" spacing={2} mb={2}>
        <IconButton
          onClick={() => exportToCsv(filteredMembers)}
          color="primary"
          title="Exportar como CSV"
        >
          <DownloadIcon />
        </IconButton>
        <MemberFilters onFilter={handleFilter} />
      </Stack>

      <Stack spacing={2}>
        {paginatedMembers.map((member) => (
          <Card key={member.id}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="h6">
                    {member.first_name} {member.last_name}
                  </Typography>
                  <Typography color="textSecondary">{member.email}</Typography>
                  {member.phone && (
                    <Typography color="textSecondary">
                      {member.phone}
                    </Typography>
                  )}
                </Box>
                <Stack direction="row" spacing={1}>
                  <IconButton
                    onClick={() => navigate(`/members/edit/${member.id}`)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => deleteMember(member.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
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
