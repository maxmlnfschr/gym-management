import { Paper, Box, Typography, PaperProps, TypographyProps } from "@mui/material";
import { ReactNode } from "react";

interface InfoCardOwnProps {
  title: string | ReactNode;
  titleProps?: TypographyProps;
  subtitle?: string | ReactNode;
  subtitleProps?: TypographyProps;
  action?: ReactNode;
  avatar?: ReactNode;
}

type InfoCardProps = InfoCardOwnProps & Omit<PaperProps, keyof InfoCardOwnProps>;

export const InfoCard = ({ 
  title, 
  titleProps = { variant: "subtitle1", sx: { fontWeight: 500 } },
  subtitle, 
  subtitleProps = { variant: "body2", color: "text.secondary" },
  action, 
  avatar, 
  ...props 
}: InfoCardProps) => {
  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        ...props.sx,
      }}
      {...props}
    >
      {avatar && avatar}
      <Box sx={{ flex: 1 }}>
        <Typography {...titleProps}>
          {typeof title === 'string' ? title : title}
        </Typography>
        {subtitle && (
          typeof subtitle === 'string' ? (
            <Typography {...subtitleProps}>{subtitle}</Typography>
          ) : subtitle
        )}
      </Box>
      {action && <Box>{action}</Box>}
    </Paper>
  );
};