import { Paper, Box, Typography, PaperProps } from "@mui/material";
import { ReactNode } from "react";

interface InfoCardProps extends PaperProps {
  title: string;
  subtitle: string | ReactNode;
  action?: ReactNode;
}

export const InfoCard = ({ title, subtitle, action, ...props }: InfoCardProps) => {
  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        ...props.sx
      }}
      {...props}
    >
      <Box>
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
      {action}
    </Paper>
  );
};