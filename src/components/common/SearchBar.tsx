import { InputBase, Paper, IconButton, styled } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchWrapper = styled(Paper)(({ theme }) => ({
  padding: "2px 4px",
  display: "flex",
  alignItems: "center",
  width: "100%",
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    marginBottom: theme.spacing(3),
  },
}));

export const SearchBar = ({
  value,
  onChange,
  placeholder = "Buscar...",
}: SearchBarProps) => {
  return (
    <SearchWrapper elevation={1}>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </SearchWrapper>
  );
};
