import { useState } from "react";
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText 
} from "@mui/material";
import { MoreVert, Edit, Delete } from "@mui/icons-material";

interface ActionItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: "inherit" | "primary" | "secondary" | "error";
}

interface ActionMenuProps {
  actions: ActionItem[];
}

export const ActionMenu = ({ actions }: ActionMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleAction = (callback: () => void) => {
    handleClose();
    callback();
  };
  
  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {actions.map((action, index) => (
          <MenuItem 
            key={index} 
            onClick={() => handleAction(action.onClick)}
          >
            <ListItemIcon sx={{ color: action.color || 'inherit' }}>
              {action.icon}
            </ListItemIcon>
            <ListItemText 
              primary={action.label} 
              primaryTypographyProps={{ 
                color: action.color || 'inherit' 
              }} 
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};