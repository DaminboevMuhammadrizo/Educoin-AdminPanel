'use client';

import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BoyIcon from '@mui/icons-material/Boy';
import GirlIcon from '@mui/icons-material/Girl';

// Mock API data with pagination
const mockChildren = {
    statusCode: 200,
    success: true,
    data: [
        {
            id: "1",
            firstname: "Ali",
            gender: "MALE",
            photo: "https://cdn-icons-png.flaticon.com/512/3011/3011270.png",
            coinBalance: 150
        },
        {
            id: "2",
            firstname: "Zaynab",
            gender: "FEMALE",
            photo: "https://cdn-icons-png.flaticon.com/512/3011/3011292.png",
            coinBalance: 230
        },
        {
            id: "3",
            firstname: "Muhammad",
            gender: "MALE",
            photo: "https://cdn-icons-png.flaticon.com/512/3011/3011270.png",
            coinBalance: 75
        },
        {
            id: "4",
            firstname: "Sofia",
            gender: "FEMALE",
            photo: "https://cdn-icons-png.flaticon.com/512/3011/3011292.png",
            coinBalance: 310
        },
        {
            id: "5",
            firstname: "Omar",
            gender: "MALE",
            photo: "https://cdn-icons-png.flaticon.com/512/3011/3011270.png",
            coinBalance: 120
        },
        {
            id: "6",
            firstname: "Madina",
            gender: "FEMALE",
            photo: "https://cdn-icons-png.flaticon.com/512/3011/3011292.png",
            coinBalance: 180
        },
        {
            id: "7",
            firstname: "Hasan",
            gender: "MALE",
            photo: "https://cdn-icons-png.flaticon.com/512/3011/3011270.png",
            coinBalance: 95
        },
        {
            id: "8",
            firstname: "Fatima",
            gender: "FEMALE",
            photo: "https://cdn-icons-png.flaticon.com/512/3011/3011292.png",
            coinBalance: 260
        },
        {
            id: "9",
            firstname: "Yusuf",
            gender: "MALE",
            photo: "https://cdn-icons-png.flaticon.com/512/3011/3011270.png",
            coinBalance: 140
        },
        {
            id: "10",
            firstname: "Aisha",
            gender: "FEMALE",
            photo: "https://cdn-icons-png.flaticon.com/512/3011/3011292.png",
            coinBalance: 200
        }
    ],
    meta: {
        pagination: {
            count: 50,
            pageCount: 5,
            pageNumber: 1,
            pageSize: 10
        }
    }
};

export default function ChildrenPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const children = mockChildren.data;
    const pagination = mockChildren.meta.pagination;

    const handleView = (id: string) => console.log('View child:', id);
    const handleEdit = (id: string) => console.log('Edit child:', id);
    const handleDelete = (id: string) => console.log('Delete child:', id);
    const handleAdd = () => console.log('Add new child');
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        console.log('Page changed to:', page);
    };

    const getGenderIcon = (gender: string) => {
        return gender === 'MALE' ? <BoyIcon className="text-blue-500" /> : <GirlIcon className="text-pink-500" />;
    };

    const getGenderText = (gender: string) => {
        return gender === 'MALE' ? "O'g'il" : 'Qiz';
    };

    // Calculate row number based on current page
    const getRowNumber = (index: number) => {
        return (currentPage - 1) * pagination.pageSize + index + 1;
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const totalPages = pagination.pageCount;
        const current = currentPage;

        // Show first page, last page, and pages around current page
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (current <= 4) {
                for (let i = 1; i <= 5; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (current >= totalPages - 3) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = current - 1; i <= current + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Bolalar</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Jami {pagination.count} ta bola | Sahifada {children.length} ta
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

            {/* Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                    {/* Table Header */}
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                                T/R
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Bola
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Jinsi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Coin Balans
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amallar
                            </th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="bg-white divide-y divide-gray-200">
                        {children.map((child, index) => (
                            <tr key={child.id} className="hover:bg-gray-50 transition-colors">
                                {/* T/R Number */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                    {getRowNumber(index)}
                                </td>

                                {/* Child Info */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img
                                                className="h-10 w-10 rounded-full object-cover"
                                                src={child.photo}
                                                alt={child.firstname}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {child.firstname}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Gender */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        {getGenderIcon(child.gender)}
                                        <span className="text-sm text-gray-900">
                                            {getGenderText(child.gender)}
                                        </span>
                                    </div>
                                </td>

                                {/* Coin Balance */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                                            🪙 {child.coinBalance} coin
                                        </span>
                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        {/* View Button */}
                                        <button
                                            onClick={() => handleView(child.id)}
                                            className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                                            title="Ko'rish"
                                        >
                                            <VisibilityIcon sx={{ fontSize: 20 }} />
                                        </button>

                                        {/* Edit Button */}
                                        <button
                                            onClick={() => handleEdit(child.id)}
                                            className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                                            title="Tahrirlash"
                                        >
                                            <EditIcon sx={{ fontSize: 20 }} />
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDelete(child.id)}
                                            className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                                            title="O'chirish"
                                        >
                                            <DeleteIcon sx={{ fontSize: 20 }} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg shadow-md">
                {/* Page Info */}
                <div className="flex items-center gap-4 text-sm text-gray-700">
                    <span>
                        Sahifa <span className="font-semibold">{currentPage}</span> / <span className="font-semibold">{pagination.pageCount}</span>
                    </span>
                    <span className="text-gray-500">|</span>
                    <span>
                        Jami: <span className="font-semibold">{pagination.count}</span> ta bola
                    </span>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Oldingi
                    </button>

                    {/* Page Numbers */}
                    <div className="flex gap-1">
                        {getPageNumbers().map((page, index) => (
                            <button
                                key={index}
                                onClick={() => typeof page === 'number' && handlePageChange(page)}
                                disabled={page === '...'}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    page === currentPage
                                        ? 'text-white bg-gradient-to-r from-[#69569F] to-[#8B7AB8] border border-[#69569F]'
                                        : page === '...'
                                        ? 'text-gray-400 cursor-default'
                                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pagination.pageCount}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Keyingi
                    </button>
                </div>
            </div>

            {/* Empty State (agar ma'lumot bo'lmasa) */}
            {children.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-lg">Hech qanday bola topilmadi</div>
                    <button
                        onClick={handleAdd}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg shadow hover:shadow-md transition-all"
                        style={{ background: 'linear-gradient(135deg, #69569F, #8B7AB8)' }}
                    >
                        <AddIcon sx={{ fontSize: 20 }} />
                        <span>Birinchi bolani qo'shing</span>
                    </button>
                </div>
            )}
        </div>
    );
}
