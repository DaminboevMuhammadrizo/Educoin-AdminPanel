'use client';

import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { getAccessToken } from '@/utils/getToken';
import toast from 'react-hot-toast';

interface Category {
    id: string;
    translations: { language: string; title: string }[];
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function CreatePlatformGiftModal({ open, onClose, onSuccess }: Props) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const [title, setTitle] = useState('');
    const [miniDescription, setMiniDescription] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState('');
    const [count, setCount] = useState('');
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch categories
    useEffect(() => {
        if (open) {
            fetchCategories();
        }
    }, [open]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${baseUrl}/categories/admin`, {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
            });
            if (response.data.success) {
                setCategories(response.data.data.data);
            }
        } catch (err) {
            console.error('Categories fetch error:', err);
        }
    };

    // Reset form
    useEffect(() => {
        if (!open) {
            setTitle('');
            setMiniDescription('');
            setDescription('');
            setPhoto('');
            setCount('');
            setAmount('');
            setCategoryId('');
        }
    }, [open]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= 32) setTitle(value);
    };

    const handleMiniDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= 64) setMiniDescription(value);
    };

    const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= 256) setDescription(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !miniDescription.trim() || !description.trim() || !photo.trim() || !categoryId) {
            toast.error('Iltimos, barcha majburiy maydonlarni to\'ldiring!');
            return;
        }

        if (!count || parseInt(count) < 0) {
            toast.error('Soni 0 dan katta bo\'lishi kerak!');
            return;
        }

        if (!amount || parseInt(amount) < 0) {
            toast.error('Narx 0 dan katta bo\'lishi kerak!');
            return;
        }

        setLoading(true);
        try {
            const giftData = {
                translations: [
                    {
                        language: 'UZ',
                        title: title.trim(),
                        miniDescription: miniDescription.trim(),
                        description: description.trim(),
                    },
                ],
                photo: photo.trim(),
                count: parseInt(count),
                amount: parseInt(amount),
                categoryId: categoryId,
            };

            await axios.post(`${baseUrl}/platform-gifts`, giftData, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            toast.success('Sovg\'a yaratildi!');
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
            <div
                className="w-full sm:w-[450px] h-full bg-white overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-semibold text-gray-900">Yangi Sovg'a</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    >
                        <CloseIcon fontSize="small" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sarlavha *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Sovg'a nomi"
                            className="w-full border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg px-4 py-2.5 text-sm transition-all outline-none"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1.5">{title.length}/32</p>
                    </div>

                    {/* Mini Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Qisqa tavsif *
                        </label>
                        <input
                            type="text"
                            value={miniDescription}
                            onChange={handleMiniDescChange}
                            placeholder="Qisqacha tavsif"
                            className="w-full border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg px-4 py-2.5 text-sm transition-all outline-none"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1.5">{miniDescription.length}/64</p>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            To'liq tavsif *
                        </label>
                        <textarea
                            value={description}
                            onChange={handleDescChange}
                            placeholder="Batafsil ma'lumot"
                            className="w-full border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg px-4 py-2.5 text-sm transition-all outline-none resize-none"
                            rows={4}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1.5">{description.length}/256</p>
                    </div>

                    {/* Photo URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rasm URL *
                        </label>
                        <input
                            type="url"
                            value={photo}
                            onChange={(e) => setPhoto(e.target.value)}
                            placeholder="https://example.com/image.png"
                            className="w-full border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg px-4 py-2.5 text-sm transition-all outline-none"
                            required
                        />
                        {photo && (
                            <div className="mt-2 p-2 border rounded-lg">
                                <img src={photo} alt="Preview" className="w-16 h-16 object-contain mx-auto" />
                            </div>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kategoriya *
                        </label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg px-4 py-2.5 text-sm transition-all outline-none"
                            required
                        >
                            <option value="">Kategoriyani tanlang</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.translations.find(t => t.language === 'UZ')?.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Count and Amount */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Soni *
                            </label>
                            <input
                                type="number"
                                value={count}
                                onChange={(e) => setCount(e.target.value)}
                                placeholder="100"
                                min="0"
                                className="w-full border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg px-4 py-2.5 text-sm transition-all outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Narxi (coin) *
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="500"
                                min="0"
                                className="w-full border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg px-4 py-2.5 text-sm transition-all outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background: 'linear-gradient(135deg, #69569F, #8B7AB8)' }}
                        >
                            {loading ? 'Yuklanmoqda...' : 'Saqlash'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
