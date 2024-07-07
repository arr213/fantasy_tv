import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AuthButton from './AuthButton';
import Link from 'next/link';


const Nav = () => {
    
    return (
        <Box className="w-dvw mb-8 h-10">
            <AppBar position="static" className="w-full">
                <Toolbar className="w-full flex justify-items-between mx-auto lg:w-3/4">
                    <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link href={"/"}>
                        Fantasy Big Brother
                        </Link>
                    </Typography>
                    <div className="justify-self-end">
                        <AuthButton />
                    </div>
                    
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Nav