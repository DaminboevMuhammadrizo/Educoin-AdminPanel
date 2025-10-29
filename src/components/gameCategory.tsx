'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import { getAccessToken } from '@/utils/getToken';
import toast from 'react-hot-toast';
import CreateGameCategoryModal from '@/modals/game-Category/CreateGameCategoryModal';
import UpdateGameCategoryModal from '@/modals/game-Category/UpdateGameCategory';

interface Translation {
    language: string;
    title: string;
}

interface GameCategory {
    id: string;
    photo: string;
    translations: Translation[];
    createdAt: string;
}

interface ApiResponse {
    statusCode: number;
    success: boolean;
    data: {
        data: GameCategory[];
        meta: {
            pagination: {
                count: number;
                pageCount: number;
                pageNumber: number;
                pageSize: number;
            };
        };
    };
}

export default function GameCategoriesPage() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const imgUrl = process.env.NEXT_PUBLIC_IMG_URL;

    const [categories, setCategories] = useState<GameCategory[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [editCategory, setEditCategory] = useState<GameCategory | null>(null);

    const getImageUrl = (photoPath: string): string => {
        if (!photoPath) return '';

        if (photoPath.startsWith('http')) return photoPath;

        if (photoPath.startsWith('/')) {
            return `${imgUrl}${photoPath}`;
        }

        return `${imgUrl}/${photoPath}`;
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get<ApiResponse>(`${baseUrl}/word-categories/admin`, {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
            });

            if (response.data.success) {
                setCategories(response.data.data.data);
                setPagination(response.data.data.meta.pagination);
            } else {
                toast.error('Maʼlumotlarni yuklashda xatolik');
            }
        } catch (err: any) {
            console.log(err.response)
            toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await axios.delete(`${baseUrl}/word-categories/${deleteId}`, {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
            });
            setCategories(prev => prev.filter(cat => cat.id !== deleteId));
            setDeleteId(null);
            toast.success("Kategoriya o'chirildi");
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
        }
    };

    const getUZTitle = (translations: Translation[]) =>
        translations.find((t) => t.language === 'UZ')?.title || "Noma'lum";

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('uz-UZ');
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Oʻyin Kategoriyalari</h1>
                    {pagination && (
                        <p className="text-gray-500 text-sm mt-1">
                            Jami {pagination.count} ta kategoriya | Sahifada {categories.length} ta
                        </p>
                    )}
                </div>
                <button
                    onClick={() => setOpenModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg"
                    style={{ background: 'linear-gradient(135deg, #69569F, #8B7AB8)' }}
                >
                    <AddIcon sx={{ fontSize: 20 }} />
                    <span>Qo'shish</span>
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <CircularProgress sx={{ color: '#7C6BB3' }} />
                </div>
            ) : categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <p className="text-lg">Kategoriyalar topilmadi</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {categories.map((category) => (
                            <div key={category.id} className="relative bg-white rounded-xl p-5 shadow-md">
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <button
                                        onClick={() => setEditCategory(category)}
                                        className="p-1 text-gray-600 hover:bg-gray-100 rounded-md"
                                    >
                                        <EditIcon sx={{ fontSize: 16 }} />
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(category.id)}
                                        className="p-1 text-gray-600 hover:bg-gray-100 rounded-md"
                                    >
                                        <DeleteIcon sx={{ fontSize: 16 }} />
                                    </button>
                                </div>

                                <div className="flex flex-col items-center text-center mt-2">
                                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3 overflow-hidden">
                                        {category.photo ? (
                                            <img
                                                src={getImageUrl(category.photo)}
                                                alt={getUZTitle(category.translations)}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : null}
                                        <div className={`w-full h-full flex items-center justify-center ${category.photo ? 'hidden' : 'flex'}`}>
                                            <span className="text-2xl">🎮</span>
                                        </div>
                                    </div>

                                    <h3 className="text-base font-semibold text-gray-800 mb-2">
                                        {getUZTitle(category.translations)}
                                    </h3>

                                    <p className="text-xs text-gray-400">
                                        {formatDate(category.createdAt)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {pagination && (
                        <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
                            <span>
                                Sahifa {pagination.pageNumber} / {pagination.pageCount} | Jami: {pagination.count} ta
                            </span>
                        </div>
                    )}
                </>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                        <h3 className="text-lg font-semibold mb-4">Kategoriyani o'chirish</h3>
                        <p className="text-gray-600 mb-6">Rostan ham bu kategoriyani o'chirmoqchimisiz?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                O'chirish
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            <CreateGameCategoryModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSuccess={fetchData}
            />

            {/* Update Modal */}
            <UpdateGameCategoryModal
                open={!!editCategory}
                onClose={() => setEditCategory(null)}
                onSuccess={fetchData}
                category={editCategory}
            />
        </div>
    );
}
