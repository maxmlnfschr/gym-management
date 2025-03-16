import { Card, CardContent, Typography, Box } from "@mui/material";
import { formatCurrency } from "@/utils/formatters";
import { SxProps, Theme } from "@mui/material";

interface PlanCardProps {
  name: string;
  price: number;
  duration: number;
  selected: boolean;
  onSelect: () => void;
  sx?: SxProps<Theme>; // Add this line to support the sx prop
}

export const PlanCard = ({
  name,
  price,
  duration,
  selected,
  onSelect,
  sx,
}: PlanCardProps) => {
  return (
    <Card
      onClick={onSelect}
      sx={{
        cursor: "pointer",
        boxShadow: selected ? 3 : 1,
        border: selected ? "2px solid #4caf50" : "none",
        bgcolor: selected ? "#e8f5e9" : "background.paper",
        "&:hover": {
          boxShadow: 2,
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {name}
        </Typography>
        <Typography variant="h4" component="div" gutterBottom>
          {formatCurrency(price)}
        </Typography>
        <Typography color="text.secondary">
          {duration} {duration === 1 ? "mes" : "meses"}
        </Typography>
      </CardContent>
    </Card>
  );
};
