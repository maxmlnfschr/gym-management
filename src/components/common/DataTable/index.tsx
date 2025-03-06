import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  CircularProgress,
  Box,
  Typography
} from "@mui/material";

interface Column<T> {
  id: string;
  label: string;
  render: (item: T) => React.ReactNode;
  width?: string | number;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
}

export function DataTable<T>({ 
  columns, 
  data, 
  isLoading = false,
  keyExtractor,
  emptyMessage = "No hay datos disponibles"
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box textAlign="center" p={3}>
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} style={{ width: column.width }}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={keyExtractor(item)} hover>
              {columns.map((column) => (
                <TableCell key={`${keyExtractor(item)}-${column.id}`}>
                  {column.render(item)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}