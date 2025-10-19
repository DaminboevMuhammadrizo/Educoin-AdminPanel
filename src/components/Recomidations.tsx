'use client';

import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Mock API data
const mockRecommendations = {
    statusCode: 200,
    success: true,
    data: {
        data: [
            {
                id: "1",
                title: "Matematika kursi",
                description: "Matematika asoslarini o'rganish uchun mukammal kurs",
                photo: "https://cdn-icons-png.flaticon.com/512/2909/2909808.png",
                createdAt: "2025-01-15T10:30:00.000Z"
            },
            {
                id: "2",
                title: "Dasturlash boshlang'ich",
                description: "Python dasturlash tilini o'rganish",
                photo: "https://cdn-icons-png.flaticon.com/512/686/686589.png",
                createdAt: "2025-01-16T11:20:00.000Z"
            },
            {
                id: "3",
                title: "Ingliz tili",
                description: "Ingliz tilini oson va tez o'rganing",
                photo: "https://cdn-icons-png.flaticon.com/512/2996/2996684.png",
                createdAt: "2025-01-17T09:15:00.000Z"
            },
            {
                id: "4",
                title: "Grafik dizayn",
                description: "Photoshop va Illustrator asoslari",
                photo: "https://cdn-icons-png.flaticon.com/512/2933/2933245.png",
                createdAt: "2025-01-18T14:45:00.000Z"
            },
            {
                id: "5",
                title: "Biznes menejment",
                description: "Biznesni boshqarish sirlari",
                photo: "https://cdn-icons-png.flaticon.com/512/2921/2921222.png",
                createdAt: "2025-01-19T16:30:00.000Z"
            },
            {
                id: "6",
                title: "Sog'lom turmush",
                description: "Sog'likli hayot tarzi uchun maslahatlar",
                photo: "https://cdn-icons-png.flaticon.com/512/2909/2909900.png",
                createdAt: "2025-01-20T13:00:00.000Z"
            },
            {
                id: "7",
                title: "Mobil dasturlash",
                description: "React Native bilan mobil ilovalar yaratish",
                photo: "https://cdn-icons-png.flaticon.com/512/2933/2933245.png",
                createdAt: "2025-01-21T08:15:00.000Z"
            },
            {
                id: "8",
                title: "Maqsad qo'yish",
                description: "Hayotda muvaffaqiyatga erishish sirlari",
                photo: "https://cdn-icons-png.flaticon.com/512/2921/2921222.png",
                createdAt: "2025-01-22T12:30:00.000Z"
            },
            {
                id: "9",
                title: "Veb dizayn",
                description: "Zamonaviy veb saytlar yaratish",
                photo: "https://cdn-icons-png.flaticon.com/512/2996/2996684.png",
                createdAt: "2025-01-23T10:45:00.000Z"
            },
            {
                id: "10",
                title: "Sun'iy intellekt",
                description: "AI va machine learning asoslari",
                photo: "https://cdn-icons-png.flaticon.com/512/686/686589.png",
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

export default function RecommendationsPage() {
    const [hovered, setHovered] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const recommendations = mockRecommendations.data.data;
    const pagination = mockRecommendations.data.meta.pagination;

    // Client-side format funksiyasi
    const formatDate = (date: string) => {
        if (!isClient) return '';
        return new Date(date).toLocaleDateString('uz-UZ').replaceAll('/', '.');
    };

    const handleEdit = (id: string) => console.log('Edit:', id);
    const handleDelete = (id: string) => console.log('Delete:', id);
    const handleAdd = () => console.log('Add new recommendation');
    const handlePageChange = (page: number) => console.log('Page:', page);

    return (
        <div className="p-4">
            {/* Header - category bilan bir xil */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Tavsiyalar</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Jami {pagination.count} ta tavsiya | Sahifada {recommendations.length} ta
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

            {/* Recommendations Grid - category bilan bir xil layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {recommendations.map((rec) => (
                    <div
                        key={rec.id}
                        onMouseEnter={() => setHovered(rec.id)}
                        onMouseLeave={() => setHovered(null)}
                        className="relative bg-white rounded-xl p-5 shadow-md hover:shadow-md transition-all"
                    >
                        {/* Hover buttons - category bilan bir xil */}
                        {hovered === rec.id && (
                            <div className="absolute top-2 right-2 flex gap-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(rec.id);
                                    }}
                                    className="p-1 text-gray-600 rounded-md hover:bg-gray-100"
                                    title="Tahrirlash"
                                >
                                    <EditIcon sx={{ fontSize: 16 }} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(rec.id);
                                    }}
                                    className="p-1 text-gray-600 rounded-md hover:bg-gray-100"
                                    title="O'chirish"
                                >
                                    <DeleteIcon sx={{ fontSize: 16 }} />
                                </button>
                            </div>
                        )}

                        {/* Content - category bilan bir xil struktur */}
                        <div className="flex flex-col items-center text-center mt-4">
                            <div
                                className="w-14 h-14 rounded-full flex items-center justify-center mb-3 overflow-hidden transition-all"
                                style={{
                                    background:
                                        hovered === rec.id
                                            ? 'linear-gradient(135deg, #69569F, #8B7AB8)'
                                            : '#f3f4f6',
                                }}
                            >
                                <img
                                    src={rec.photo}
                                    alt={rec.title}
                                    className="w-8 h-8 object-contain"
                                />
                            </div>
                            <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
                                {rec.title}
                            </h3>
                            <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                                {rec.description}
                            </p>
                            <p className="text-xs text-gray-400">{formatDate(rec.createdAt)}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination - category bilan bir xil */}
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
            `}</style>
        </div>
    );
}
