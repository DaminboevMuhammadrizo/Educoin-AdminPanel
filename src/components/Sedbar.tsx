'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PeopleIcon from '@mui/icons-material/People';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TaskIcon from '@mui/icons-material/Task';
import RecommendIcon from '@mui/icons-material/Recommend';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CategoryIcon from '@mui/icons-material/Category';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaymentIcon from '@mui/icons-material/Payment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import DashboardIcon from '@mui/icons-material/Dashboard';


function Sidebar() {
    const router = useRouter();
    const [usersOpen, setUsersOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('Users');

    const menuItems = [
        {
            icon: <DashboardIcon />,
            label: 'Dashboard',
            path: '/',
        },
        {
            icon: <PeopleIcon />,
            label: 'Users',
            path: '/users',
            hasSubmenu: true,
            submenu: [
                { icon: <FamilyRestroomIcon />, label: 'Ota-ona', path: '/users/parents' },
                { icon: <ChildCareIcon />, label: 'Bolalar', path: '/users/children' }
            ]
        },
        { icon: <CardMembershipIcon />, label: 'Obuna rejalari', path: '/subscription-plans' },
        { icon: <AssignmentIcon />, label: 'Standart vazifalar', path: '/default-tasks' },
        { icon: <TaskIcon />, label: 'Vazifalar', path: '/tasks' },
        { icon: <RecommendIcon />, label: 'Tavsiyalar', path: '/recommendations' },
        { icon: <CardGiftcardIcon />, label: "Platforma sovg'alari", path: '/platform-gifts' },
        { icon: <CategoryIcon />, label: 'Kategoriyalar', path: '/categories' },
        { icon: <NotificationsIcon />, label: 'Bildirishnomalar', path: '/notifications' },
        { icon: <PaymentIcon />, label: "To'lovlar", path: '/payments' },
    ];

    const handleMenuClick = (item: any) => {
        if (item.hasSubmenu) {
            setUsersOpen(!usersOpen);
        } else {
            setActiveItem(item.label);
            router.push(item.path);
        }
    };

    const handleSubmenuClick = (subItem: any) => {
        setActiveItem(subItem.label);
        router.push(subItem.path);
    };

    return (
        <aside
            className="fixed left-0 w-64 bg-gray-50 shadow-md overflow-y-auto border-r border-gray-200"
            style={{
                top: '61px',
                height: 'calc(100vh - 61px)',
                zIndex: 40
            }}
        >
            <div className="py-6">
                {/* Menu Section */}
                <div className="px-3 mb-6">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-4 mt-2">Menu</p>
                    <nav className="space-y-2">
                        {menuItems.map((item, index) => (
                            <div key={index}>
                                {/* Main menu item */}
                                <button
                                    onClick={() => handleMenuClick(item)}
                                    className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all text-sm group ${activeItem === item.label && !item.hasSubmenu
                                            ? 'text-white font-medium shadow-md'
                                            : 'text-gray-700 hover:bg-white hover:shadow-sm'
                                        }`}
                                    style={
                                        activeItem === item.label && !item.hasSubmenu
                                            ? { background: 'linear-gradient(135deg, #69569F 0%, #8B7AB8 100%)' }
                                            : {}
                                    }
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`transition-transform group-hover:scale-110 ${activeItem === item.label && !item.hasSubmenu ? 'text-white' : 'text-gray-600 group-hover:text-[#69569F]'
                                            }`}>
                                            {item.icon}
                                        </span>
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                    {item.hasSubmenu && (
                                        <span className={`transition-transform ${usersOpen ? 'rotate-180' : ''} ${activeItem === item.label && !item.hasSubmenu ? 'text-white' : 'text-gray-500 group-hover:text-[#69569F]'
                                            }`}>
                                            <ExpandMoreIcon fontSize="small" />
                                        </span>
                                    )}
                                </button>

                                {/* Submenu */}
                                {item.hasSubmenu && usersOpen && (
                                    <div className="ml-6 mt-2 space-y-1 border-l-2 border-gray-200 pl-2">
                                        {item.submenu?.map((subItem, subIndex) => (
                                            <button
                                                key={subIndex}
                                                onClick={() => handleSubmenuClick(subItem)}
                                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm group ${activeItem === subItem.label
                                                        ? 'text-white font-medium shadow-md'
                                                        : 'text-gray-600 hover:bg-white hover:shadow-sm'
                                                    }`}
                                                style={
                                                    activeItem === subItem.label
                                                        ? { background: 'linear-gradient(135deg, #69569F 0%, #8B7AB8 100%)' }
                                                        : {}
                                                }
                                            >
                                                <span className={`transition-transform group-hover:scale-110 ${activeItem === subItem.label ? 'text-white' : 'text-gray-500 group-hover:text-[#69569F]'
                                                    }`}>
                                                    {subItem.icon}
                                                </span>
                                                <span className="font-medium">{subItem.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
