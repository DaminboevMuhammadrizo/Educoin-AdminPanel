'use client';

import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Mock API data
const mockTasks = {
    statusCode: 200,
    success: true,
    data: {
        data: [
            {
                id: "1",
                title: "Kunlik darslar",
                desc: "Har kuni kamida 1 ta darsni tugatish",
                createdAt: "2025-01-15T10:30:00.000Z"
            },
            {
                id: "2",
                title: "Vazifalarni bajarish",
                desc: "Kunlik vazifalarni 100% bajarish",
                createdAt: "2025-01-16T11:20:00.000Z"
            },
            {
                id: "3",
                title: "Test topshiriqlari",
                desc: "Har hafta test topshiriqlarini bajarish",
                createdAt: "2025-01-17T09:15:00.000Z"
            },
            {
                id: "4",
                title: "Loyiha ishi",
                desc: "Oylik loyiha ishini topshirish",
                createdAt: "2025-01-18T14:45:00.000Z"
            },
            {
                id: "5",
                title: "Guruh muhokamasi",
                desc: "Guruh muhokamalarida qatnashish",
                createdAt: "2025-01-19T16:30:00.000Z"
            },
            {
                id: "6",
                title: "Video darslik",
                desc: "Video darsliklarni ko'rib chiqish",
                createdAt: "2025-01-20T13:00:00.000Z"
            },
            {
                id: "7",
                title: "Amaliy mashq",
                desc: "Amaliy mashqlarni bajarish",
                createdAt: "2025-01-21T08:15:00.000Z"
            },
            {
                id: "8",
                title: "Quiz test",
                desc: "Haftalik quiz testlarni topshirish",
                createdAt: "2025-01-22T12:30:00.000Z"
            },
            {
                id: "9",
                title: "Progress hisobot",
                desc: "Oylik progress hisobotini tayyorlash",
                createdAt: "2025-01-23T10:45:00.000Z"
            },
            {
                id: "10",
                title: "Final loyiha",
                desc: "Kurs final loyihasini topshirish",
                createdAt: "2025-01-24T14:20:00.000Z"
            }
        ],
        meta: {
            pagination: {
                count: 500,
                pageCount: 50,
                pageNumber: 1,
                pageSize: 10
            }
        }
    }
};

export default function DefaultTasksPage() {
    const [hovered, setHovered] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const tasks = mockTasks.data.data;
    const pagination = mockTasks.data.meta.pagination;

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
                    <h1 className="text-2xl font-bold text-gray-800">Standart Vazifalar</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Jami {pagination.count} ta vazifa | Sahifada {tasks.length} ta
                    </p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg shadow hover:shadow-md transition-all"
                    style={{ background: 'linear-gradient(135deg, #69569F, #8B7AB8)' }}
                >
                    <AddIcon sx={{ fontSize: 20 }} />
                    <span className="text-sm">Qo'shish</span>
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
                                    title="O'chirish"
                                >
                                    <DeleteIcon sx={{ fontSize: 16 }} />
                                </button>
                            </div>
                        )}

                        {/* Content - bir xil struktur */}
                        <div className="flex flex-col items-center text-center mt-4">
                            {/* Task icon - boshqa componentlardagi icon o'rniga task icon */}
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

                            <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
                                {task.title}
                            </h3>

                            <p className="text-xs text-gray-600 mb-2 line-clamp-3">
                                {task.desc}
                            </p>

                            <p className="text-xs text-gray-400">{formatDate(task.createdAt)}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination - bir xil */}
            <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
                <span>
                    Sahifa {pagination.pageNumber} / {pagination.pageCount} | Jami: {pagination.count} ta
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => handlePageChange(pagination.pageNumber - 1)}
                        disabled={pagination.pageNumber === 1}
                        className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                    >
                        Oldingi
                    </button>
                    <button
                        onClick={() => handlePageChange(pagination.pageNumber + 1)}
                        disabled={pagination.pageNumber === pagination.pageCount}
                        className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                    >
                        Keyingi
                    </button>
                </div>
            </div>

            {/* CSS for line clamp */}
            <style jsx>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}
