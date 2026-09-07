import React from "react";

import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Menu as MenuIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import { Outlet, Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

function Layout() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem("token")) return;
    navigate("/login");
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="App">
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} onClick={() => setDrawerOpen(false)}>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/admin/pages"
                selected={pathname === "/admin/pages" || pathname.startsWith("/admin/pages/")}
              >
                <ListItemText primary="Pages" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/admin/media"
                selected={pathname === "/admin/media"}
              >
                <ListItemText primary="Media" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/en">
                <ListItemText primary="View website" />
                <OpenInNewIcon sx={{ fontSize: 16, color: "text.disabled" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemText primary="Log out" />
                <LogoutIcon sx={{ fontSize: 16, color: "text.disabled" }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Outlet />
    </div>
  );
}

export default Layout;
