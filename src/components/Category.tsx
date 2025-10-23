// 'use client';

// import React, { useState, useEffect } from 'react';
// import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';

// const mockCategories = {
//     statusCode: 200,
//     success: true,
//     data: {
//         data: [
//             {
//                 id: "1",
//                 icon: "https://cdn-icons-png.flaticon.com/512/2909/2909808.png",
//                 isActive: true,
//                 translations: [
//                     {
//                         language: "UZ",
//                         title: "Matematika"
//                     }
//                 ],
//                 createdAt: "2025-01-15T10:30:00.000Z"
//             },
//             {
//                 id: "2",
//                 icon: "https://cdn-icons-png.flaticon.com/512/686/686589.png",
//                 isActive: true,
//                 translations: [
//                     {
//                         language: "UZ",
//                         title: "O'yinlar"
//                     }
//                 ],
//                 createdAt: "2025-01-16T11:20:00.000Z"
//             }
//         ],
//         meta: {
//             pagination: {
//                 count: 500,
//                 pageCount: 50,
//                 pageNumber: 1,
//                 pageSize: 10
//             }
//         }
//     }
// };

// export default function CategoriesPage() {

//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

//     const [hovered, setHovered] = useState<string | null>(null);
//     const [isClient, setIsClient] = useState(false);

//     useEffect(() => {
//         setIsClient(true);
//     }, []);

//     const categories = mockCategories.data.data;
//     const pagination = mockCategories.data.meta.pagination;

//     const getUZTitle = (translations: any[]) =>
//         translations.find((t) => t.language === 'UZ')?.title || "Nomalum";

//     // Client-side format funksiyasi
//     const formatDate = (date: string) => {
//         if (!isClient) return ''; // Serverda bo'sh qaytar
//         return new Date(date).toLocaleDateString('uz-UZ').replaceAll('/', '.');
//     };

//     const handleEdit = (id: string) => console.log('Edit:', id);
//     const handleDelete = (id: string) => console.log('Delete:', id);
//     const handleAdd = () => console.log('Add new category');
//     const handlePageChange = (page: number) => console.log('Page:', page);

//     return (
//         <div className="p-4">
//             {/* Header */}
//             <div className="flex items-center justify-between mb-4">
//                 <div>
//                     <h1 className="text-2xl font-bold text-gray-800">Kategoriyalar</h1>
//                     <p className="text-gray-500 text-sm mt-1">
//                         Jami {pagination.count} ta kategoriya | Sahifada {categories.length} ta
//                     </p>
//                 </div>
//                 <button
//                     onClick={handleAdd}
//                     className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg shadow hover:shadow-md transition-all"
//                     style={{ background: 'linear-gradient(135deg, #69569F, #8B7AB8)' }}
//                 >
//                     <AddIcon sx={{ fontSize: 20 }} />
//                     <span className="text-sm">Qo'shish</span>
//                 </button>
//             </div>

//             {/* Categories */}
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//                 {categories.map((cat) => (
//                     <div
//                         key={cat.id}
//                         onMouseEnter={() => setHovered(cat.id)}
//                         onMouseLeave={() => setHovered(null)}
//                         className={`relative bg-white rounded-xl p-5 shadow-md hover:shadow-md transition-all `}
//                     >
//                         {/* Status */}
//                         <span
//                             className={`absolute top-2 left-2 px-2 py-1 text-xs rounded-full font-bold ${cat.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-600'
//                                 }`}
//                         >
//                             {cat.isActive ? 'Faol' : 'Nofaol'}
//                         </span>

//                         {/* Hover buttons */}
//                         {hovered === cat.id && (
//                             <div className="absolute top-2 right-2 flex gap-1">
//                                 <button
//                                     onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleEdit(cat.id);
//                                     }}
//                                     className="p-1 text-gray-600 rounded-md hover:bg-gray-100"
//                                     title="Tahrirlash"
//                                 >
//                                     <EditIcon sx={{ fontSize: 16 }} />
//                                 </button>
//                                 <button
//                                     onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleDelete(cat.id);
//                                     }}
//                                     className="p-1 text-gray-600 rounded-md hover:bg-gray-100"
//                                     title="Ochirish"
//                                 >
//                                     <DeleteIcon sx={{ fontSize: 16 }} />
//                                 </button>
//                             </div>
//                         )}

