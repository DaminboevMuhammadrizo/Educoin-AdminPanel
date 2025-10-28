'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import Divider from '@mui/material/Divider';
import { useRouter } from 'next/navigation';

function Navbar() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const router = useRouter();

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        handleClose();
        router.push('/auth/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 w-full bg-white shadow-sm px-6 py-3 border-b border-gray-200 z-50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #69569F 0%, #8B7AB8 100%)' }}
                    >
                        <Image src="/educoin.png" alt="EduCoin logo" width={40} height={40} />
                    </div>
                    <h1
                        className="text-xl font-bold bg-clip-text text-transparent"
                        style={{ backgroundImage: 'linear-gradient(135deg, #69569F 0%, #8B7AB8 100%)' }}
                    >
                        EduCoin
                    </h1>
                </div>

                <div
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-all"
                    onClick={handleClick}
                >
                    <Avatar
                        alt="User Name"
                        src="/user-avatar.jpg"
                        sx={{
                            width: 36,
                            height: 36,
                            bgcolor: '#69569F',
                            fontSize: '14px',
                            fontWeight: 'bold',
                        }}
                    >
                        JD
                    </Avatar>
                    <span className="text-gray-700 font-semibold hidden sm:block">John Doe</span>
                </div>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{
                        sx: {
                            mt: 1,
                            minWidth: 180,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            borderRadius: '12px',
                        },
                    }}
                >
                    <MenuItem
                        onClick={handleClose}
                        sx={{
                            py: 1.5,
                            px: 2,
                            '&:hover': { backgroundColor: '#f3f4f6' },
                        }}
                    >
                        <PersonIcon sx={{ mr: 1.5, color: '#69569F' }} />
                        <span className="font-medium text-gray-700">Profile</span>
                    </MenuItem>

                    <Divider />

                    <MenuItem
                        onClick={handleLogout}
                        sx={{
                            py: 1.5,
                            px: 2,
                            '&:hover': { backgroundColor: '#fee2e2' },
                        }}
                    >
                        <LogoutIcon sx={{ mr: 1.5, color: '#ef4444' }} />
                        <span className="font-medium text-red-600">Logout</span>
                    </MenuItem>
                </Menu>
            </div>
        </nav>
    );
}

export default Navbar;
