'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TaskIcon from '@mui/icons-material/Task';
import RecommendIcon from '@mui/icons-material/Recommend';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CategoryIcon from '@mui/icons-material/Category';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaymentIcon from '@mui/icons-material/Payment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import ChildCareIcon from '@mui/icons-material/ChildCare';

function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

    const menuItems = [
        { icon: <DashboardIcon />, label: 'Dashboard', path: '/' },
        { icon: <FamilyRestroomIcon />, label: 'Ota-ona', path: '/parents' },
        { icon: <ChildCareIcon />, label: 'Bolalar', path: '/children' },
        { icon: <TaskIcon />, label: 'Vazifalar', path: '/tasks' },
        { icon: <AssignmentIcon />, label: 'Standart vazifalar', path: '/default-tasks' },
        { icon: <RecommendIcon />, label: 'Tavsiyalar', path: '/recommendations' },
        { icon: <CardGiftcardIcon />, label: "Platforma sovg'alari", path: '/platform-gifts' },
        { icon: <CategoryIcon />, label: 'Kategoriyalar', path: '/categories' },
        { icon: <CardMembershipIcon />, label: 'Obuna rejalari', path: '/subscription-plans' },
        { icon: <NotificationsIcon />, label: 'Bildirishnomalar', path: '/notifications' },
        { icon: <PaymentIcon />, label: "To'lovlar", path: '/payments' },
    ];

    const handleMenuClick = (path: string) => {
        router.push(path);
    };

    return (
        <aside
            className="fixed left-0 w-64 bg-gray-50 shadow-md overflow-y-auto border-r border-gray-200"
            style={{
                top: '61px',
                height: 'calc(100vh - 61px)',
                zIndex: 40,
            }}
        >
            <div className="py-6">
                <div className="px-3 mb-6">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-4 mt-2">Menu</p>
                    <nav className="space-y-2">
                        {menuItems.map((item, index) => {
                            const active = isActive(item.path);

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleMenuClick(item.path)}
                                    className={`w-full flex items-center px-3 py-3 rounded-lg transition-all text-sm group ${active ? 'text-white font-medium shadow-md' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                                        }`}
                                    style={active ? { background: 'linear-gradient(135deg, #69569F 0%, #8B7AB8 100%)' } : {}}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-gray-600 group-hover:text-[#69569F]'}`}>
                                            {item.icon}
                                        </span>
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
