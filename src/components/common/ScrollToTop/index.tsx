import { Fab, Zoom, useScrollTrigger } from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";

export const ScrollToTop = () => {
  const trigger = useScrollTrigger({
    threshold: 50,
  });
  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return (
    <Zoom in={trigger}>
      <Fab
        onClick={handleClick}
        sx={{
          position: 'fixed',
          bottom: { xs: 88, sm: 32 },
          right: { xs: 24, sm: 32 }, // Ajustado para mejor espaciado en móvil
          zIndex: 1500,
          width: { xs: 40, sm: 40 },
          height: { xs: 40, sm: 40 },
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
          },
        }}
        size="medium"
        color="primary"
        aria-label="scroll back to top"
      >
        <KeyboardArrowUp fontSize="medium" />
      </Fab>
    </Zoom>
  );
};
