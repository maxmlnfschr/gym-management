import { Fab, Zoom, useScrollTrigger, Stack } from "@mui/material";
import { KeyboardArrowUp, Search, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const FloatingActions = () => {
  const navigate = useNavigate();
  const trigger = useScrollTrigger({
    threshold: 100,
    disableHysteresis: true, // Hace que la transición sea más inmediata
  });

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSearchFocus = () => {
    const searchInput = document.querySelector(
      'input[placeholder="Buscar miembros..."]'
    );
    if (searchInput) {
      searchInput.scrollIntoView({ behavior: "smooth" });
      (searchInput as HTMLElement).focus();
    }
  };

  return (
    <Zoom in={trigger}>
      <Stack
        spacing={1.5}
        sx={{
          position: "fixed",
          bottom: { xs: 98, sm: 32 },
          right: { xs: 30, sm: 40 },
          zIndex: 1500,
        }}
      >
        <Fab
          onClick={() => navigate("/members/add")}
          sx={{
            width: 48,
            height: 48,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            "&:hover": {
              boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
            },
          }}
          color="primary"
          aria-label="add member"
        >
          <Add />
        </Fab>
        <Fab
          onClick={handleSearchFocus}
          sx={{
            width: 48,
            height: 48,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            bgcolor: "grey.100",
            color: "text.secondary",
            "&:hover": {
              bgcolor: "grey.200",
              boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
            },
          }}
          aria-label="search"
        >
          <Search />
        </Fab>
        <Fab
          onClick={handleScrollTop}
          sx={{
            width: 48,
            height: 48,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            bgcolor: "grey.100",
            color: "text.secondary",
            "&:hover": {
              bgcolor: "grey.200",
              boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
            },
          }}
          aria-label="scroll back to top"
        >
          <KeyboardArrowUp />
        </Fab>
      </Stack>
    </Zoom>
  );
};
