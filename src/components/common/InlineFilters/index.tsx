import { Box, Typography } from "@mui/material";
import { FilterChip } from "../FilterChip";
import { useState } from "react";

export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterGroup {
  name: string;
  options: FilterOption[];
  type?: string; // Añadimos esta prop opcional
}

interface InlineFiltersProps {
  filterGroups: FilterGroup[];
  onFilterChange: (groupName: string, selectedFilters: string[]) => void;
}

export const InlineFilters = ({
  filterGroups,
  onFilterChange,
}: InlineFiltersProps) => {
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >(() => {
    const initialState: Record<string, string[]> = {};
    filterGroups.forEach((group) => {
      initialState[group.name] = [];
    });
    return initialState;
  });

  const handleFilterToggle = (groupName: string, filterId: string) => {
    setSelectedFilters((prev) => {
      const currentSelected = prev[groupName];
      let newSelected: string[];

      // Si el filtro ya está seleccionado, lo deseleccionamos
      if (currentSelected.includes(filterId)) {
        newSelected = [];
      } else {
        // Si es un nuevo filtro, lo seleccionamos y removemos cualquier otro
        newSelected = [filterId];
      }

      onFilterChange(groupName, newSelected);

      return {
        ...prev,
        [groupName]: newSelected,
      };
    });
  };

  return (
    <Box sx={{ mb: 2, overflow: "hidden" }}>
      {filterGroups.map((group) => (
        <Box key={group.name} sx={{ mb: 1 }}>
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
              pb: 1,
            }}
          >
            {group.options.map((option) => (
              <FilterChip
                key={option.id}
                id={option.id}
                label={option.label}
                type={group.type}  // Pasamos el type aquí
                isSelected={selectedFilters[group.name].includes(option.id)}
                onSelect={() => handleFilterToggle(group.name, option.id)}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
