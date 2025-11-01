'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import { getAccessToken } from '@/utils/getToken';
import toast from 'react-hot-toast';
import { CreateWordGameModal } from '@/modals/word-game/createWordGame';
import { UpdateWordGameModal } from '@/modals/word-game/updteWordGame';

interface Option {
    id: string;
    title: string;
    isCorrect: boolean;
}

interface Translation {
    id: string;
    title: string;
    language: string;
}

interface GameOption {
    id?: string;
    title: string;
    isCorrect: boolean;
}

interface WordGame {
    id: string;
    photo: string;
    categoryId: string;
    translations: Translation[];
    options: GameOption[];
    createdAt: string;
}

interface ApiResponse {
    statusCode: number;
    success: boolean;
    data: {
        data: WordGame[];
        meta: {
            pagination: {
                pageNumber: number;
                pageSize: number;
                count: number;
                pageCount: number;
            };
        };
    };
}

interface GameCategory {
    id: string;
    photo: string;
    translations: Translation[];
    createdAt: string;
}

interface CategoriesResponse {
    statusCode: number;
    success: boolean;
    data: {
        data: GameCategory[];
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

export default function WordGamesPage() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const imgUrl = process.env.NEXT_PUBLIC_IMG_URL;

    const [wordGames, setWordGames] = useState<WordGame[]>([]);
    const [categories, setCategories] = useState<GameCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState<WordGame | null>(null);

    const getImageUrl = (photoPath: string): string => {
        if (!photoPath) return '';

        if (photoPath.startsWith('http')) return photoPath;

        if (photoPath.startsWith('/')) {
            return `${imgUrl}${photoPath}`;
        }

        return `${imgUrl}/${photoPath}`;
    };

    const fetchCategories = async () => {
        try {
            setCategoriesLoading(true);
            const response = await axios.get<CategoriesResponse>(`${baseUrl}/word-categories/admin`, {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
            });

            if (response.data.success) {
                setCategories(response.data.data.data);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Kategoriyalarni yuklashda xatolik');
        } finally {
            setCategoriesLoading(false);
        }
    };

    const fetchWordGames = async (categoryId?: string) => {
        try {
            setLoading(true);
            const params: any = {};
            if (categoryId) {
                params.categoryId = categoryId;
            }

            const res = await axios.get<ApiResponse>(`${baseUrl}/word-games/admin`, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    'Content-Type': 'application/json'
                },
                params
            });

            if (res.data.success && res.data.data.data) {
                setWordGames(res.data.data.data);
            } else {
                throw new Error('Ma\'lumotlar formati noto\'g\'ri');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchWordGames();
    }, []);

    useEffect(() => {
        fetchWordGames(selectedCategory || undefined);
    }, [selectedCategory]);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('uz-UZ').replaceAll('/', '.');
    };

    const getUZTitle = (translations: Translation[]) => {
        return translations.find(t => t.language === 'UZ')?.title || 'Noma\'lum';
    };

