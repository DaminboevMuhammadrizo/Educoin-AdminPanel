'use client';

import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { getAccessToken } from '@/utils/getToken';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  translations: { language: string; title: string }[];
}

interface PlatformGift {
  id: string;
  translations: { language: string; title: string; miniDescription: string; description: string }[];
  photo: string;
  count: number;
  amount: number;
  categoryId: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  platformGift: PlatformGift | null;
}

interface Translation {
    language: string;
    title: string;
    miniDescription: string;
    description: string;
}

export default function UpdatePlatformGiftModal({ open, onClose, onSuccess, platformGift }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const imgUrl = process.env.NEXT_PUBLIC_IMG_URL;

  const [translations, setTranslations] = useState<Translation[]>([
    { language: 'UZ', title: '', miniDescription: '', description: '' },
    { language: 'EN', title: '', miniDescription: '', description: '' },
    { language: 'RU', title: '', miniDescription: '', description: '' }
  ]);
  const [photo, setPhoto] = useState('');
  const [count, setCount] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Rasm URL ni to'g'ri formatga o'tkazish
  const getImageUrl = (photoPath: string): string => {
    if (!photoPath) return '';

    if (photoPath.startsWith('http')) return photoPath;

    if (photoPath.startsWith('/')) {
      return `${imgUrl}${photoPath}`;
    }

    return `${imgUrl}/${photoPath}`;
  };

  useEffect(() => {
    if (open) fetchCategories();
  }, [open]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseUrl}/categories/admin`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      if (response.data.success) setCategories(response.data.data.data);
    } catch (err) {
      console.error('Categories fetch error:', err);
    }
  };

  useEffect(() => {
    if (platformGift && open) {
      const uzTrans = platformGift.translations.find(t => t.language === 'UZ');
      const enTrans = platformGift.translations.find(t => t.language === 'EN');
      const ruTrans = platformGift.translations.find(t => t.language === 'RU');

      setTranslations([
        { language: 'UZ', title: uzTrans?.title || '', miniDescription: uzTrans?.miniDescription || '', description: uzTrans?.description || '' },
        { language: 'EN', title: enTrans?.title || '', miniDescription: enTrans?.miniDescription || '', description: enTrans?.description || '' },
        { language: 'RU', title: ruTrans?.title || '', miniDescription: ruTrans?.miniDescription || '', description: ruTrans?.description || '' }
      ]);
      setPhoto(platformGift.photo || '');
      setCount(String(platformGift.count || ''));
      setAmount(String(platformGift.amount || ''));
      setCategoryId(platformGift.categoryId || '');

      // Preview URL ni ham to'g'ri formatda o'rnatish
      if (platformGift.photo) {
        setPreviewUrl(getImageUrl(platformGift.photo));
      }
    }
  }, [platformGift, open]);

  useEffect(() => {
    if (!open) {
      setTranslations([
        { language: 'UZ', title: '', miniDescription: '', description: '' },
        { language: 'EN', title: '', miniDescription: '', description: '' },
        { language: 'RU', title: '', miniDescription: '', description: '' }
      ]);
      setPhoto('');
      setCount('');
      setAmount('');
      setCategoryId('');
      setPreviewUrl('');
    }
  }, [open]);

  // Rasm yuklash funksiyasi
  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await axios.post(`${baseUrl}/platform-gifts/file`, uploadFormData, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      if (response.data.success) {
        const imageUrl = response.data.data.url;
        setPhoto(imageUrl);
        setPreviewUrl(getImageUrl(imageUrl));
        toast.success('Rasm muvaffaqiyatli yuklandi');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Rasm yuklashda xatolik');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Butun div bosilganda file inputni ishga tushirish
  const handleDivClick = () => {
    if (!uploading) {
      document.getElementById('file-upload-input-update')?.click();
    }
  };

  const handleTranslationChange = (language: string, field: 'title' | 'miniDescription' | 'description', value: string) => {
    const maxLength = field === 'title' ? 32 : field === 'miniDescription' ? 64 : 256;
    if (value.length <= maxLength) {
        setTranslations(prev =>
            prev.map(t =>
                t.language === language ? { ...t, [field]: value } : t
            )
        );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!platformGift) {
      toast.error('Yangilanish uchun sovg‘a topilmadi!');
      return;
    }

    const emptyTranslation = translations.find(t => !t.title.trim() || !t.miniDescription.trim() || !t.description.trim());
    if (emptyTranslation) {
        toast.error(`Iltimos, barcha maydonlarni to'ldiring!`);
        return;
    }

    if (!photo.trim() || !categoryId) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring!");
      return;
    }

    if (!count || parseInt(count) <= 0) {
      toast.error("Soni 0 dan katta bo'lishi kerak!");
      return;
    }

    if (!amount || parseInt(amount) <= 0) {
      toast.error("Narx 0 dan katta bo'lishi kerak!");
      return;
    }

    setLoading(true);
    try {
      const updatedGift = {
        translations: translations.map(t => ({
            language: t.language,
            title: t.title.trim(),
            miniDescription: t.miniDescription.trim(),
            description: t.description.trim(),
        })),
        photo: photo.trim(),
        count: parseInt(count),
        amount: parseInt(amount),
        categoryId: categoryId,
      };

      await axios.patch(`${baseUrl}/platform-gifts/${platformGift.id}`, updatedGift, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          'Content-Type': 'application/json',
        },
      });

      toast.success("Sovg'a muvaffaqiyatli yangilandi!");
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
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-5 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">Sovg'ani tahrirlash</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* 3 ta title birga */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Sarlavha *</label>

            {translations.map((translation) => (
                <div key={translation.language}>
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-gray-500 capitalize">{translation.language} tili</p>
                        <p className="text-xs text-gray-500">{translation.title.length}/32</p>
                    </div>
                    <input
                        type="text"
                        value={translation.title}
                        onChange={(e) => handleTranslationChange(translation.language, 'title', e.target.value)}
                        placeholder={`Sarlavha ${translation.language} tilida`}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                        required
                    />
                </div>
            ))}
          </div>

          {/* 3 ta mini description birga */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Qisqa tavsif *</label>

            {translations.map((translation) => (
                <div key={translation.language}>
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-gray-500 capitalize">{translation.language} tili</p>
                        <p className="text-xs text-gray-500">{translation.miniDescription.length}/64</p>
                    </div>
                    <input
                        type="text"
                        value={translation.miniDescription}
                        onChange={(e) => handleTranslationChange(translation.language, 'miniDescription', e.target.value)}
                        placeholder={`Qisqa tavsif ${translation.language} tilida`}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                        required
                    />
                </div>
            ))}
          </div>

          {/* 3 ta description birga */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">To'liq tavsif *</label>

            {translations.map((translation) => (
                <div key={translation.language}>
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-gray-500 capitalize">{translation.language} tili</p>
                        <p className="text-xs text-gray-500">{translation.description.length}/256</p>
                    </div>
                    <textarea
                        value={translation.description}
                        onChange={(e) => handleTranslationChange(translation.language, 'description', e.target.value)}
                        placeholder={`To'liq tavsif ${translation.language} tilida`}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-900 resize-none"
                        rows={3}
                        required
                    />
                </div>
            ))}
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rasm Yuklash *
            </label>
            <div
              className={`border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleDivClick}
            >
              {previewUrl ? (
                <div className="mb-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="mx-auto h-32 w-32 object-cover rounded-lg"
                    onError={(e) => {
                      // Rasm yuklanmasa, default ko'rsatkichni ko'rsatish
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = 'w-full h-32 flex items-center justify-center';
                        fallback.innerHTML = '<span class="text-3xl">🎁</span>';
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                  <p className="text-sm text-green-600 mt-2">
                    {platformGift?.photo === photo ? 'Joriy rasm' : 'Yangi rasm yuklandi'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {uploading ? 'Yangi rasm yuklanmoqda...' : 'Rasmni almashtirish uchun bosing'}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <CloudUploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 text-sm text-gray-600">
                    <span className="text-purple-600 hover:text-purple-500 font-medium">
                      Rasm yuklash
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">PNG, JPG, JPEG fayllar</p>
                </div>
              )}
              {uploading && (
                <div className="mt-2">
                  <CircularProgress size={20} sx={{ color: '#7C6BB3' }} />
                  <p className="text-xs text-gray-500 mt-1">Yuklanmoqda...</p>
                </div>
              )}
            </div>
            <input
              id="file-upload-input-update"
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategoriya *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
              required
            >
              <option value="" disabled>Kategoriyani tanlang</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.translations.find((t) => t.language === 'UZ')?.title}
                </option>
              ))}
            </select>
          </div>

          {/* Count and Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Soni *</label>
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                placeholder="100"
                min="1"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Narxi (coin) *</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500"
                min="1"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 font-medium rounded border border-gray-300 hover:bg-gray-50"
              disabled={loading || uploading}
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-4 py-2 text-sm bg-gray-900 hover:bg-gray-800 text-white font-medium rounded disabled:opacity-50"
            >
              {loading ? 'Yuklanmoqda...' : "Yangilash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
