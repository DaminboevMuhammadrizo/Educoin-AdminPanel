'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from '@/utils/getToken';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import toast from 'react-hot-toast';
import CreatePlatformGiftModal from '@/modals/platformGifts/CreatePlatformGifts';
import DeleteConfirmModal from '@/modals/categories/CategoryDeleteModal';
import UpdatePlatformGiftModal from '@/modals/platformGifts/updatePlatformGifts';

interface Translation {
    id: string;
    title: string;
    miniDescription: string;
    description: string;
    language: string;
}

interface CreatedBy {
    id: string;
    firstname: string;
    lastname: string;
}

interface Category {
    id: string;
    translations: { language: string; title: string }[];
}

interface Gift {
    id: string;
    photo: string;
    count: number;
    amount: number;
    categoryId: string;
    translations: Translation[];
    createdBy: CreatedBy;
    createdAt: string;
}

export default function PlatformGiftsPage() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const imgUrl = process.env.NEXT_PUBLIC_IMG_URL;

    const [gifts, setGifts] = useState<Gift[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [editGift, setEditGift] = useState<Gift | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [hovered, setHovered] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    const getImageUrl = (photoPath: string): string => {
        if (!photoPath) return '';
        if (photoPath.startsWith('http')) return photoPath;
        return photoPath.startsWith('/') ? `${imgUrl}${photoPath}` : `${imgUrl}/${photoPath}`;
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${baseUrl}/categories/admin`, {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
            });
            if (response.data.success) {
                setCategories(response.data.data.data);
            }
        } catch (err) {
            console.error('Categories fetch error:', err);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const params: any = {};
            if (selectedCategory) params.categoryId = selectedCategory;

            const response = await axios.get(`${baseUrl}/platform-gifts/admin`, {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
                params,
            });

            if (response.data.success) {
                setGifts(response.data.data.data);
                setPagination(response.data.data.meta.pagination);
            } else {
                toast.error('Maʼlumotlarni yuklashda xatolik');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchData();
    }, [selectedCategory]);

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await axios.delete(`${baseUrl}/platform-gifts/${deleteId}`, {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
            });
            setGifts(prev => prev.filter(gift => gift.id !== deleteId));
            setDeleteId(null);
            toast.success("Sovg'a o'chirildi");
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
        }
    };

    const getUZTitle = (translations: Translation[]) => {
        const title = translations.find((t) => t.language === 'UZ')?.title || "Noma'lum";
        return title.length > 32 ? title.substring(0, 32).trim() + '...' : title;
    };

    const getUZMiniDesc = (translations: Translation[]) => {
        const desc = translations.find((t) => t.language === 'UZ')?.miniDescription || "Tavsif yo'q";
        return desc.length > 50 ? desc.substring(0, 50).trim() + '...' : desc;
    };

    const getCategoryName = (categoryId: string) => {
        const category = categories.find(c => c.id === categoryId);
        return category?.translations.find(t => t.language === 'UZ')?.title || 'Kategoriya';
    };

    const formatNumber = (num: number) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Platform Sovg'alari</h1>
                    {pagination && (
                        <p className="text-gray-500 text-sm mt-1">
                            Jami {pagination.count} ta sovg'a | Sahifada {gifts.length} ta
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-900 min-w-[200px]"
                    >
                        <option value="">Barcha kategoriyalar</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.translations.find(t => t.language === 'UZ')?.title}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => setOpenModal(true)}
                        className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg"
                        style={{ background: 'linear-gradient(135deg, #69569F, #8B7AB8)' }}
                    >
                        <AddIcon sx={{ fontSize: 20 }} />
                        <span>Qo'shish</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <CircularProgress sx={{ color: '#7C6BB3' }} />
                </div>
            ) : gifts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <p className="text-lg">Sovg'alar topilmadi</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {gifts.map((gift) => (
                            <div
                                key={gift.id}
                                onMouseEnter={() => setHovered(gift.id)}
                                onMouseLeave={() => setHovered(null)}
                                className="relative bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all overflow-hidden"
                            >
                                {hovered === gift.id && (
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        <button
                                            onClick={() => setEditGift(gift)}
                                            className="p-1 text-gray-600 hover:bg-gray-100 rounded-md"
                                        >
                                            <EditIcon sx={{ fontSize: 16 }} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(gift.id)}
                                            className="p-1 text-gray-600 hover:bg-gray-100 rounded-md"
                                        >
                                            <DeleteIcon sx={{ fontSize: 16 }} />
                                        </button>
                                    </div>
                                )}

                                <div className="flex flex-col items-center text-center mt-2">
                                    <div
                                        className="w-14 h-14 rounded-full flex items-center justify-center mb-3 overflow-hidden transition-all"
                                        style={{
                                            background: hovered === gift.id
                                                ? 'linear-gradient(135deg, #69569F, #8B7AB8)'
                                                : '#f3f4f6'
                                        }}
                                    >
                                        {gift.photo ? (
                                            <img
                                                src={getImageUrl(gift.photo)}
                                                alt={getUZTitle(gift.translations)}
                                                className="w-8 h-8 object-contain"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    const parent = e.currentTarget.parentElement;
                                                    if (parent) {
                                                        const fallback = document.createElement('span');
                                                        fallback.className = 'text-2xl';
                                                        fallback.textContent = '🎁';
                                                        parent.appendChild(fallback);
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <span className="text-2xl">🎁</span>
                                        )}
                                    </div>

                                    <h3 className="text-base font-semibold text-gray-800 mb-1 w-full">
                                        {getUZTitle(gift.translations)}
                                    </h3>

                                    <p className="text-xs text-gray-600 mb-2 w-full">
                                        {getUZMiniDesc(gift.translations)}
                                    </p>

                                    <div className="w-full space-y-1 mb-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-500">Category:</span>
                                            <span className="text-purple-700 font-medium">{getCategoryName(gift.categoryId)}</span>
                                        </div>

                                        {gift.amount > 0 && (
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-500">Narxi:</span>
                                                <span className="font-medium text-purple-600">{formatNumber(gift.amount)} coin</span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-500">Soni:</span>
                                            <span className="font-medium">{formatNumber(gift.count)} ta</span>
                                        </div>

                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-500">Yaratdi:</span>
                                            <span className="font-medium">{gift.createdBy.firstname} {gift.createdBy.lastname}</span>
                                        </div>

                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-500">Sana:</span>
                                            <span className="font-medium">{new Date(gift.createdAt).toLocaleDateString('uz-UZ')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {pagination && (
                        <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
                            <span>
                                Sahifa {pagination.pageNumber} / {pagination.pageCount}
                            </span>
                        </div>
                    )}
                </>
            )}

            <CreatePlatformGiftModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSuccess={fetchData}
            />

            <UpdatePlatformGiftModal
                open={!!editGift}
                onClose={() => setEditGift(null)}
                onSuccess={fetchData}
                platformGift={editGift}
            />

            <DeleteConfirmModal
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                message="Rostdan ham bu sovg'ani o'chirmoqchimisiz?"
            />
        </div>
    );
}
