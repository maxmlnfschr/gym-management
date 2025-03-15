import { useState, useEffect } from "react";
import { useAccessLogs } from "@/features/access/hooks/useAccessLogs";
import { AccessList } from "../AccessList";
import { History } from "@mui/icons-material";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { Stack } from "@mui/material";
import { InlineFilters } from "@/components/common/InlineFilters";
import { DATE_FILTERS } from "../../constants/filters";
import { AccessLogWithMember } from "@/features/access/types";
import { SearchBar } from "@/components/common/SearchBar";

export const AccessHistory = () => {
  const { data: accesses, isLoading } = useAccessLogs();
  const [filteredAccesses, setFilteredAccesses] = useState<AccessLogWithMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (accesses) {
      setFilteredAccesses(accesses);
    }
  }, [accesses]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (!accesses) return;

    let filtered = [...accesses];
    
    if (value) {
      const searchLower = value.toLowerCase();
      filtered = filtered.filter((access: AccessLogWithMember) =>
        `${access.members.first_name} ${access.members.last_name}`
          .toLowerCase()
          .includes(searchLower)
      );
    }
    
    setFilteredAccesses(filtered);
  };

  const handleFilterChange = (groupName: string, selectedFilters: string[]) => {
    if (!accesses) return;

    if (selectedFilters.length === 0) {
      setFilteredAccesses(accesses);
      return;
    }

    const filtered = accesses.filter((access: AccessLogWithMember) => {
      const accessDate = new Date(access.created_at);
      const today = new Date();
      
      return selectedFilters.some(filter => {
        switch (filter) {
          case 'today':
            return accessDate.toDateString() === today.toDateString();
          case 'week':
            const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return accessDate >= lastWeek;
          case 'month':
            const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return accessDate >= lastMonth;
          default:
            return true;
        }
      });
    });

    setFilteredAccesses(filtered);
  };

  if (isLoading) {
    return <LoadingScreen fullScreen={false} message="Cargando registros de acceso..." />;
  }

  return (
    <Stack spacing={2}>
      <SearchBar
        placeholder="Buscar accesos..."
        value={searchTerm}
        onChange={handleSearch}
      />

      <InlineFilters 
        filterGroups={[{
          ...DATE_FILTERS,
          type: 'date'  // Añadimos esta prop para identificar los filtros de fecha
        }]}
        onFilterChange={handleFilterChange}
      />

      <AccessList 
        accesses={filteredAccesses} 
        emptyState={
          <EmptyState
            icon={<History sx={{ fontSize: 40, color: "text.secondary" }} />}
            title="Sin registros de acceso"
            description={
              filteredAccesses.length === 0 && Boolean(accesses?.length)
                ? "No se encontraron registros para los filtros seleccionados"
                : "No hay registros de acceso para mostrar"
            }
          />
        }
      />
    </Stack>
  );
};
