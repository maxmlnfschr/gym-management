import { Card, CardContent, Typography, Box, Stack } from "@mui/material";
import { formatCurrency } from "@/utils/formatters";
import { SxProps, Theme } from "@mui/material";

interface PlanCardProps {
  name: string;
  price: number;
  selected: boolean;
  description?: string;
  duration?: number;
  onSelect: () => void;
  sx?: SxProps<Theme>;
}

export const PlanCard = ({
  name,
  price,
  selected,
  description,
  duration,
  onSelect,
  sx,
}: PlanCardProps) => {
  return (
    <Box
      onClick={onSelect}
      sx={{
        cursor: "pointer",
        position: "relative",
        border: "1px solid",
        borderColor: selected ? "primary.main" : "grey.300",
        borderRadius: 0,
        bgcolor: selected ? "grey.50" : "background.paper",
        p: 2,
        mb: "-1px",
        "&:first-of-type": {
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        },
        "&:last-of-type": {
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        },
        "&:hover": {
          bgcolor: "grey.50",
          borderColor: selected ? "primary.main" : "grey.400",
          zIndex: 1,
        },
        ...sx,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              border: "2px solid",
              borderColor: selected ? "primary.main" : "grey.400",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {selected && (
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                }}
              />
            )}
          </Box>
          <Typography>{name}</Typography>
        </Box>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: "0.875rem",
          }}
        >
          {typeof price === "number" ? formatCurrency(price) : price}
        </Typography>
      </Box>

      <Box
        sx={{
          maxHeight: selected ? "500px" : "0px", // Aumentamos para asegurar que quepa todo el contenido
          opacity: selected ? 1 : 0,
          overflow: "hidden",
          transition: "all 0.3s ease-in-out",
          mt: selected ? 2 : 0,
          pt: selected ? 2 : 0,
          borderTop: selected ? "1px solid" : "none",
          borderColor: "grey.200",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: "0.875rem",
            lineHeight: 1.5,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
};
