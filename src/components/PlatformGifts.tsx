'use client';

import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Mock API data
const mockGifts = {
    statusCode: 200,
    success: true,
    data: {
        data: [
            {
                id: "1",
                title: "Premium Kurs",
                description: "3 oylik premium kursga kirish",
                miniDescription: "Premium kontent",
                photo: "https://cdn-icons-png.flaticon.com/512/2909/2909808.png",
                count: 100,
                amount: 500,
                givenCount: 45,
                createdAt: "2025-01-15T10:30:00.000Z"
            },
            {
                id: "2",
                title: "Kitoblar to'plami",
                description: "10 ta digital kitoblar to'plami",
                miniDescription: "Digital kitoblar",
                photo: "https://cdn-icons-png.flaticon.com/512/686/686589.png",
                count: 50,
                amount: 250,
                givenCount: 32,
                createdAt: "2025-01-16T11:20:00.000Z"
            },
            {
                id: "3",
                title: "Certificate",
                description: "Platforma certificati",
                miniDescription: "Taqdimot certificati",
                photo: "https://cdn-icons-png.flaticon.com/512/2996/2996684.png",
                count: 200,
                amount: 150,
                givenCount: 178,
                createdAt: "2025-01-17T09:15:00.000Z"
            },
            {
                id: "4",
                title: "Mentor Session",
                description: "1 soatlik mentor bilan maslahat",
                miniDescription: "Mentor sessiya",
                photo: "https://cdn-icons-png.flaticon.com/512/2933/2933245.png",
                count: 30,
                amount: 750,
                givenCount: 12,
                createdAt: "2025-01-18T14:45:00.000Z"
            },
            {
                id: "5",
                title: "Discount Code",
                description: "50% chegirma codi",
                miniDescription: "Chegirma codi",
                photo: "https://cdn-icons-png.flaticon.com/512/2921/2921222.png",
                count: 1000,
                amount: 10,
                givenCount: 567,
                createdAt: "2025-01-19T16:30:00.000Z"
            },
            {
                id: "6",
                title: "Premium Account",
                description: "6 oylik premium account",
                miniDescription: "Premium account",
                photo: "https://cdn-icons-png.flaticon.com/512/2909/2909900.png",
                count: 75,
                amount: 1200,
                givenCount: 28,
                createdAt: "2025-01-20T13:00:00.000Z"
            },
            {
                id: "7",
                title: "Workshop",
                description: "Maxsus workshop ishtiroki",
                miniDescription: "Workshop",
                photo: "https://cdn-icons-png.flaticon.com/512/2933/2933245.png",
                count: 40,
                amount: 300,
                givenCount: 40,
                createdAt: "2025-01-21T08:15:00.000Z"
            },
            {
                id: "8",
                title: "E-book",
                description: "Digital elektron kitob",
                miniDescription: "E-book",
                photo: "https://cdn-icons-png.flaticon.com/512/2921/2921222.png",
                count: 500,
                amount: 500,
                givenCount: 423,
                createdAt: "2025-01-22T12:30:00.000Z"
            },
            {
                id: "9",
                title: "Video Course",
                description: "Full video kurslar to'plami",
                miniDescription: "Video kurs",
                photo: "https://cdn-icons-png.flaticon.com/512/2996/2996684.png",
                count: 150,
                amount: 80,
                givenCount: 89,
                createdAt: "2025-01-23T10:45:00.000Z"
            },
            {
                id: "10",
                title: "Consultation",
                description: "Professional konsultatsiya",
                miniDescription: "Konsultatsiya",
                photo: "https://cdn-icons-png.flaticon.com/512/686/686589.png",
                count: 60,
                amount: 450,
                givenCount: 34,
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

export default function PlatformGiftsPage() {
    const [hovered, setHovered] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const gifts = mockGifts.data.data;
    const pagination = mockGifts.data.meta.pagination;

    // Client-side format funksiyasi
    const formatDate = (date: string) => {
        if (!isClient) return '';
        return new Date(date).toLocaleDateString('uz-UZ').replaceAll('/', '.');
    };

    // Format number with commas
    const formatNumber = (num: number) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handleEdit = (id: string) => console.log('Edit:', id);
    const handleDelete = (id: string) => console.log('Delete:', id);
    const handleAdd = () => console.log('Add new gift');
    const handlePageChange = (page: number) => console.log('Page:', page);

    return (
        <div className="p-4">
            {/* Header - boshqa componentlar bilan bir xil */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Platform Sovg'alari</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Jami {pagination.count} ta sovg'a | Sahifada {gifts.length} ta
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

            {/* Gifts Grid - boshqa componentlar bilan bir xil layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {gifts.map((gift) => (
                    <div
                        key={gift.id}
                        onMouseEnter={() => setHovered(gift.id)}
                        onMouseLeave={() => setHovered(null)}
                        className="relative bg-white rounded-xl p-5 shadow-md hover:shadow-md transition-all"
                    >
                        {/* Hover buttons - bir xil */}
                        {hovered === gift.id && (
                            <div className="absolute top-2 right-2 flex gap-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(gift.id);
                                    }}
                                    className="p-1 text-gray-600 rounded-md hover:bg-gray-100"
                                    title="Tahrirlash"
                                >
                                    <EditIcon sx={{ fontSize: 16 }} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(gift.id);
                                    }}
                                    className="p-1 text-gray-600 rounded-md hover:bg-gray-100"
                                    title="O'chirish"
                                >
                                    <DeleteIcon sx={{ fontSize: 16 }} />
                                </button>
                            </div>
                        )}

                        {/* Content - bir xil struktur lekin qo'shimcha ma'lumotlar bilan */}
                        <div className="flex flex-col items-center text-center mt-4">
                            <div
                                className="w-14 h-14 rounded-full flex items-center justify-center mb-3 overflow-hidden transition-all"
                                style={{
                                    background:
                                        hovered === gift.id
                                            ? 'linear-gradient(135deg, #69569F, #8B7AB8)'
                                            : '#f3f4f6',
                                }}
                            >
                                <img
                                    src={gift.photo}
                                    alt={gift.title}
                                    className="w-8 h-8 object-contain"
                                />
                            </div>

                            <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
                                {gift.title}
                            </h3>

                            <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                                {gift.miniDescription}
                            </p>

                            {/* Statistics */}
                            <div className="w-full mt-2 space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Soni:</span>
                                    <span className="font-medium">{formatNumber(gift.count)} ta</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Berildi:</span>
                                    <span className="font-medium text-green-600">{formatNumber(gift.givenCount)} ta</span>
                                </div>
                                {gift.amount > 0 && (
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">Narxi:</span>
                                        <span className="font-medium text-blue-600">{formatNumber(gift.amount)} coin</span>
                                    </div>
                                )}
                            </div>

                            <p className="text-xs text-gray-400 mt-2">{formatDate(gift.createdAt)}</p>
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
            `}</style>
        </div>
    );
}
