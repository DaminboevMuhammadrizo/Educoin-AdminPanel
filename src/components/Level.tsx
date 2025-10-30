'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import { getAccessToken } from '@/utils/getToken';
import toast from 'react-hot-toast';
import CreateLevelModal from '../modals/levels/CreateModal'
import UpdateLevelModal from '@/modals/levels/UpdatedModal';

interface Translation {
    id: string;
    title: string;
    description: string;
    subTitle: string;
    language: string;
}

interface Level {
    id: string;
    order: number;
    coins: number;
    color: string;
    translations: Translation[];
    createdAt: string;
}

interface ApiResponse {
    statusCode: number;
    success: boolean;
    data: {
        data: Level[];
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

export default function LevelsPage() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const [levels, setLevels] = useState<Level[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [editLevel, setEditLevel] = useState<Level | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get<ApiResponse>(`${baseUrl}/levels/admin`, {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
            });

            if (response.data.success) {
                setLevels(response.data.data.data);
                setPagination(response.data.data.meta.pagination);
            } else {
                toast.error('Maʼlumotlarni yuklashda xatolik');
            }
        } catch (err: any) {
            console.log(err.response);
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
            await axios.delete(`${baseUrl}/levels/${deleteId}`, {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
            });
            setLevels(prev => prev.filter(level => level.id !== deleteId));
            setDeleteId(null);
            toast.success("Daraja o'chirildi");
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
        }
    };

    const getUZTranslation = (translations: Translation[]) =>
        translations.find((t) => t.language === 'UZ') || translations[0];

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('uz-UZ');
    };

    // Yangi: Hex rangni to'liq formatga o'tkazish
    const getFullColor = (color: string) => {
        // Agar # bo'lsa olib tashlaymiz, yo'q bo'lsa o'zini qaytaramiz
        const cleanColor = color.startsWith('#') ? color.slice(1) : color;
        return `#${cleanColor}`;
    };

    const getColorName = (color: string) => {
        const colorMap: { [key: string]: string } = {
            'FF0000': 'Qizil',
            '0000FF': 'Koʻk',
            '008000': 'Yashil',
            'FFFF00': 'Sariq',
            '800080': 'Binafsha',
            'FFC0CB': 'Pushti',
            '4B0082': 'Indigo',
            '008080': 'Moviy-yashil',
            'FFA500': 'Olovrang',
            '808080': 'Kulrang',
        };

        const cleanColor = color.startsWith('#') ? color.slice(1) : color;
        return colorMap[cleanColor.toUpperCase()] || cleanColor;
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Darajalar</h1>
                    {pagination && (
                        <p className="text-gray-500 text-sm mt-1">
                            Jami {pagination.count} ta daraja | Sahifada {levels.length} ta
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
            ) : levels.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <p className="text-lg">Darajalar topilmadi</p>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Tartib
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Nomi
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Tavsif
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Sub Title
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Coinlar
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Rang
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Sana
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Harakatlar
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {levels.map((level) => {
                                        const uzTranslation = getUZTranslation(level.translations);
                                        const fullColor = getFullColor(level.color);

                                        return (
                                            <tr key={level.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div
                                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                                                        style={{ backgroundColor: fullColor }}
                                                    >
                                                        {level.order}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {uzTranslation.title}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-600 max-w-xs truncate">
                                                        {uzTranslation.description}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-500">
                                                        {uzTranslation.subTitle}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                                        <span>{level.coins}</span>
                                                        <span className="text-yellow-500">🪙</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-4 h-4 rounded-full border border-gray-300"
                                                            style={{ backgroundColor: fullColor }}
                                                        ></div>
                                                        <span className="text-sm text-gray-600">
                                                            {getColorName(level.color)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(level.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setEditLevel(level)}
                                                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Tahrirlash"
                                                        >
                                                            <EditIcon sx={{ fontSize: 18 }} />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteId(level.id)}
                                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="O'chirish"
                                                        >
                                                            <DeleteIcon sx={{ fontSize: 18 }} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
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
                        <h3 className="text-lg font-semibold mb-4">Darajani o'chirish</h3>
                        <p className="text-gray-600 mb-6">Rostan ham bu darajani o'chirmoqchimisiz?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                O'chirish
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <CreateLevelModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSuccess={fetchData}
            />

            <UpdateLevelModal
                open={!!editLevel}
                onClose={() => setEditLevel(null)}
                onSuccess={fetchData}
                level={editLevel}
            />
        </div>
    );
}
