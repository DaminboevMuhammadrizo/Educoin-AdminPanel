'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import { getAccessToken } from '@/utils/getToken';
import toast from 'react-hot-toast';
import CreateSubscriptionPlanModal from '@/modals/subscriptionPlans/CreateSubscriptionPlans';
import DeleteConfirmModal from '@/modals/categories/CategoryDeleteModal';
import UpdateSubscriptionPlanModal from '@/modals/subscriptionPlans/UpdateSubscriptionPlans';

interface Translation {
    id: string;
    title: string;
    language: string;
}

interface SubscriptionPlan {
    id: string;
    price: number;
    durationDays: number;
    maxChildren: number;
    maxMedia: number;
    maxGifts: number;
    maxReminders: number;
    maxTasks: number;
    freeAfterReferrals: number;
    psychologicalAdvice: boolean;
    taskRecommendations: boolean;
    createdAt: string;
    translations: Translation[];
    order: number;
}

interface ApiResponse {
    statusCode: number;
    success: boolean;
    data: SubscriptionPlan[];
}

export default function SubscriptionPlansPage() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [editPlan, setEditPlan] = useState<SubscriptionPlan | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get<ApiResponse>(`${baseUrl}/subscription-plans/admin`, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`
                },
            });

            if (response.data.success) {
                const sortedPlans = response.data.data.sort((a, b) => a.order - b.order);
                setPlans(sortedPlans);
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
        console.log(deleteId)
        if (!deleteId) return;
        try {
            await axios.delete(`${baseUrl}/subscription-plans/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`
                },
            });
            setPlans(prev => prev.filter(plan => plan.id !== deleteId));
            setDeleteId(null);
            toast.success("Obuna plani o'chirildi");
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
        }
    };
    const formatNumber = (num: number) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const getUZTitle = (translations: Translation[]) =>
        translations.find((t) => t.language === 'UZ')?.title || "Noma'lum";

    const getPlanColor = (price: number) => {
        if (price === 0) return 'from-green-500 to-green-600';
        if (price <= 50000) return 'from-blue-500 to-blue-600';
        if (price <= 120000) return 'from-purple-500 to-purple-600';
        return 'from-orange-500 to-orange-600';
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Obuna Planlari</h1>
                    {plans.length > 0 && (
                        <p className="text-gray-500 text-sm mt-1">
                            Jami {plans.length} ta plan | Tartib raqami bo'yicha saralangan
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {plans.map(plan => (
                        <div key={plan.id} className="relative bg-white rounded-xl p-5 shadow-md">
                            <span className="absolute top-2 left-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full font-bold">
                                #{plan.order}
                            </span>

                            <div className="absolute top-2 right-2 flex gap-1">
                                <button
                                    onClick={() => setEditPlan(plan)}
                                    className="p-1 text-gray-600 hover:bg-gray-100 rounded-md"
                                    title="Tahrirlash"
                                >
                                    <EditIcon sx={{ fontSize: 16 }} />
                                </button>
                                <button
                                    onClick={() => setDeleteId(plan.id)}
                                    className="p-1 text-gray-600 hover:bg-gray-100 rounded-md"
                                    title="O'chirish"
                                >
                                    <DeleteIcon sx={{ fontSize: 16 }} />
                                </button>
                            </div>

                            <div className="flex flex-col items-center text-center mt-2">
                                {/* Plan icon */}
                                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                    <div className={`${getPlanColor(plan.price).replace('from-', 'text-').split(' ')[0]} font-bold text-lg`}>
                                        {plan.price === 0 ? '🆓' : '💎'}
                                    </div>
                                </div>

                                {/* Plan title */}
                                <h3 className="text-base font-semibold text-gray-800 mb-2">
                                    {getUZTitle(plan.translations)}
                                </h3>

                                {/* Price and duration */}
                                <div className="text-center mb-3">
                                    <div className="text-lg font-bold text-gray-900">
                                        {plan.price === 0 ? 'Bepul' : `${formatNumber(plan.price)} so'm`}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {plan.durationDays} kun
                                    </div>
                                </div>

                                {/* Plan limits */}
                                <div className="w-full mb-3">
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="text-center p-1 bg-gray-50 rounded">
                                            <div className="font-semibold">{plan.maxChildren}</div>
                                            <div className="text-gray-500">Farzand</div>
                                        </div>
                                        <div className="text-center p-1 bg-gray-50 rounded">
                                            <div className="font-semibold">{plan.maxMedia}</div>
                                            <div className="text-gray-500">Media</div>
                                        </div>
                                        <div className="text-center p-1 bg-gray-50 rounded">
                                            <div className="font-semibold">{plan.maxGifts}</div>
                                            <div className="text-gray-500">Sovg'a</div>
                                        </div>
                                        <div className="text-center p-1 bg-gray-50 rounded">
                                            <div className="font-semibold">{plan.maxTasks}</div>
                                            <div className="text-gray-500">Vazifa</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="w-full space-y-1 mb-3">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-600">Psixologik maslahat</span>
                                        {plan.psychologicalAdvice ? (
                                            <CheckIcon sx={{ fontSize: 14, color: 'green' }} />
                                        ) : (
                                            <CloseIcon sx={{ fontSize: 14, color: 'red' }} />
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-600">Vazifa tavsiyalari</span>
                                        {plan.taskRecommendations ? (
                                            <CheckIcon sx={{ fontSize: 14, color: 'green' }} />
                                        ) : (
                                            <CloseIcon sx={{ fontSize: 14, color: 'red' }} />
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-600">Bepul takliflar</span>
                                        <span className="font-semibold">{plan.freeAfterReferrals} ta</span>
                                    </div>
                                </div>

                                {/* Date */}
                                <p className="text-xs text-gray-400">
                                    {new Date(plan.createdAt).toLocaleDateString('uz-UZ')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modallar */}
            <CreateSubscriptionPlanModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSuccess={fetchData}
            />

            <DeleteConfirmModal
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
            />

            <UpdateSubscriptionPlanModal
                open={!!editPlan}
                onClose={() => setEditPlan(null)}
                plan={editPlan}
                onSuccess={fetchData}
            />
        </div>
    );
}