    const getCorrectOption = (options: Option[]) => {
        return options.find(opt => opt.isCorrect)?.title || 'To\'g\'ri javob topilmadi';
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await axios.delete(`${baseUrl}/word-games/${deleteId}`, {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
            });
            setWordGames(prev => prev.filter(game => game.id !== deleteId));
            setDeleteId(null);
            toast.success("O'yin o'chirildi");
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
        }
    };

    const handleAddSuccess = () => {
        fetchWordGames(selectedCategory || undefined);
    };

    const handleEdit = (game: WordGame) => {
        setSelectedGame(game);
        setUpdateModalOpen(true);
    };

    const handleUpdateClose = () => {
        setUpdateModalOpen(false);
        setSelectedGame(null);
    };

    const handleUpdateSuccess = () => {
        fetchWordGames(selectedCategory || undefined);
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">So'z O'yinlari</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Jami {wordGames.length} ta o'yin
                    </p>
                </div>
                <button
                    onClick={() => setOpenCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg"
                    style={{ background: 'linear-gradient(135deg, #69569F, #8B7AB8)' }}
                >
                    <AddIcon sx={{ fontSize: 20 }} />
                    <span>Qo&apos;shish</span>
                </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategoriya bo'yicha filtrlash
                </label>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="">Barcha kategoriyalar</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {getUZTitle(category.translations)}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <CircularProgress sx={{ color: '#7C6BB3' }} />
                </div>
            ) : wordGames.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <p className="text-lg">O'yinlar topilmadi</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wordGames.map((game) => (
                        <div key={game.id} className="relative bg-white rounded-xl p-5 shadow-md border border-gray-200">
                            {/* Edit/Delete Buttons */}
                            <div className="absolute top-3 right-3 flex gap-1">
                                <button
                                    onClick={() => handleEdit(game)}
                                    className="p-1 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    <EditIcon sx={{ fontSize: 18 }} />
                                </button>
                                <button
                                    onClick={() => setDeleteId(game.id)}
                                    className="p-1 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    <DeleteIcon sx={{ fontSize: 18 }} />
                                </button>
                            </div>

                            {/* Game Image */}
                            <div className="flex justify-center mb-4">
                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                    {game.photo ? (
                                        <img
                                            src={getImageUrl(game.photo)}
                                            alt={getUZTitle(game.translations)}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    ) : null}
                                    <div className={`w-full h-full flex items-center justify-center ${game.photo ? 'hidden' : 'flex'}`}>
                                        <span className="text-3xl">🎮</span>
                                    </div>
                                </div>
                            </div>

                            {/* Game Title */}
                            <h3 className="text-lg font-semibold text-gray-800 text-center mb-3">
                                {getUZTitle(game.translations)}
                            </h3>

                            {/* Options */}
                            <div className="space-y-2 mb-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Variantlar:</p>
                                {game.options.map((option, index) => (
                                    <div key={option.id} className="flex items-center gap-2">
                                        <span className={`w-6 h-6 flex items-center justify-center rounded text-xs font-medium ${option.isCorrect
                                            ? 'bg-green-100 text-green-800 border border-green-300'
                                            : 'bg-gray-100 text-gray-600 border border-gray-300'
                                            }`}>
                                            {index + 1}
                                        </span>
                                        <span className={`text-sm ${option.isCorrect ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                                            {option.title}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Translations */}
                            <div className="mb-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Tarjimalar:</p>
                                <div className="flex flex-wrap gap-1">
                                    {game.translations.map((trans) => (
                                        <span
                                            key={trans.id}
                                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                                        >
                                            {trans.language}: {trans.title}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Created Date */}
                            <div className="text-xs text-gray-400 text-center">
                                {formatDate(game.createdAt)}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            <CreateWordGameModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                onSuccess={handleAddSuccess}
                categories={categories}
            />

            <UpdateWordGameModal
                open={updateModalOpen}
                onClose={handleUpdateClose}
                onSuccess={handleUpdateSuccess}
                categories={categories}
                game={selectedGame}
            />

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                        <h3 className="text-lg font-semibold mb-4">O'yinni o'chirish</h3>
                        <p className="text-gray-600 mb-6">Rostan ham bu o'yinni o'chirmoqchimisiz?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                O'chirish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


// 'use client';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import CircularProgress from '@mui/material/CircularProgress';
// import { getAccessToken } from '@/utils/getToken';
// import toast from 'react-hot-toast';
// import { CreateWordGameModal } from '@/modals/word-game/createWordGame';

// interface Option {
//     id: string;
//     title: string;
//     isCorrect: boolean;
// }

// interface Translation {
//     id: string;
//     title: string;
//     language: string;
// }

// interface WordGame {
//     id: string;
//     photo: string;
//     options: Option[];
//     translations: Translation[];
//     createdAt: string;
// }

// interface ApiResponse {
//     statusCode: number;
//     success: boolean;
//     data: {
//         data: WordGame[];
//         meta: {
//             pagination: {
//                 pageNumber: number;
//                 pageSize: number;
//                 count: number;
//                 pageCount: number;
//             };
//         };
//     };
// }

// interface GameCategory {
//     id: string;
//     photo: string;
//     translations: Translation[];
//     createdAt: string;
// }

// interface CategoriesResponse {
//     statusCode: number;
//     success: boolean;
//     data: {
//         data: GameCategory[];
//         meta: {
//             pagination: {
//                 count: number;
//                 pageCount: number;
//                 pageNumber: number;
//                 pageSize: number;
//             };
//         };
//     };
// }

// export default function WordGamesPage() {
//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
//     const imgUrl = process.env.NEXT_PUBLIC_IMG_URL;

//     const [wordGames, setWordGames] = useState<WordGame[]>([]);
//     const [categories, setCategories] = useState<GameCategory[]>([]);
//     const [selectedCategory, setSelectedCategory] = useState<string>('');
//     const [loading, setLoading] = useState(true);
//     const [categoriesLoading, setCategoriesLoading] = useState(true);
//     const [deleteId, setDeleteId] = useState<string | null>(null);
//     const [editGame, setEditGame] = useState<WordGame | null>(null);
//     const [openCreateModal, setOpenCreateModal] = useState(false);

//     const getImageUrl = (photoPath: string): string => {
//         if (!photoPath) return '';

//         if (photoPath.startsWith('http')) return photoPath;

//         if (photoPath.startsWith('/')) {
//             return `${imgUrl}${photoPath}`;
//         }

//         return `${imgUrl}/${photoPath}`;
//     };

//     const fetchCategories = async () => {
//         try {
//             setCategoriesLoading(true);
//             const response = await axios.get<CategoriesResponse>(`${baseUrl}/word-categories/admin`, {
//                 headers: { Authorization: `Bearer ${getAccessToken()}` },
//             });

//             if (response.data.success) {
//                 setCategories(response.data.data.data);
//             }
//         } catch (err: any) {
//             toast.error(err.response?.data?.message || 'Kategoriyalarni yuklashda xatolik');
//         } finally {
//             setCategoriesLoading(false);
//         }
//     };

//     const fetchWordGames = async (categoryId?: string) => {
//         try {
//             setLoading(true);
//             const params: any = {};
//             if (categoryId) {
//                 params.categoryId = categoryId;
//             }

//             const res = await axios.get<ApiResponse>(`${baseUrl}/word-games/admin`, {
//                 headers: {
//                     Authorization: `Bearer ${getAccessToken()}`,
//                     'Content-Type': 'application/json'
//                 },
//                 params
//             });

//             if (res.data.success && res.data.data.data) {
//                 setWordGames(res.data.data.data);
//             } else {
//                 throw new Error('Ma\'lumotlar formati noto\'g\'ri');
//             }
//         } catch (err: any) {
//             toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchCategories();
//         fetchWordGames();
//     }, []);

//     useEffect(() => {
//         fetchWordGames(selectedCategory || undefined);
//     }, [selectedCategory]);

//     const formatDate = (date: string) => {
//         return new Date(date).toLocaleDateString('uz-UZ').replaceAll('/', '.');
//     };

//     const getUZTitle = (translations: Translation[]) => {
//         return translations.find(t => t.language === 'UZ')?.title || 'Noma\'lum';
//     };

//     const getCorrectOption = (options: Option[]) => {
//         return options.find(opt => opt.isCorrect)?.title || 'To\'g\'ri javob topilmadi';
//     };

//     const confirmDelete = async () => {
//         if (!deleteId) return;
//         try {
//             await axios.delete(`${baseUrl}/word-games/${deleteId}`, {
//                 headers: { Authorization: `Bearer ${getAccessToken()}` },
//             });
//             setWordGames(prev => prev.filter(game => game.id !== deleteId));
//             setDeleteId(null);
//             toast.success("O'yin o'chirildi");
//         } catch (err: any) {
//             toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
//         }
//     };

//     const handleAddSuccess = () => {
//         fetchWordGames(selectedCategory || undefined);
//     };

//     return (
//         <div className="p-6">
//             <div className="flex items-center justify-between mb-6">
//                 <div>
//                     <h1 className="text-2xl font-bold text-gray-800">So'z O'yinlari</h1>
//                     <p className="text-gray-500 text-sm mt-1">
//                         Jami {wordGames.length} ta o'yin
//                     </p>
//                 </div>
//                 <button
//                     onClick={() => setOpenCreateModal(true)}
//                     className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg"
//                     style={{ background: 'linear-gradient(135deg, #69569F, #8B7AB8)' }}
//                 >
//                     <AddIcon sx={{ fontSize: 20 }} />
//                     <span>Qo&apos;shish</span>
//                 </button>
//             </div>

//             {/* Category Filter */}
//             <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Kategoriya bo'yicha filtrlash
//                 </label>
//                 <select
//                     value={selectedCategory}
//                     onChange={(e) => setSelectedCategory(e.target.value)}
//                     className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 >
//                     <option value="">Barcha kategoriyalar</option>
//                     {categories.map((category) => (
//                         <option key={category.id} value={category.id}>
//                             {getUZTitle(category.translations)}
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             {loading ? (
//                 <div className="flex justify-center items-center h-64">
//                     <CircularProgress sx={{ color: '#7C6BB3' }} />
//                 </div>
//             ) : wordGames.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-64 text-gray-500">
//                     <p className="text-lg">O'yinlar topilmadi</p>
//                 </div>
//             ) : (
//                 <div className="bg-white rounded-lg shadow overflow-hidden">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Rasm
//                                 </th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Savol (UZ)
//                                 </th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Variantlar
//                                 </th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     To'g'ri Javob
//                                 </th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Yaratilgan sana
//                                 </th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Harakatlar
//                                 </th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {wordGames.map((game) => (
//                                 <tr key={game.id} className="hover:bg-gray-50">
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
//                                             {game.photo ? (
//                                                 <img
//                                                     src={getImageUrl(game.photo)}
//                                                     alt={getUZTitle(game.translations)}
//                                                     className="w-full h-full object-cover"
//                                                     onError={(e) => {
//                                                         e.currentTarget.style.display = 'none';
//                                                     }}
//                                                 />
//                                             ) : null}
//                                             <div className={`w-full h-full flex items-center justify-center ${game.photo ? 'hidden' : 'flex'}`}>
//                                                 <span className="text-lg">🎮</span>
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <div className="text-sm font-medium text-gray-900 max-w-xs">
//                                             {getUZTitle(game.translations)}
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <div className="text-sm text-gray-600 space-y-1">
//                                             {game.options.map((option, index) => (
//                                                 <div key={option.id} className="flex items-center gap-2">
//                                                     <span className={`w-5 h-5 flex items-center justify-center rounded text-xs font-medium ${
//                                                         option.isCorrect
//                                                             ? 'bg-green-100 text-green-800 border border-green-300'
//                                                             : 'bg-gray-100 text-gray-600 border border-gray-300'
//                                                     }`}>
//                                                         {index + 1}
//                                                     </span>
//                                                     <span className={option.isCorrect ? 'text-green-600 font-semibold' : 'text-gray-600'}>
//                                                         {option.title}
//                                                     </span>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         <div className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full inline-block">
//                                             {getCorrectOption(game.options)}
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         <div className="text-sm text-gray-600">
//                                             {formatDate(game.createdAt)}
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         <div className="flex items-center gap-2">
//                                             <button
//                                                 onClick={() => setEditGame(game)}
//                                                 className="text-gray-600 hover:text-blue-600 p-1 rounded transition-colors"
//                                             >
//                                                 <EditIcon sx={{ fontSize: 18 }} />
//                                             </button>
//                                             <button
//                                                 onClick={() => setDeleteId(game.id)}
//                                                 className="text-gray-600 hover:text-red-600 p-1 rounded transition-colors"
//                                             >
//                                                 <DeleteIcon sx={{ fontSize: 18 }} />
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}

//             {/* Create Modal */}
//             <CreateWordGameModal
//                 open={openCreateModal}
//                 onClose={() => setOpenCreateModal(false)}
//                 onSuccess={handleAddSuccess}
//                 categories={categories}
//             />

//             {/* Delete Confirmation Modal */}
//             {deleteId && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//                     <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
//                         <h3 className="text-lg font-semibold mb-4">O'yinni o'chirish</h3>
//                         <p className="text-gray-600 mb-6">Rostan ham bu o'yinni o'chirmoqchimisiz?</p>
//                         <div className="flex justify-end gap-3">
//                             <button
//                                 onClick={() => setDeleteId(null)}
//                                 className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
//                             >
//                                 Bekor qilish
//                             </button>
//                             <button
//                                 onClick={confirmDelete}
//                                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//                             >
//                                 O'chirish
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
