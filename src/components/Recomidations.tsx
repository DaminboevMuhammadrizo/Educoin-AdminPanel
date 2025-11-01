'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from '@/utils/getToken';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import toast from 'react-hot-toast';
import CreateRecommendationModal from '@/modals/recomidations/CreateRecomidation';
import UpdateRecommendationModal from '@/modals/recomidations/UpdateRecommendationModal';
import DeleteConfirmModal from '@/modals/categories/CategoryDeleteModal';

interface Translation {
    language: string;
    title: string;
    description: string;
}

interface Recommendation {
    id: string;
    character: string;
    fromYear: number;
    toYear: number;
    isActive: boolean;
    photo: string;
    translations: Translation[];
    createdAt: string;
}

interface ApiResponse {
    statusCode: number;
    success: boolean;
    data: {
        data: Recommendation[];
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

export default function RecommendationsPage() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [editRecommendation, setEditRecommendation] = useState<Recommendation | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get<ApiResponse>(`${baseUrl}/recommendations/admin`, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`
                },
            });

            if (response.data.success) {
                setRecommendations(response.data.data.data);
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
        fetchData();
    }, []);

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await axios.delete(`${baseUrl}/recommendations/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`
                },
            });
            setRecommendations(prev => prev.filter(rec => rec.id !== deleteId));
            setDeleteId(null);
            toast.success("Tavsiya o'chirildi");
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
        }
    };

    const getUZTitle = (translations: Translation[]) =>
        translations.find((t) => t.language === 'UZ')?.title || "Noma'lum";

    const getUZDescription = (translations: Translation[]) =>
        translations.find((t) => t.language === 'UZ')?.description || "Tavsif mavjud emas";

    // Title uchun truncate funksiyasi (max 32 belgi)
    const truncateTitle = (text: string, maxLength: number = 32) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    };

    // Description uchun truncate funksiyasi (max 100 belgi - cardga mos)
    const truncateDescription = (text: string, maxLength: number = 100) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    };

    const getAgeRange = (fromYear: number, toYear: number) => {
        if (fromYear === 0 && toYear === 0) return "Barcha yoshlar";
        return `${fromYear}-${toYear} yosh`;
    };

    const handlePageChange = (page: number) => {
        console.log('Page changed to:', page);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Tavsiyalar</h1>
                    {pagination && (
                        <p className="text-gray-500 text-sm mt-1">
                            Jami {pagination.count} ta tavsiya | Sahifada {recommendations.length} ta
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
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {recommendations.map(rec => (
                            <div key={rec.id} className="relative bg-white rounded-xl p-5 shadow-md overflow-hidden">
                                {/* Status badge */}
                                <span className={`absolute top-2 left-2 px-2 py-1 text-xs rounded-full ${rec.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-600'
                                    }`}>
                                    {rec.isActive ? 'Faol' : 'Nofaol'}
                                </span>

                                {/* Edit/Delete buttons */}
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <button
                                        onClick={() => setEditRecommendation(rec)}
                                        className="p-1 text-gray-600 hover:bg-gray-100 rounded-md"
                                        title="Tahrirlash"
                                    >
                                        <EditIcon sx={{ fontSize: 16 }} />
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(rec.id)}
                                        className="p-1 text-gray-600 hover:bg-gray-100 rounded-md"
                                        title="O'chirish"
                                    >
                                        <DeleteIcon sx={{ fontSize: 16 }} />
                                    </button>
                                </div>

                                <div className="flex flex-col items-center text-center mt-8">
                                    {/* Photo */}
                                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3 flex-shrink-0">
                                        {rec.photo ? (
                                            <img
                                                src={rec.photo}
                                                alt={getUZTitle(rec.translations)}
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <span className="text-2xl text-gray-400">
                                                📚
                                            </span>
                                        )}
                                    </div>

                                    {/* Title - 32 belgi limit bilan ... */}
                                    <h3
                                        className="text-base font-semibold text-gray-800 mb-2 w-full "
                                        title={getUZTitle(rec.translations)}
                                    >
                                        {truncateTitle(getUZTitle(rec.translations), 32)}
                                    </h3>

                                    {/* Description - 100 belgi limit bilan ... */}
                                    <p
                                        className="text-xs text-gray-600 mb-2 w-full"
                                        title={getUZDescription(rec.translations)}
                                    >
                                        {truncateDescription(getUZDescription(rec.translations), 100)}
                                    </p>

                                    {/* Statistics */}
                                    <div className="w-full space-y-1 mb-3">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-600">Xarakter:</span>
                                            <span className="font-semibold text-purple-600">{rec.character}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-600">Yosh oralig'i:</span>
                                            <span className="font-semibold">{getAgeRange(rec.fromYear, rec.toYear)}</span>
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <p className="text-xs text-gray-400">
                                        {new Date(rec.createdAt).toLocaleDateString('uz-UZ')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && (
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
                    )}
                </>
            )}

            {/* Modallar */}
            <CreateRecommendationModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSuccess={fetchData}
            />

            <UpdateRecommendationModal
                open={!!editRecommendation}
                onClose={() => setEditRecommendation(null)}
                recommendation={editRecommendation}
                onSuccess={fetchData}
            />

            <DeleteConfirmModal
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                message="Rostdan ham bu tavsiyani o'chirmoqchimisiz?"
            />
        </div>
    );
}
