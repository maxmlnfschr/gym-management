import { useState, useMemo } from "react";
import { Box, Stack, Paper, Typography } from "@mui/material";
import { SearchBar } from "@/components/common/SearchBar";
import { AccessFilterValues } from "../../types";
import { useAccess } from "../../hooks/useAccess";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { startOfDay, startOfWeek, startOfMonth } from "date-fns";
import { DataTable } from "@/components/common/DataTable";
import { StatusChip } from "@/components/common/StatusChip";
import { useTheme, useMediaQuery } from "@mui/material";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { History } from "@mui/icons-material";
import { EmptyState } from "@/components/common/EmptyState";
import { type AccessLogWithMember } from "../../types";

interface AccessListProps {
  accesses: AccessLogWithMember[];
  emptyState: React.ReactNode;
}

export const AccessList = ({ accesses, emptyState }: AccessListProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [filterValues, setFilterValues] = useState<AccessFilterValues>({
    search: "",
    dateRange: "all",
    sortBy: "date",
    sortDirection: "desc",
  });

  const filteredAccesses = useMemo(() => {
    let filtered = [...accesses];
    const now = new Date();

    // Filtrar por fecha
    if (filterValues.dateRange !== "all") {
      const startDate =
        filterValues.dateRange === "day"
          ? startOfDay(now)
          : filterValues.dateRange === "week"
          ? startOfWeek(now, { locale: es })
          : startOfMonth(now);

      filtered = filtered.filter(
        (access) => new Date(access.check_in) >= startDate
      );
    }

    // Filtrar por búsqueda
    // Corregir la referencia a member por members
    if (filterValues.search) {
      const searchLower = filterValues.search.toLowerCase();
      filtered = filtered.filter((access) =>
        `${access.members.first_name} ${access.members.last_name}`
          .toLowerCase()
          .includes(searchLower)
      );
    }

    // Corregir en el ordenamiento también
    filtered.sort((a, b) => {
      if (filterValues.sortBy === "date") {
        return filterValues.sortDirection === "desc"
          ? new Date(b.check_in).getTime() - new Date(a.check_in).getTime()
          : new Date(a.check_in).getTime() - new Date(b.check_in).getTime();
      }
      return filterValues.sortDirection === "desc"
        ? `${b.members.first_name} ${b.members.last_name}`.localeCompare(
            `${a.members.first_name} ${a.members.last_name}`
          )
        : `${a.members.first_name} ${a.members.last_name}`.localeCompare(
            `${b.members.first_name} ${b.members.last_name}`
          );
    });

    return filtered;
  }, [accesses, filterValues]);

  if (!accesses || accesses.length === 0) {
    return emptyState;
  }

  const handleFilter = (newValues: Partial<AccessFilterValues>) => {
    setFilterValues((prev) => ({
      ...prev,
      ...newValues,
    }));
  };

  return (
    <Box>
      <Stack spacing={3}>
        <SearchBar
          placeholder="Buscar accesos..."
          value={filterValues.search}
          onChange={(value) => handleFilter({ search: value })}
        />

        {filteredAccesses.length === 0 && filterValues.search ? (
          <EmptyState
            icon={<History sx={{ fontSize: 40, color: "text.secondary" }} />}
            title="No se encontraron accesos"
            description="No hay registros que coincidan con tu búsqueda. Intenta con otros términos."
          />
        ) : isMobile ? (
          <Stack spacing={2}>
            {filteredAccesses.map((access) => (
              <Paper
                key={access.id}
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="subtitle1">
                    {access.members.first_name} {access.members.last_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(access.check_in), "dd/MM/yyyy HH:mm", {
                      locale: es,
                    })}
                  </Typography>
                </Box>
                <StatusChip status="success" customLabel="Permitido" />
              </Paper>
            ))}
          </Stack>
        ) : (
          <DataTable
            columns={[
              {
                id: "date",
                label: "Fecha",
                render: (access) =>
                  format(new Date(access.check_in), "dd/MM/yyyy HH:mm", {
                    locale: es,
                  }),
              },
              {
                id: "member",
                label: "Miembro",
                render: (access) =>
                  `${access.members.first_name} ${access.members.last_name}`,
              },
              {
                id: "status",
                label: "Estado",
                render: () => (
                  <StatusChip status="success" customLabel="Permitido" />
                ),
              },
            ]}
            data={filteredAccesses}
            keyExtractor={(access) => access.id}
            // Eliminar isLoading ya que no lo tenemos
            emptyMessage="No hay registros de acceso"
          />
        )}
      </Stack>
    </Box>
  );
};
