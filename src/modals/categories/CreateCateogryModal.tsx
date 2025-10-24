'use client';

import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { getAccessToken } from '@/utils/getToken';
import toast from 'react-hot-toast';

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function CreateCategoryModal({ open, onClose, onSuccess }: Props) {
    const [title, setTitle] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [icon, setIcon] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    useEffect(() => {
        if (!open) {
            setTitle('');
            setIcon(null);
            setIsActive(true);
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !icon) {
            toast.error('Iltimos, barcha maydonlarni to\'ldiring!');
            return;
        }

        setLoading(true);
        try {
            const imageForm = new FormData();
            imageForm.append('file', icon);
            const fileRes = await axios.post(`${baseUrl}/categories/file`, imageForm, {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
            });
            const iconUrl = fileRes.data.data?.url;

            const categoryData = {
                icon: iconUrl,
                isActive,
                translations: [{ language: 'UZ', title }],
            };

            await axios.post(`${baseUrl}/categories`, categoryData, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            toast.success('Kategoriya yaratildi!');
            onSuccess?.();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
            <div className="w-full sm:w-[400px] h-full bg-white" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Yangi kategoriya</h2>
                    <button onClick={onClose}><CloseIcon fontSize="small" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
                    {/* Icon upload - FIXED */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Icon (rasm)</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer relative">
                            {!icon ? (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setIcon(e.target.files?.[0] || null)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center text-gray-500">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                            📁
                                        </div>
                                        <p className="text-sm">Rasm yuklang</p>
                                    </div>
                                </>
                            ) : (
                                <div className="relative">
                                    <img src={URL.createObjectURL(icon)} alt="Icon" className="w-full h-40 object-contain" />
                                    <button
                                        type="button"
                                        onClick={() => setIcon(null)}
                                        className="absolute top-1 right-1 bg-white/80 p-1 rounded-full"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Sarlavha (UZ)</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Kategoriya nomi"
                            className="w-full border border-gray-300 rounded-md p-2 text-sm"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={e => setIsActive(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <label className="text-sm">Faol kategoriya</label>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">
                            Bekor qilish
                        </button>
                        <button type="submit" disabled={loading} className="px-4 py-2 text-white rounded-md" style={{ background: 'linear-gradient(135deg, #69569F, #8B7AB8)' }}>
                            {loading ? 'Yuklanmoqda...' : 'Saqlash'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
