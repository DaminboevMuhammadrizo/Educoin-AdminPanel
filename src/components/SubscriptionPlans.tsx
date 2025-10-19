'use client';

import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

// Mock API data - yangi struktura
const mockSubscriptionPlans = {
    statusCode: 200,
    success: true,
    data: [
        {
            id: "1",
            price: 0,
            durationDays: 30,
            maxChildren: 1,
            maxMedia: 10,
            maxGifts: 5,
            maxReminders: 3,
            maxTasks: 10,
            freeAfterReferrals: 10,
            psychologicalAdvice: false,
            taskRecommendations: false,
            createdAt: "2025-01-15T10:30:00.000Z",
            translations: [
                {
                    language: "UZ",
                    title: "Bepul Plan"
                }
            ]
        },
        {
            id: "2",
            price: 50000,
            durationDays: 90,
            maxChildren: 3,
            maxMedia: 50,
            maxGifts: 20,
            maxReminders: 10,
            maxTasks: 30,
            freeAfterReferrals: 5,
            psychologicalAdvice: true,
            taskRecommendations: false,
            createdAt: "2025-01-16T11:20:00.000Z",
            translations: [
                {
                    language: "UZ",
                    title: "Standart Plan"
                }
            ]
        },
        {
            id: "3",
            price: 120000,
            durationDays: 180,
            maxChildren: 5,
            maxMedia: 100,
            maxGifts: 50,
            maxReminders: 20,
            maxTasks: 50,
            freeAfterReferrals: 3,
            psychologicalAdvice: true,
            taskRecommendations: true,
            createdAt: "2025-01-17T09:15:00.000Z",
            translations: [
                {
                    language: "UZ",
                    title: "Premium Plan"
                }
            ]
        },
        {
            id: "4",
            price: 200000,
            durationDays: 365,
            maxChildren: 10,
            maxMedia: 500,
            maxGifts: 100,
            maxReminders: 50,
            maxTasks: 100,
            freeAfterReferrals: 2,
            psychologicalAdvice: true,
            taskRecommendations: true,
            createdAt: "2025-01-18T14:45:00.000Z",
            translations: [
                {
                    language: "UZ",
                    title: "Family Plan"
                }
            ]
        }
    ]
};

export default function SubscriptionPlansPage() {
    const [hovered, setHovered] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const plans = mockSubscriptionPlans.data;

    // Client-side format funksiyasi
    const formatDate = (date: string) => {
        if (!isClient) return '';
        return new Date(date).toLocaleDateString('uz-UZ').replaceAll('/', '.');
    };

    // Format number with commas
    const formatNumber = (num: number) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // Title ni olish
    const getUZTitle = (translations: any[]) =>
        translations.find((t) => t.language === 'UZ')?.title || "Noma'lum";

    const handleEdit = (id: string) => console.log('Edit:', id);
    const handleDelete = (id: string) => console.log('Delete:', id);
    const handleAdd = () => console.log('Add new plan');
    const handleSelect = (id: string) => console.log('Select plan:', id);

    const getPlanColor = (price: number) => {
        if (price === 0) return 'from-green-500 to-green-600';
        if (price <= 50000) return 'from-blue-500 to-blue-600';
        if (price <= 120000) return 'from-purple-500 to-purple-600';
        return 'from-orange-500 to-orange-600';
    };

    return (
        <div className="p-4">
            {/* Header - boshqa componentlar bilan bir xil */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Obuna Planlari</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Jami {plans.length} ta plan
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

            {/* Subscription Plans Grid - boshqa componentlar bilan bir xil layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        onMouseEnter={() => setHovered(plan.id)}
                        onMouseLeave={() => setHovered(null)}
                        className="relative bg-white rounded-xl p-5 shadow-md hover:shadow-md transition-all"
                    >
                        {/* Hover buttons - bir xil */}
                        {hovered === plan.id && (
                            <div className="absolute top-2 right-2 flex gap-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(plan.id);
                                    }}
                                    className="p-1 text-gray-600 rounded-md hover:bg-gray-100"
                                    title="Tahrirlash"
                                >
                                    <EditIcon sx={{ fontSize: 16 }} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(plan.id);
                                    }}
                                    className="p-1 text-gray-600 rounded-md hover:bg-gray-100"
                                    title="O'chirish"
                                >
                                    <DeleteIcon sx={{ fontSize: 16 }} />
                                </button>
                            </div>
                        )}

                        {/* Content - bir xil struktur */}
                        <div className="flex flex-col items-center text-center">
                            {/* Plan icon */}
                            <div
                                className="w-14 h-14 rounded-full flex items-center justify-center mb-3 overflow-hidden transition-all"
                                style={{
                                    background:
                                        hovered === plan.id
                                            ? 'linear-gradient(135deg, #69569F, #8B7AB8)'
                                            : '#f3f4f6',
                                }}
                            >
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
                            <p className="text-xs text-gray-400 mt-2">
                                {formatDate(plan.createdAt)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
