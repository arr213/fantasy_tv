'use client';

import { AccountCircle } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { User } from "@supabase/supabase-js";
import React from "react";

export function UserMenu({signOut, navigateToProfile}: { signOut: () => void, navigateToProfile: () => void}) {
    'use client';
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const onProfileClick = () => {
        navigateToProfile();
        setAnchorEl(null);
    };

    const onLogoutClick = () => {
        signOut();
        setAnchorEl(null);
    }
  
    return (
      <div>
        <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={(e) => setAnchorEl(e.target as HTMLElement)}
            color="inherit"
        >
            <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={!!anchorEl}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={onProfileClick}>Profile</MenuItem>
          <MenuItem onClick={onLogoutClick}>Logout</MenuItem>
        </Menu>
      </div>
    );
}