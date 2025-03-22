import { Box, Stack, useTheme, useMediaQuery } from "@mui/material";

interface ResponsiveDataViewProps<T> {
  data: T[];
  renderMobileItem: (item: T) => React.ReactNode;
  renderDesktopView: () => React.ReactNode;
  emptyState?: React.ReactNode;
}

export function ResponsiveDataView<T>({
  data,
  renderMobileItem,
  renderDesktopView,
  emptyState
}: ResponsiveDataViewProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!data || data.length === 0) {
    return emptyState || null;
  }

  if (isMobile) {
    return (
      <Stack spacing={2}>
        {data.map((item, index) => (
          <Box key={index}>
            {renderMobileItem(item)}
          </Box>
        ))}
      </Stack>
    );
  }

  return (
    <Box>
      {renderDesktopView()}
    </Box>
  );
}