'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from '@/utils/getToken';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BoyIcon from '@mui/icons-material/Boy';
import GirlIcon from '@mui/icons-material/Girl';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CircularProgress from '@mui/material/CircularProgress';
import toast from 'react-hot-toast';
import ChildDetail from '@/modals/child/gwtDetail';

interface Parent {
    id: string;
    firstname: string;
    lastname: string;
    phone: string;
    photo: string | null;
}

interface Child {
    id: string;
    photo: string | null;
    phone: string | null;
    firstname: string;
    lastname: string | null;
    gender: 'MALE' | 'FEMALE';
    character: string | null;
    parent: Parent | null;
    platformCoinBalance: number;
    coinBalance: number;
    birthDate: string;
    createdAt: string;
}

interface ApiResponse {
    statusCode: number;
    success: boolean;
    data: {
        data: Child[];
        meta: {
            pagination: {
                pageNumber: number;
                pageSize: number;
                count: number;
                pageCount: number;
            };
        };
    };
}


interface DeleteConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    childName: string;
}

function DeleteConfirmModal({ open, onClose, onConfirm, childName }: DeleteConfirmModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg w-[320px] text-center" onClick={e => e.stopPropagation()}>
                <h2 className="text-lg font-semibold mb-2">Bolani o'chirish</h2>
                <p className="text-gray-600 mb-4 text-sm">
                    <span className="font-medium">{childName}</span> ismli bolani rostdan ham o'chirmoqchimisiz?
                </p>
                <p className="text-xs text-red-600 mb-4">
                    Bu amalni ortga qaytarib bo'lmaydi!
                </p>
                <div className="flex justify-around gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors flex-1"
                    >
                        Bekor qilish
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors flex-1"
                    >
                        O'chirish
                    </button>
                </div>
            </div>
        </div>
    );
}



