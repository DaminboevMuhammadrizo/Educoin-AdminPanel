'use client';

import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { getAccessToken } from '@/utils/getToken';
import toast from 'react-hot-toast';

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

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    category: GameCategory | null;
}

export default function UpdateGameCategoryModal({ open, onClose, onSuccess, category }: Props) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const imgUrl = process.env.NEXT_PUBLIC_IMG_URL;

    const [translations, setTranslations] = useState<Translation[]>([
        { language: 'UZ', title: '' },
        { language: 'EN', title: '' },
        { language: 'RU', title: '' }
    ]);
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && category) {
            const uzTranslation = category.translations.find(t => t.language === 'UZ');
            const enTranslation = category.translations.find(t => t.language === 'EN');
            const ruTranslation = category.translations.find(t => t.language === 'RU');

            setTranslations([
                { language: 'UZ', title: uzTranslation?.title || '' },
                { language: 'EN', title: enTranslation?.title || '' },
                { language: 'RU', title: ruTranslation?.title || '' }
            ]);

            // Rasmni tekshirish - agar mavjud bo'lsa preview qilish
            if (category.photo && category.photo.trim() !== '') {
                const fullPhotoUrl = category.photo.startsWith('http')
                    ? category.photo
                    : `${imgUrl}/${category.photo}`;

                // Rasm mavjudligini tekshirish
                checkImageExists(fullPhotoUrl);
            } else {
                setPhotoPreview('');
            }
        } else if (!open) {
            // Formani tozalash
            setTranslations([
                { language: 'UZ', title: '' },
                { language: 'EN', title: '' },
                { language: 'RU', title: '' }
            ]);
            setPhoto(null);
            setPhotoPreview('');
        }
    }, [open, category, imgUrl]);

    // Rasm mavjudligini tekshirish funksiyasi
    const checkImageExists = (url: string) => {
        const img = new Image();
        img.onload = () => {
            setPhotoPreview(url);
        };
        img.onerror = () => {
            setPhotoPreview(''); // Rasm mavjud emas
        };
        img.src = url;
    };

    const handleTranslationChange = (language: string, value: string) => {
        if (value.length <= 32) {
            setTranslations(prev =>
                prev.map(t =>
                    t.language === language ? { ...t, title: value } : t
                )
            );
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Fayl hajmini tekshirish (1MB limit)
            const maxSize = 1 * 1024 * 1024; // 1MB
            if (file.size > maxSize) {
                toast.error(`Fayl hajmi 1MB dan katta! Sizning faylingiz: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
                return;
            }

            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!category?.id) {
            toast.error('Kategoriya topilmadi!');
            return;
        }

        const emptyTranslation = translations.find(t => !t.title.trim());
        if (emptyTranslation) {
            toast.error(`Iltimos, ${emptyTranslation.language} tilidagi kategoriya nomini kiriting!`);
            return;
        }

        if (!photo) {
            toast.error('Iltimos, yangi rasm yuklang!');
            return;
        }

        setLoading(true);
        try {
            // Rasmni serverga yuklash
            const imageForm = new FormData();
            imageForm.append('file', photo);

            const fileRes = await axios.post(`${baseUrl}/word-categories/file`, imageForm, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    'Content-Type': 'multipart/form-data'
                },
            });

            const photoUrl = fileRes.data.data?.url;

            if (!photoUrl) {
                throw new Error('Rasm yuklashda xatolik');
            }

            // Kategoriyani yangilash
            const updateData = {
                photo: photoUrl,
                translations: translations.map(t => ({
                    language: t.language,
                    title: t.title.trim(),
                })),
            };

            await axios.patch(`${baseUrl}/word-categories/${category.id}`, updateData, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            toast.success('Oʻyin kategoriyasi yangilandi!');
            onSuccess?.();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    // Rasm mavjudligini tekshirish
    const hasExistingPhoto = category?.photo && category.photo.trim() !== '';

    if (!open || !category) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
            <div
                className="w-full sm:w-[400px] h-full bg-white shadow-xl overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center px-4 py-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">Kategoriyani Tahrirlash</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded"
                    >
                        <CloseIcon fontSize="small" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
                    {/* Rasm yuklash */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Yangi rasm *
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer relative">
                            {!photoPreview ? (
                                // Rasm yuklanmagan
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center text-gray-500">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                            📁
                                        </div>
                                        <p className="text-sm">Yangi rasm yuklang</p>
                                        <p className="text-xs text-gray-400 mt-1">Maksimum hajm: 1MB</p>
                                        {hasExistingPhoto && (
                                            <p className="text-xs text-orange-500 mt-2">
                                                Eski rasm mavjud, lekin yangi rasm yuklang
                                            </p>
                                        )}
                                    </div>
                                </>
                            ) : (
                                // Rasm yuklangan
                                <div className="relative">
                                    <img src={photoPreview} alt="Preview" className="w-full h-40 object-contain" />
                                    <div className="text-xs text-gray-500 mt-1 text-center">
                                        Hajm: {photo ? `${(photo.size / (1024 * 1024)).toFixed(2)}MB` : ''}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPhoto(null);
                                            setPhotoPreview('');
                                        }}
                                        className="absolute top-1 right-1 bg-white/80 p-1 rounded-full"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 3 ta title birga */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Kategoriya nomi *</label>

                        {translations.map((translation) => (
                            <div key={translation.language}>
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs text-gray-500 capitalize">{translation.language} tili</p>
                                    <p className="text-xs text-gray-500">{translation.title.length}/32</p>
                                </div>
                                <input
                                    type="text"
                                    value={translation.title}
                                    onChange={(e) => handleTranslationChange(translation.language, e.target.value)}
                                    placeholder={`Kategoriya nomi ${translation.language} tilida`}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                                    required
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-2 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-700 font-medium rounded border border-gray-300 hover:bg-gray-50"
                            disabled={loading}
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !photo}
                            className="px-4 py-2 text-sm text-white font-medium rounded disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg, #69569F, #8B7AB8)' }}
                        >
                            {loading ? 'Yuklanmoqda...' : 'Yangilash'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
