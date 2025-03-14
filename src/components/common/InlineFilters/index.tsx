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
}

interface InlineFiltersProps {
  filterGroups: FilterGroup[];
  onFilterChange: (groupName: string, selectedFilters: string[]) => void;
}

export const InlineFilters = ({ filterGroups, onFilterChange }: InlineFiltersProps) => {
  // Estado para almacenar los filtros seleccionados por grupo
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(() => {
    const initialState: Record<string, string[]> = {};
    filterGroups.forEach(group => {
      initialState[group.name] = [];
    });
    return initialState;
  });

  // Manejar la selección/deselección de un filtro
  const handleFilterToggle = (groupName: string, filterId: string) => {
    setSelectedFilters(prev => {
      const currentSelected = [...prev[groupName]];
      const filterIndex = currentSelected.indexOf(filterId);
      
      if (filterIndex === -1) {
        // Añadir filtro
        currentSelected.push(filterId);
      } else {
        // Quitar filtro
        currentSelected.splice(filterIndex, 1);
      }
      
      // Notificar al componente padre sobre el cambio
      onFilterChange(groupName, currentSelected);
      
      return {
        ...prev,
        [groupName]: currentSelected
      };
    });
  };

  return (
    <Box sx={{ mb: 2, overflow: 'hidden' }}>
      {filterGroups.map((group) => (
        <Box key={group.name} sx={{ mb: 1 }}>
          <Box 
            sx={{ 
              display: 'flex',
              gap: 0.5,
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': {
                display: 'none'
              },
              pb: 1,
            }}
          >
            {group.options.map((option) => (
              <FilterChip
                key={option.id}
                label={option.label}
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