export default function ChildrenPage() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const imgUrl = process.env.NEXT_PUBLIC_IMG_URL;

    const [children, setChildren] = useState<Child[]>([]);
    const [selectedChild, setSelectedChild] = useState<Child | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteName, setDeleteName] = useState('');
    const [pagination, setPagination] = useState({
        count: 0,
        pageCount: 0,
        pageNumber: 1,
        pageSize: 10
    });

    // Agar bola tanlangan bo'lsa, faqat shu bolani ko'rsatish
    const showDetailView = selectedChild !== null;

    // Rasm URL ni to'g'ri formatga o'tkazish
    const getImageUrl = (photoPath: string | null): string => {
        if (!photoPath) return '';

        if (photoPath.startsWith('http')) return photoPath;

        if (photoPath.startsWith('/')) {
            return `${imgUrl}${photoPath}`;
        }

        return `${imgUrl}/${photoPath}`;
    };

    const fetchChildren = async (page: number = 1, search: string = '') => {
        try {
            setLoading(true);
            const params: any = {
                pageNumber: page,
                pageSize: 10
            };

            // Agar search query bo'lsa, params ga qo'shamiz
            if (search.trim()) {
                params.search = search.trim();
            }

            const response = await axios.get<ApiResponse>(`${baseUrl}/users/children`, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    'Content-Type': 'application/json'
                },
                params
            });

            if (response.data.success && response.data.data.data) {
                setChildren(response.data.data.data);
                setPagination(response.data.data.meta.pagination);
            } else {
                throw new Error('Ma\'lumotlar formati noto\'g\'ri');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChildren(currentPage, searchQuery);
    }, [currentPage]);

    // Search query o'zgarganda yangi ma'lumotlarni yuklash
    useEffect(() => {
        // Search bo'yicha qidirishni debounce qilish
        const timeoutId = setTimeout(() => {
            setCurrentPage(1); // Search bo'lganda 1-sahifaga qaytish
            fetchChildren(1, searchQuery);
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleView = (child: Child) => {
        setSelectedChild(child);
    };

    const handleBackToList = () => {
        setSelectedChild(null);
    };

    const handleEdit = (id: string) => {
        console.log('Edit child:', id);
        // Tahrirlash logikasi
    };

    const handleDeleteClick = (child: Child) => {
        setDeleteId(child.id);
        setDeleteName(`${child.firstname} ${child.lastname || ''}`);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;

        try {
            await axios.delete(`${baseUrl}/users/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    'Content-Type': 'application/json'
                }
            });

            toast.success('Bola muvaffaqiyatli o\'chirildi');
            setDeleteId(null);
            // O'chirilgandan so'ng ro'yxatni yangilash
            fetchChildren(currentPage, searchQuery);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'O\'chirishda xatolik yuz berdi');
        }
    };

    const handleAdd = () => {
        console.log('Add new child');
    };

    const handlePageChange = (page: number) => setCurrentPage(page);

    // Search inputni tozalash
    const handleClearSearch = () => {
        setSearchQuery('');
    };

    const getGenderIcon = (gender: string) => {
        return gender === 'MALE' ? <BoyIcon className="text-blue-500" /> : <GirlIcon className="text-pink-500" />;
    };

    const getGenderText = (gender: string) => {
        return gender === 'MALE' ? "O'g'il" : 'Qiz';
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('uz-UZ').replaceAll('/', '.');
    };

    const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    };

    const formatAmount = (amount: number) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

    // Agar bola tanlangan bo'lsa, faqat shu bolani ko'rsatish
    if (showDetailView) {
        return (
            <ChildDetail
                child={selectedChild}
                onBack={handleBackToList}
                onEdit={handleEdit}
            />
        );
    }

    // Asosiy ro'yxat ko'rinishi
    return (
        <div className="p-6">
            {/* Header with Search */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Bolalar</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Jami {pagination.count} ta bola | Sahifada {children.length} ta
                        {searchQuery && (
                            <span className="text-purple-600 ml-2">
                                ("{searchQuery}" bo'yicha qidiruv)
                            </span>
                        )}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full sm:w-64 pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        />
                        {searchQuery && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <ClearIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <CircularProgress sx={{ color: '#7C6BB3' }} />
                </div>
            ) : children.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-6xl mb-4">👶</div>
                    <p className="text-lg font-medium mb-2">
                        {searchQuery ? 'Qidiruv bo\'yicha bola topilmadi' : 'Bolalar topilmadi'}
                    </p>
                    <p className="text-sm">
                        {searchQuery ? 'Boshqa so\'zlar bilan qayta urinib ko\'ring' : 'Hech qanday bola mavjud emas'}
                    </p>
                    {searchQuery && (
                        <button
                            onClick={handleClearSearch}
                            className="mt-4 px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                        >
                            Qidiruvni tozalash
                        </button>
                    )}
                </div>
            ) : (
                <>
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
                                        Ota-Ona
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Jinsi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Yosh
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
                                                <div
                                                    className="h-10 w-10 rounded-full flex items-center justify-center"
                                                    style={{
                                                        background: child.photo ? 'transparent' : 'linear-gradient(135deg, #69569F, #8B7AB8)'
                                                    }}
                                                >
                                                    {child.photo ? (
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            src={getImageUrl(child.photo)}
                                                            alt={child.firstname}
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                                // Rasm yuklanmasa, default icon ko'rsatish
                                                                const parent = e.currentTarget.parentElement;
                                                                if (parent) {
                                                                    parent.innerHTML = `
                                                                        <div class="w-full h-full flex items-center justify-center" style="background: linear-gradient(135deg, #69569F, #8B7AB8); border-radius: 50%;">
                                                                            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                                                            </svg>
                                                                        </div>
                                                                    `;
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <PersonIcon className="text-white" sx={{ fontSize: 20 }} />
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {child.firstname} {child.lastname || ''}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {child.phone || 'Telefon yo\'q'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Parent Info */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {child.parent ? (
                                                    <>
                                                        {child.parent.firstname} {child.parent.lastname}
                                                    </>
                                                ) : (
                                                    <span className="text-gray-400">Ota-ona yo'q</span>
                                                )}
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

                                        {/* Age */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {calculateAge(child.birthDate)} yosh
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {formatDate(child.birthDate)}
                                            </div>
                                        </td>

                                        {/* Coin Balance */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                                                        🪙 {formatAmount(child.coinBalance)} coin
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Platform: {formatAmount(child.platformCoinBalance)} coin
                                                </div>
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                {/* View Button */}
                                                <button
                                                    onClick={() => handleView(child)}
                                                    className="p-1 rounded transition-colors"
                                                    title="Ko'rish"
                                                >
                                                    <VisibilityIcon sx={{ fontSize: 20 }} />
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDeleteClick(child)}
                                                    className="p-1 rounded transition-colors"
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
                    {pagination.pageCount > 1 && (
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
                                                    ? 'text-white from-[#69569F] to-[#8B7AB8] border border-[#69569F]'
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
                    )}
                </>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDeleteConfirm}
                childName={deleteName}
            />
        </div>
    );
}
