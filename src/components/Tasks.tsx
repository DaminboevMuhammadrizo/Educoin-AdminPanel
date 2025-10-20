'use client';

import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ChildIcon from '@mui/icons-material/ChildCare';

// Mock API data
const mockTasks = {
    statusCode: 200,
    success: true,
    data: [
        {
            id: "1",
            title: "Matematika vazifasi",
            desc: "5 ta masala yechish",
            coin: 50,
            dueDate: "2025-09-21T00:00:00.000Z",
            children: [
                { id: "child1" },
                { id: "child2" }
            ]
        },
        {
            id: "2",
            title: "Kitob o'qish",
            desc: "Kuniga 10 bet kitob o'qish",
            coin: 30,
            dueDate: "2025-09-22T00:00:00.000Z",
            children: [
                { id: "child1" }
            ]
        },
        {
            id: "3",
            title: "Sport mashg'uloti",
            desc: "30 daqiqa jismoniy mashq",
            coin: 25,
            dueDate: "2025-09-23T00:00:00.000Z",
            children: [
                { id: "child1" },
                { id: "child2" },
                { id: "child3" }
            ]
        },
        {
            id: "4",
            title: "Uy vazifasi",
            desc: "Darslikdagi barcha topshiriqlar",
            coin: 40,
            dueDate: "2025-09-24T00:00:00.000Z",
            children: [
                { id: "child1" }
            ]
        },
        {
            id: "5",
            title: "Loyiha ishi",
            desc: "Science loyihasini tayyorlash",
            coin: 100,
            dueDate: "2025-09-25T00:00:00.000Z",
            children: [
                { id: "child1" },
                { id: "child2" }
            ]
        },
        {
            id: "6",
            title: "Musiqa darsi",
            desc: "Yangi qo'shiq o'rganish",
            coin: 35,
            dueDate: "2025-09-26T00:00:00.000Z",
            children: [
                { id: "child1" }
            ]
        },
        {
            id: "7",
            title: "Rasm chizish",
            desc: "Tabiat manzarasini chizish",
            coin: 45,
            dueDate: "2025-09-27T00:00:00.000Z",
            children: [
                { id: "child1" },
                { id: "child2" }
            ]
        },
        {
            id: "8",
            title: "Dasturlash",
            desc: "Yangi kod yozish",
            coin: 80,
            dueDate: "2025-09-28T00:00:00.000Z",
            children: [
                { id: "child1" }
            ]
        },
        {
            id: "9",
            title: "Til o'rganish",
            desc: "10 ta yangi so'z",
            coin: 20,
            dueDate: "2025-09-29T00:00:00.000Z",
            children: [
                { id: "child1" },
                { id: "child2" },
                { id: "child3" }
            ]
        },
        {
            id: "10",
            title: "Ijtimoiy vazifa",
            desc: "Oilaga yordam berish",
            coin: 15,
            dueDate: "2025-09-30T00:00:00.000Z",
            children: [
                { id: "child1" }
            ]
        }
    ]
};

export default function TasksPage() {
    const [hovered, setHovered] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const tasks = mockTasks.data;

    // Client-side format funksiyasi
    const formatDate = (date: string) => {
        if (!isClient) return '';
        return new Date(date).toLocaleDateString('uz-UZ').replaceAll('/', '.');
    };

    const handleEdit = (id: string) => console.log('Edit:', id);
    const handleDelete = (id: string) => console.log('Delete:', id);
    const handleAdd = () => console.log('Add new task');
    const handlePageChange = (page: number) => console.log('Page:', page);

    return (
        <div className="p-4">
            {/* Header - boshqa componentlar bilan bir xil */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Vazifalar</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Jami {tasks.length} ta vazifa
                    </p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg shadow hover:shadow-md transition-all"
                    style={{ background: 'linear-gradient(135deg, #69569F, #8B7AB8)' }}
                >
                    <AddIcon sx={{ fontSize: 20 }} />
                    <span className="text-sm">Qo&apos;shish</span>
                </button>
            </div>

            {/* Tasks Grid - boshqa componentlar bilan bir xil layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        onMouseEnter={() => setHovered(task.id)}
                        onMouseLeave={() => setHovered(null)}
                        className="relative bg-white rounded-xl p-5 shadow-md hover:shadow-md transition-all"
                    >
                        {/* Hover buttons - bir xil */}
                        {hovered === task.id && (
                            <div className="absolute top-2 right-2 flex gap-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(task.id);
                                    }}
                                    className="p-1 text-gray-600 rounded-md hover:bg-gray-100"
                                    title="Tahrirlash"
                                >
                                    <EditIcon sx={{ fontSize: 16 }} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(task.id);
                                    }}
                                    className="p-1 text-gray-600 rounded-md hover:bg-gray-100"
                                    title="O&apos;chirish"
                                >
                                    <DeleteIcon sx={{ fontSize: 16 }} />
                                </button>
                            </div>
                        )}

                        {/* Content - bir xil struktur */}
                        <div className="flex flex-col items-center text-center">
                            {/* Task icon */}
                            <div
                                className="w-14 h-14 rounded-full flex items-center justify-center mb-3 overflow-hidden transition-all"
                                style={{
                                    background:
                                        hovered === task.id
                                            ? 'linear-gradient(135deg, #69569F, #8B7AB8)'
                                            : '#f3f4f6',
                                }}
                            >
                                <div className="text-gray-600">
                                    <svg
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M9 11l3 3L22 4"></path>
                                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                    </svg>
                                </div>
                            </div>

                            {/* Task title */}
                            <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
                                {task.title}
                            </h3>

                            {/* Task description */}
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                {task.desc}
                            </p>

                            {/* Task details */}
                            <div className="w-full space-y-2 mb-2">
                                {/* Coin */}
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">Coin:</span>
                                    <span className="font-semibold text-yellow-600 flex items-center gap-1">
                                        🪙 {task.coin}
                                    </span>
                                </div>

                                {/* Due date */}
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">Muddat:</span>
                                    <span className="font-medium">{formatDate(task.dueDate)}</span>
                                </div>

                                {/* Children count */}
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">Farzandlar:</span>
                                    <span className="font-medium text-blue-600 flex items-center gap-1">
                                        <ChildIcon sx={{ fontSize: 14 }} />
                                        {task.children.length}
                                    </span>
                                </div>
                            </div>

                            {/* Task ID */}
                            <p className="text-xs text-gray-400">ID: {task.id}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* CSS for line clamp */}
            <style jsx>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}
