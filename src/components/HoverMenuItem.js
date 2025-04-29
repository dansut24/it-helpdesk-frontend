import React, { useState, useRef } from "react";
import { ListItem, ListItemText, Box, MenuItem, Popper, Fade, Paper as MuiPaper } from "@mui/material";

const HoverMenuItem = ({ icon, label, active, open, subItems }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const timeoutRef = useRef();

  const handleEnter = (event) => {
    clearTimeout(timeoutRef.current);
    setAnchorEl(event.currentTarget);
    setMenuVisible(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setMenuVisible(false);
    }, 300);
  };

  return (
    <>
      <ListItem
        button
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        sx={{
          borderRadius: 2,
          mb: 1,
          px: open ? 2 : 1,
          justifyContent: open ? "flex-start" : "center",
          color: active ? "primary.main" : "text.primary",
          bgcolor: active ? "action.selected" : "transparent",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        {React.cloneElement(icon, { sx: { mr: open ? 1.5 : 0, fontSize: "1.25rem" } })}
        {open && <ListItemText primary={label} />}
      </ListItem>

      {open && (
        <Popper
          open={menuVisible}
          anchorEl={anchorEl}
          placement="right-start"
          transition
          disablePortal={false}
          container={document.body}
          onMouseEnter={() => clearTimeout(timeoutRef.current)}
          onMouseLeave={handleLeave}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={200}>
              <MuiPaper sx={{ p: 1, minWidth: 200, boxShadow: 3 }}>
                {subItems.map((item) => (
                  <MenuItem key={item.label} onClick={item.onClick}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {item.icon}
                      <Typography variant="body2">{item.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </MuiPaper>
            </Fade>
          )}
        </Popper>
      )}
    </>
  );
};

export default HoverMenuItem;