//                         {/* Content */}
//                         <div className="flex flex-col items-center text-center mt-4">
//                             <div
//                                 className="w-14 h-14 rounded-full flex items-center justify-center mb-3 overflow-hidden transition-all"
//                                 style={{
//                                     background:
//                                         hovered === cat.id
//                                             ? 'linear-gradient(135deg, #69569F, #8B7AB8)'
//                                             : '#f3f4f6',
//                                 }}
//                             >
//                                 <img
//                                     src={cat.icon}
//                                     alt={getUZTitle(cat.translations)}
//                                     className="w-8 h-8 object-contain"
//                                 />
//                             </div>
//                             <h3 className="text-base font-semibold text-gray-800 mb-1">
//                                 {getUZTitle(cat.translations)}
//                             </h3>
//                             <p className="text-xs text-gray-400">{formatDate(cat.createdAt)}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Pagination */}
//             <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
//                 <span>
//                     Sahifa {pagination.pageNumber} / {pagination.pageCount} | Jami: {pagination.count} ta
//                 </span>
//                 <div className="flex gap-2">
//                     <button
//                         onClick={() => handlePageChange(pagination.pageNumber - 1)}
//                         disabled={pagination.pageNumber === 1}
//                         className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
//                     >
//                         Oldingi
//                     </button>
//                     <button
//                         onClick={() => handlePageChange(pagination.pageNumber + 1)}
//                         disabled={pagination.pageNumber === pagination.pageCount}
//                         className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
//                     >
//                         Keyingi
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }




'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';

type Category = {
  id: string;
  icon: string;
  isActive: boolean;
  translations: { language: string; title: string }[];
  createdAt: string;
};

export default function CategoriesPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`${baseUrl}/categories/admin`);
        console.log(res)

        if (res.status === 200 && res.data?.data?.data?.length) {
          setCategories(res.data.data.data);
          setPagination(res.data.data.meta.pagination);
        } else {
          setCategories([]);
          setError('Maʼlumot topilmadi');
        }
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || 'Xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseUrl]);

  const getUZTitle = (translations: any[]) =>
    translations.find((t) => t.language === 'UZ')?.title || 'Nomalum';

  const formatDate = (date: string) => {
    if (!isClient) return '';
    return new Date(date).toLocaleDateString('uz-UZ').replaceAll('/', '.');
  };

  const handleEdit = (id: string) => console.log('Edit:', id);
  const handleDelete = (id: string) => console.log('Delete:', id);
  const handleAdd = () => console.log('Add new category');
  const handlePageChange = (page: number) => console.log('Page:', page);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kategoriyalar</h1>
          {pagination && (
            <p className="text-gray-500 text-sm mt-1">
              Jami {pagination.count} ta kategoriya | Sahifada {categories.length} ta
            </p>
          )}
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

      {/* LOADING STATE */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <CircularProgress sx={{ color: '#7C6BB3' }} />
        </div>
      )}

      {/* ERROR STATE */}
      {!loading && error && (
        <div className="flex flex-col justify-center items-center h-64">
          <h1 className="text-lg text-red-600 font-semibold">{error}</h1>
        </div>
      )}

      {/* SUCCESS STATE */}
      {!loading && !error && categories.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onMouseEnter={() => setHovered(cat.id)}
                onMouseLeave={() => setHovered(null)}
                className="relative bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all"
              >
                {/* Status */}
                <span
                  className={`absolute top-2 left-2 px-2 py-1 text-xs rounded-full font-bold ${
                    cat.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {cat.isActive ? 'Faol' : 'Nofaol'}
                </span>

                {/* Hover buttons */}
                {hovered === cat.id && (
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(cat.id);
                      }}
                      className="p-1 text-gray-600 rounded-md hover:bg-gray-100"
                      title="Tahrirlash"
                    >
                      <EditIcon sx={{ fontSize: 16 }} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(cat.id);
                      }}
                      className="p-1 text-gray-600 rounded-md hover:bg-gray-100"
                      title="Ochirish"
                    >
                      <DeleteIcon sx={{ fontSize: 16 }} />
                    </button>
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-col items-center text-center mt-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-3 overflow-hidden transition-all"
                    style={{
                      background:
                        hovered === cat.id
                          ? 'linear-gradient(135deg, #69569F, #8B7AB8)'
                          : '#f3f4f6',
                    }}
                  >
                    {/* TEMP ICON (rasm hozircha yo‘q) */}
                    <span className="text-2xl">📚</span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    {getUZTitle(cat.translations)}
                  </h3>
                  <p className="text-xs text-gray-400">{formatDate(cat.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
              <span>
                Sahifa {pagination.pageNumber} / {pagination.pageCount} | Jami:{' '}
                {pagination.count} ta
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.pageNumber - 1)}
                  disabled={pagination.pageNumber === 1}
                  className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                >
                  Oldingi
                </button>
                <button
                  onClick={() => handlePageChange(pagination.pageNumber + 1)}
                  disabled={pagination.pageNumber === pagination.pageCount}
                  className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                >
                  Keyingi
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
