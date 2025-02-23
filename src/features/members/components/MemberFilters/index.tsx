import { useState } from 'react';
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
  Stack
} from '@mui/material';
import { FilterList as FilterIcon, Close as CloseIcon } from '@mui/icons-material';

export interface FilterValues {
  search: string;
  status: 'all' | 'active' | 'inactive';
  sortBy: 'name' | 'date' | 'status';
}

interface Props {
  onFilter: (values: FilterValues) => void;
}

export const MemberFilters = ({ onFilter }: Props) => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    status: 'all',
    sortBy: 'name'
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
          sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16 }
        }}
      >
        <Box p={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Stack spacing={3}>
            <TextField
              label="Search"
              fullWidth
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy}
                label="Sort By"
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="date">Date Added</MenuItem>
                <MenuItem value="status">Status</MenuItem>
              </Select>
            </FormControl>

            <Button 
              variant="contained" 
              fullWidth 
              size="large"
              onClick={handleSubmit}
            >
              Apply Filters
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};