import { InputBase, Paper, IconButton, styled } from "@mui/material";
import { Search as SearchIcon, Cancel as CancelIcon } from "@mui/icons-material";

const SearchWrapper = styled(Paper)(({ theme }) => ({
  padding: '4px 0',  // Añadimos padding vertical pero mantenemos 0 en horizontal
  display: "flex",
  alignItems: "center",
  width: "100%",
  '& .MuiIconButton-root': {
    padding: '8px',
  },
  '& .MuiInputBase-root': {
    padding: '0 8px',
  }
}));

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({
  value,
  onChange,
  placeholder = "Buscar...",
}: SearchBarProps) => {
  const handleClear = () => {
    onChange("");
  };

  return (
    <SearchWrapper elevation={1}>
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ flex: 1 }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <IconButton
          type="button"
          sx={{
            '& .MuiSvgIcon-root': {
              fontSize: '20px'
            }
          }}
          aria-label="clear"
          onClick={handleClear}
        >
          <CancelIcon />
        </IconButton>
      )}
    </SearchWrapper>
  );
};
