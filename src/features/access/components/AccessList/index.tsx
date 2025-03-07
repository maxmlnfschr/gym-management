import { useState, useMemo } from "react";
import { Box, Stack, Paper, Typography, CircularProgress } from "@mui/material";
import { SearchBar } from "@/components/common/SearchBar";
import { AccessFilters } from "../AccessFilters";
import { AccessFilterValues } from "../../types";
import { useAccess } from "../../hooks/useAccess";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { startOfDay, startOfWeek, startOfMonth } from "date-fns";
import { DataTable } from "@/components/common/DataTable";
import { StatusChip } from "@/components/common/StatusChip";
import { useTheme, useMediaQuery } from "@mui/material";
import { LoadingScreen } from '@/components/common/LoadingScreen';

export const AccessList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { accesses, isLoading } = useAccess();
  const [showFilters, setShowFilters] = useState(false);
  const [filterValues, setFilterValues] = useState<AccessFilterValues>({
    search: "",
    dateRange: "all",
    sortBy: "date",
    sortDirection: "desc",
  });

  const handleFilter = (newValues: Partial<AccessFilterValues>) => {
    setFilterValues((prev) => ({
      ...prev,
      ...newValues,
    }));
  };

  const filteredAccesses = useMemo(() => {
    let filtered = [...accesses];
    const now = new Date();

    // Filtrar por fecha
    if (filterValues.dateRange !== "all") {
      const startDate = filterValues.dateRange === "day" 
        ? startOfDay(now)
        : filterValues.dateRange === "week"
        ? startOfWeek(now, { locale: es })
        : startOfMonth(now);

      filtered = filtered.filter(access => 
        new Date(access.check_in) >= startDate
      );
    }

    // Filtrar por búsqueda
    if (filterValues.search) {
      const searchLower = filterValues.search.toLowerCase();
      filtered = filtered.filter(access => 
        `${access.member.first_name} ${access.member.last_name}`
          .toLowerCase()
          .includes(searchLower)
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      if (filterValues.sortBy === "date") {
        return filterValues.sortDirection === "desc"
          ? new Date(b.check_in).getTime() - new Date(a.check_in).getTime()
          : new Date(a.check_in).getTime() - new Date(b.check_in).getTime();
      }
      // Ordenar por nombre de miembro
      return filterValues.sortDirection === "desc"
        ? `${b.member.first_name} ${b.member.last_name}`.localeCompare(
            `${a.member.first_name} ${a.member.last_name}`
          )
        : `${a.member.first_name} ${a.member.last_name}`.localeCompare(
            `${b.member.first_name} ${b.member.last_name}`
          );
    });

    return filtered;
  }, [accesses, filterValues]);

  if (isLoading) {
    return <LoadingScreen fullScreen={false} message="Cargando registros de acceso..." />;
  }
  return (
    <Box>
      <Stack spacing={3}>
        <SearchBar
          placeholder="Buscar accesos..."
          value={filterValues.search}
          onChange={(value) => handleFilter({ search: value })}
          onFilterClick={() => setShowFilters(!showFilters)}
          isFilterActive={showFilters}
        />
        <AccessFilters
          filterValues={filterValues}
          onFilterChange={handleFilter}
          show={showFilters}
        />
        
        {isMobile ? (
          <Stack spacing={2}>
            {filteredAccesses.map((access) => {
              console.log('Mobile access status:', access.status, access);
              return (
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
                      {access.member.first_name} {access.member.last_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {format(new Date(access.check_in), "dd/MM/yyyy HH:mm", {
                        locale: es,
                      })}
                    </Typography>
                  </Box>
                  <StatusChip 
                    status="success" 
                    customLabel="Permitido"
                  />
                </Paper>
              );
            })}
          </Stack>
        ) : (
          <DataTable
            columns={[
              {
                id: 'date',
                label: 'Fecha',
                render: (access) => format(new Date(access.check_in), "dd/MM/yyyy HH:mm", { locale: es })
              },
              {
                id: 'member',
                label: 'Miembro',
                render: (access) => `${access.member.first_name} ${access.member.last_name}`
              },
              {
                id: 'status',
                label: 'Estado',
                render: (access) => {
                  console.log('Desktop access status:', access.status, access);
                  return (
                    <StatusChip 
                      status="success" 
                      customLabel="Permitido"
                    />
                  );
                }
              }
            ]}
            data={filteredAccesses}
            keyExtractor={(access) => access.id}
            isLoading={isLoading}
            emptyMessage="No hay registros de acceso"
          />
        )}
      </Stack>
    </Box>
  );
};