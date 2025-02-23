import { useState } from "react";
import {
  Drawer,
  IconButton,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
} from "@mui/material";
import {
  FilterList as FilterIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

// Actualizar la interfaz añadiendo sortDirection
export interface FilterValues {
  search: string;
  status: "all" | "active" | "inactive";
  sortBy: "name" | "date" | "status";
  sortDirection: "asc" | "desc";
}

interface Props {
  onFilter: (values: FilterValues) => void;
}

export const MemberFilters = ({ onFilter }: Props) => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    status: "all",
    sortBy: "name",
    sortDirection: "asc", // Añadir valor inicial
  });

  const handleSubmit = () => {
    onFilter(filters);
    setOpen(false);
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)} color="primary">
        <FilterIcon />
      </IconButton>

      <Drawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16 },
        }}
      >
        <Box p={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Filtros</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Stack spacing={3}>
            <TextField
              label="Buscar"
              fullWidth
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />

            <FormControl fullWidth>
              <InputLabel id="status-label">Estado</InputLabel>
              <Select
                labelId="status-label"
                value={filters.status}
                label="Estado"
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value as any })
                }
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="active">Activo</MenuItem>
                <MenuItem value="inactive">Inactivo</MenuItem>
              </Select>
            </FormControl>

            <Stack direction="row" spacing={1} alignItems="center">
              <FormControl fullWidth>
                <InputLabel id="sort-by-label">Ordenar por</InputLabel>
                <Select
                  labelId="sort-by-label"
                  value={filters.sortBy}
                  label="Ordenar por"
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value as any })
                  }
                >
                  <MenuItem value="name">Nombre</MenuItem>
                  <MenuItem value="date">Fecha</MenuItem>
                  <MenuItem value="status">Estado</MenuItem>
                </Select>
              </FormControl>
              <IconButton
                onClick={() =>
                  setFilters((f) => ({
                    ...f,
                    sortDirection: f.sortDirection === "asc" ? "desc" : "asc",
                  }))
                }
              >
                {filters.sortDirection === "asc" ? "↑" : "↓"}
              </IconButton>
            </Stack>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleSubmit}
            >
              Aplicar filtros
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};
