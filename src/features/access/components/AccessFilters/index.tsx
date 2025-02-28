import { Stack, Typography, Collapse } from "@mui/material";
import { FilterChip } from "@/components/common/FilterChip";
import { AccessFilterValues } from "../../types";

interface AccessFiltersProps {
  filterValues: AccessFilterValues;
  onFilterChange: (newValues: Partial<AccessFilterValues>) => void;
  show: boolean;
}

export const AccessFilters = ({
  filterValues,
  onFilterChange,
  show,
}: AccessFiltersProps) => {
  return (
    <Collapse in={show}>
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
            sx={{ minWidth: "auto", fontWeight: 500 }}
          >
            Período:
          </Typography>
          <Stack direction="row" spacing={0.5}>
            <FilterChip
              label="Hoy"
              isSelected={filterValues.dateRange === "day"}
              onSelect={() => onFilterChange({ dateRange: "day" })}
            />
            <FilterChip
              label="Semana"
              isSelected={filterValues.dateRange === "week"}
              onSelect={() => onFilterChange({ dateRange: "week" })}
            />
            <FilterChip
              label="Mes"
              isSelected={filterValues.dateRange === "month"}
              onSelect={() => onFilterChange({ dateRange: "month" })}
            />
            <FilterChip
              label="Todos"
              isSelected={filterValues.dateRange === "all"}
              onSelect={() => onFilterChange({ dateRange: "all" })}
            />
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ minWidth: "auto", fontWeight: 500 }}
          >
            Ordenar por:
          </Typography>
          <Stack direction="row" spacing={0.5}>
            <FilterChip
              label="Fecha"
              isSelected={filterValues.sortBy === "date"}
              onSelect={() => onFilterChange({ sortBy: "date" })}
            />
            <FilterChip
              label="Miembro"
              isSelected={filterValues.sortBy === "member"}
              onSelect={() => onFilterChange({ sortBy: "member" })}
            />
          </Stack>
        </Stack>
      </Stack>
    </Collapse>
  );
};
