'use client';

import React from 'react';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface PremiumPlanTranslation {
    id: string;
    language: string;
    title: string;
}

interface PremiumPlan {
    id: string;
    translations: PremiumPlanTranslation[];
}

interface Parent {
    id: string;
    photo: string;
    phone: string;
    firstname: string;
    lastname: string;
    remainingInvites: number;
    gender: "MALE" | "FEMALE";
    _count: {
        children: number;
    };
    premiumPlan: PremiumPlan;
    birthDate: string;
    premiumEnd: string;
    createdAt: string;
}

interface PaginationInfo {
    count: number;
    pageCount: number;
    pageNumber: number;
    pageSize: number;
}

interface ParentsResponse {
    statusCode: number;
    success: boolean;
    data: {
        data: Parent[];
        meta: {
            pagination: PaginationInfo;
        };
    };
}

interface DeleteConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    parentName: string;
}

function DeleteConfirmModal({ open, onClose, onConfirm, parentName }: DeleteConfirmModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg w-[300px] text-center" onClick={e => e.stopPropagation()}>
                <h2 className="text-lg font-semibold mb-4">
                    Rostdan ham <span className="font-bold">{parentName}</span> ni o'chirmoqchimisiz?
                </h2>
                <div className="flex justify-around gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                        Yo'q
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                        Ha
                    </button>
                </div>
            </div>
        </div>
    );
}

interface ParentDetailProps {
    parent: Parent;
    onBack: () => void;
}

export default function ParentDetail({ parent, onBack }: ParentDetailProps) {
    const imgUrl = process.env.NEXT_PUBLIC_IMG_URL || ''

    // Rasm URL ni to'g'ri formatga o'tkazish
    const getImageUrl = (photoPath: string | null): string => {
        if (!photoPath) return '';

        if (photoPath.startsWith('http')) return photoPath;

        if (photoPath.startsWith('/')) {
            return `${imgUrl}${photoPath}`;
        }

        return `${imgUrl}/${photoPath}`;
    };

    const getGenderIcon = (gender: string) => {
        return gender === 'MALE' ? <ManIcon className="text-blue-500" /> : <WomanIcon className="text-pink-500" />;
    };

    const getGenderText = (gender: string) => {
        return gender === 'MALE' ? 'Erkak' : 'Ayol';
    };

    const getPremiumPlanTitle = (premiumPlan: PremiumPlan, language: string = 'uz') => {
        const translation = premiumPlan.translations.find(t => t.language === language);
        return translation ? translation.title : 'Premium';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('uz-UZ');
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ArrowBackIcon />
                        <span>Orqaga</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Asosiy ma'lumotlar */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        {/* Rasm */}
                        <div className="">
                            <div
                                className="h-32 w-32 rounded-full flex items-center justify-center"
                                style={{
                                    background: parent.photo ? 'transparent' : 'linear-gradient(135deg, #69569F, #8B7AB8)'
                                }}
                            >
                                {parent.photo ? (
                                    <img
                                        className="h-32 w-32 rounded-full object-cover"
                                        src={getImageUrl(parent.photo)}
                                        alt={`${parent.firstname} ${parent.lastname}`}
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            const parent = e.currentTarget.parentElement;
                                            if (parent) {
                                                parent.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center" style="background: linear-gradient(135deg, #69569F, #8B7AB8); border-radius: 50%;">
                            <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                          </div>
                        `;
                                            }
                                        }}
                                    />
                                ) : (
                                    <PersonIcon className="text-white" sx={{ fontSize: 60 }} />
                                )}
                            </div>
                        </div>

                        {/* Ma'lumotlar */}
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                {parent.firstname} {parent.lastname}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        {getGenderIcon(parent.gender)}
                                        <span className="font-medium">Jinsi:</span>
                                    </div>
                                    <span className="text-gray-800">{getGenderText(parent.gender)}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <PhoneIcon className="text-gray-600" />
                                    <span className="font-medium text-gray-600">Telefon:</span>
                                    <span className="text-gray-800">{parent.phone}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <FamilyRestroomIcon className="text-gray-600" />
                                    <span className="font-medium text-gray-600">Farzandlar soni:</span>
                                    <span className="text-gray-800">{parent._count.children} ta</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-gray-600">Qolgan takliflar:</span>
                                    <span className="text-gray-800">{parent.remainingInvites} ta</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <CalendarTodayIcon className="text-gray-600" />
                                    <span className="font-medium text-gray-600">Tug'ilgan sana:</span>
                                    <span className="text-gray-800">{formatDate(parent.birthDate)}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <CalendarTodayIcon className="text-gray-600" />
                                    <span className="font-medium text-gray-600">Qo'shilgan sana:</span>
                                    <span className="text-gray-800">{formatDate(parent.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Premium reja ma'lumotlari */}
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Premium Reja</h3>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-purple-800 font-semibold">{getPremiumPlanTitle(parent.premiumPlan)}</div>
                                <div className="text-purple-600 text-sm">Aktiv premium reja</div>
                            </div>
                            <div className="text-purple-700">
                                Tugash: {formatDate(parent.premiumEnd)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
