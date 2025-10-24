'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import { getAccessToken } from '@/utils/getToken';
import { Category } from '@/utils/type';
import CreateCategoryModal from '@/modals/categories/CreateCateogryModal';
import DeleteConfirmModal from '@/modals/categories/CategoryDeleteModal';
import toast from 'react-hot-toast';
import UpdateCategoryModal from '@/modals/categories/CategoryUpdateModal';

export default function CategoriesPage() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const [categories, setCategories] = useState<Category[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${baseUrl}/categories/admin`, {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
            });
            setCategories(res.data.data.data || []);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await axios.delete(`${baseUrl}/categories/${deleteId}`, {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
            });
            setCategories(prev => prev.filter(cat => cat.id !== deleteId));
            setDeleteId(null);
            toast.success("Kategoriya o'chirildi");
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
        }
    };

    const getUZTitle = (translations: any[]) =>
        translations.find(t => t.language === 'UZ')?.title || 'Nomalum';

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Kategoriyalar</h1>
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
                // 🔥 LOADING: Faqat loader ko'rinadi
                <div className="flex justify-center items-center h-64">
                    <CircularProgress sx={{ color: '#7C6BB3' }} />
                </div>
            ) : (
                // 🔥 CONTENT: Faqat ma'lumotlar ko'rinadi
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {categories.map(cat => (
                        <div key={cat.id} className="relative bg-white rounded-xl p-5 shadow-md">
                            <span className={`absolute top-2 left-2 px-2 py-1 text-xs rounded-full ${
                                cat.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-600'
                            }`}>
                                {cat.isActive ? 'Faol' : 'Nofaol'}
                            </span>

                            <div className="absolute top-2 right-2 flex gap-1">
                                <button onClick={() => setEditCategory(cat)} className="p-1 text-gray-600">
                                    <EditIcon sx={{ fontSize: 16 }} />
                                </button>
                                <button onClick={() => setDeleteId(cat.id)} className="p-1 text-gray-600">
                                    <DeleteIcon sx={{ fontSize: 16 }} />
                                </button>
                            </div>

                            <div className="flex flex-col items-center text-center mt-4">
                                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                    {cat.icon ? (
                                        <img
                                            src={`https://pub-c6b5ab8943d5481b8627979d8736fa97.r2.dev/${cat.icon}`}
                                            alt={getUZTitle(cat.translations)}
                                            className="w-full h-full object-contain rounded-full"
                                        />
                                    ) : (
                                        <span className="text-2xl">📚</span>
                                    )}
                                </div>
                                <h3 className="text-base font-semibold text-gray-800">
                                    {getUZTitle(cat.translations)}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <CreateCategoryModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSuccess={fetchData}
            />

            <DeleteConfirmModal
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
            />

            <UpdateCategoryModal
                open={!!editCategory}
                onClose={() => setEditCategory(null)}
                category={editCategory}
                onSuccess={fetchData}
            />
        </div>
    );
}
