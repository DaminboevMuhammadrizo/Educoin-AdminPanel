import { getAccessToken } from "@/utils/getToken";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface Translation {
    id: string;
    title: string;
    language: string;
}

interface GameCategory {
    id: string;
    photo: string;
    translations: Translation[];
    createdAt: string;
}

interface CreateWordGameModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    categories: GameCategory[];
}

export const CreateWordGameModal: React.FC<CreateWordGameModalProps> = ({
    open,
    onClose,
    onSuccess,
    categories
}) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const [formData, setFormData] = useState({
        photo: '',
        categoryId: '',
        translations: [
            { title: '', language: 'UZ' },
            { title: '', language: 'RU' },
            { title: '', language: 'EN' }
        ],
        options: [
            { title: '', isCorrect: false },
            { title: '', isCorrect: false },
            { title: '', isCorrect: true }
        ]
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const handleFileUpload = async (file: File) => {
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(`${baseUrl}/word-games/file`, formData, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    'Content-Type': 'multipart/form-data'
                },
            });

            if (response.data.success) {
                const imageUrl = response.data.data.url;
                setFormData(prev => ({ ...prev, photo: imageUrl }));
                setPreviewUrl(imageUrl);
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

    const handleDivClick = () => {
        if (!uploading) {
            document.getElementById('file-upload-input')?.click();
        }
    };

    const handleTranslationChange = (index: number, value: string) => {
        const newTranslations = [...formData.translations];
        newTranslations[index].title = value;
        setFormData({ ...formData, translations: newTranslations });
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...formData.options];
        newOptions[index].title = value;
        setFormData({ ...formData, options: newOptions });
    };

    const handleCorrectOptionChange = (index: number) => {
        const newOptions = formData.options.map((option, i) => ({
            ...option,
            isCorrect: i === index
        }));
        setFormData({ ...formData, options: newOptions });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.categoryId) {
            toast.error('Kategoriyani tanlang');
            return;
        }

        if (formData.translations.some(t => !t.title.trim())) {
            toast.error('Barcha tillar uchun savol matnini kiriting');
            return;
        }

        if (formData.options.some(o => !o.title.trim())) {
            toast.error('Barcha variantlarni kiriting');
            return;
        }

        if (!formData.options.some(o => o.isCorrect)) {
            toast.error('To\'g\'ri javobni belgilang');
            return;
        }

        try {
            setLoading(true);
            await axios.post(`${baseUrl}/word-games`, formData, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    'Content-Type': 'application/json'
                },
            });

            toast.success('Yangi o\'yin muvaffaqiyatli qo\'shildi');
            onSuccess();
            onClose();
            setFormData({
                photo: '',
                categoryId: '',
                translations: [
                    { title: '', language: 'UZ' },
                    { title: '', language: 'RU' },
                    { title: '', language: 'EN' }
                ],
                options: [
                    { title: '', isCorrect: false },
                    { title: '', isCorrect: false },
                    { title: '', isCorrect: true }
                ]
            });
            setPreviewUrl('');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
            <div className="bg-white w-full max-w-md h-full overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 className="text-xl font-semibold">Yangi So'z O'yini Qo'shish</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kategoriya *
                        </label>
                        <select
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        >
                            <option value="">Kategoriyani tanlang</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.translations.find(t => t.language === 'UZ')?.title || 'Noma\'lum'}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rasm Yuklash
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
                                    />
                                    <p className="text-sm text-green-600 mt-2">Rasm yuklandi</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {uploading ? 'Yangi rasm yuklanmoqda...' : 'Boshqa rasm yuklash uchun bosing'}
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
                            id="file-upload-input"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Savol Matni *
                        </label>
                        {formData.translations.map((translation, index) => (
                            <div key={translation.language} className="flex items-center gap-2 mb-3">
                                <span className="w-12 text-sm font-medium text-gray-600">
                                    {translation.language}:
                                </span>
                                <input
                                    type="text"
                                    value={translation.title}
                                    onChange={(e) => handleTranslationChange(index, e.target.value)}
                                    placeholder={`${translation.language} tilidagi savol`}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Variantlar *
                        </label>
                        {formData.options.map((option, index) => (
                            <div key={index} className="flex items-center gap-2 mb-3">
                                <input
                                    type="radio"
                                    name="correctOption"
                                    checked={option.isCorrect}
                                    onChange={() => handleCorrectOptionChange(index)}
                                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                                />
                                <input
                                    type="text"
                                    value={option.title}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    placeholder={`Variant ${index + 1}`}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                        ))}
                        <p className="text-xs text-gray-500 mt-1">
                            To'g'ri javobni belgilash uchun radiogani bosing
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                        >
                            {loading ? 'Qo\'shilmoqda...' : 'Qo\'shish'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
