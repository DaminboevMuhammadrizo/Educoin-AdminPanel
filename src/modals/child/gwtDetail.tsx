'use client';

import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import BoyIcon from '@mui/icons-material/Boy';
import GirlIcon from '@mui/icons-material/Girl';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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

interface ChildDetailProps {
    child: Child;
    onBack: () => void;
    onEdit: (id: string) => void;
}

export default function ChildDetail({ child, onBack, onEdit }: ChildDetailProps) {
    const imgUrl = process.env.NEXT_PUBLIC_IMG_URL;

    const getImageUrl = (photoPath: string | null): string => {
        if (!photoPath) return '';
        if (photoPath.startsWith('http')) return photoPath;
        return photoPath.startsWith('/') ? `${imgUrl}${photoPath}` : `${imgUrl}/${photoPath}`;
    };

    const getGenderIcon = (gender: string) => {
        return gender === 'MALE' ? <BoyIcon className="text-blue-500" /> : <GirlIcon className="text-pink-500" />;
    };

    const getGenderText = (gender: string) => {
        return gender === 'MALE' ? "O'g'il" : 'Qiz';
    };

    const getCharacterText = (character: string | null) => {
        if (!character) return 'Aniqlanmagan';
        const characters: { [key: string]: string } = {
            'HAPPY': 'Baxtli',
            'SAD': 'Gamgin',
            'ANGRY': 'Jahli chiqqan',
            'CALM': 'Sokin',
            'ENERGETIC': 'Energik',
            'SHY': 'Uyatchan'
        };
        return characters[character] || character;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('uz-UZ');
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

    return (
        <div className="p-6">
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
                <button
                    onClick={() => onEdit(child.id)}
                    className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg shadow hover:shadow-md transition-all"
                    style={{ background: 'linear-gradient(135deg, #69569F, #8B7AB8)' }}
                >
                    <EditIcon sx={{ fontSize: 20 }} />
                    <span>Tahrirlash</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <div className="">
                            <div
                                className="h-32 w-32 rounded-full flex items-center justify-center"
                                style={{
                                    background: child.photo ? 'transparent' : 'linear-gradient(135deg, #69569F, #8B7AB8)'
                                }}
                            >
                                {child.photo ? (
                                    <img
                                        className="h-32 w-32 rounded-full object-cover"
                                        src={getImageUrl(child.photo)}
                                        alt={child.firstname}
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

                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                {child.firstname} {child.lastname || ''}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        {getGenderIcon(child.gender)}
                                        <span className="font-medium">Jinsi:</span>
                                    </div>
                                    <span className="text-gray-800">{getGenderText(child.gender)}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-gray-600">Telefon:</span>
                                    <span className="text-gray-800">{child.phone || 'Mavjud emas'}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-gray-600">Tug'ilgan sana:</span>
                                    <span className="text-gray-800">{formatDate(child.birthDate)}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-gray-600">Yosh:</span>
                                    <span className="text-gray-800">{calculateAge(child.birthDate)} yosh</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-gray-600">Qo'shilgan sana:</span>
                                    <span className="text-gray-800">{formatDate(child.createdAt)}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-gray-600">Xarakter:</span>
                                    <span className="text-gray-800">{getCharacterText(child.character)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Coin Balanslari</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-yellow-800 font-semibold">Shaxsiy Coin</div>
                                    <div className="text-yellow-600 text-sm">Bola hisobidagi coinlar</div>
                                </div>
                                <div className="text-2xl font-bold text-yellow-700">
                                    🪙 {formatAmount(child.coinBalance)}
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-blue-800 font-semibold">Platforma Coin</div>
                                    <div className="text-blue-600 text-sm">Platforma hisobidagi coinlar</div>
                                </div>
                                <div className="text-2xl font-bold text-blue-700">
                                    🪙 {formatAmount(child.platformCoinBalance)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {child.parent && (
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ota-Ona Ma'lumotlari</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-4">
                                {child.parent.photo && (
                                    <img
                                        className="h-16 w-16 rounded-full object-cover"
                                        src={getImageUrl(child.parent.photo)}
                                        alt={child.parent.firstname}
                                    />
                                )}
                                <div>
                                    <div className="text-lg font-medium text-gray-900">
                                        {child.parent.firstname} {child.parent.lastname}
                                    </div>
                                    <div className="text-gray-600 mt-1">
                                        {child.parent.phone}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
