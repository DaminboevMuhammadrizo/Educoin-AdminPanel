'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from '@/utils/getToken';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import toast from 'react-hot-toast';
import CreateDefaultTasksModal from '@/modals/default-tasks/CreateDefaultTasks';
import UpdateDefaultTasksModal from '@/modals/default-tasks/UpdateDefaultTasks';
import DeleteConfirmModal from '@/modals/categories/CategoryDeleteModal';

interface Translation {
    id: string;
    title: string;
    desc: string;
    language: string;
}

interface DefaultTask {
    id: string;
    translations: Translation[];
    createdAt: string;
}

interface ApiResponse {
    statusCode: number;
    success: boolean;
    data: {
        data: DefaultTask[];
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

export default function DefaultTasksPage() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const [tasks, setTasks] = useState<DefaultTask[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [editTask, setEditTask] = useState<DefaultTask | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get<ApiResponse>(`${baseUrl}/default-tasks/admin`, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`
                },
            });

            if (response.data.success) {
                setTasks(response.data.data.data);
                setPagination(response.data.data.meta.pagination);
            } else {
                toast.error('Maʼlumotlarni yuklashda xatolik');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await axios.delete(`${baseUrl}/default-tasks/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`
                },
            });
            setTasks(prev => prev.filter(task => task.id !== deleteId));
            setDeleteId(null);
            toast.success("Vazifa o'chirildi");
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
        }
    };

    // Title ni olish va truncate qilish
    const getUZTitle = (translations: Translation[]) => {
        const title = translations.find((t) => t.language === 'UZ')?.title || "Noma'lum";
        return title.length > 32 ? title.substring(0, 32).trim() + '...' : title;
    };

    // Description ni olish va truncate qilish
    const getUZDescription = (translations: Translation[]) => {
        const desc = translations.find((t) => t.language === 'UZ')?.desc || "Tavsif mavjud emas";
        return desc.length > 100 ? desc.substring(0, 100).trim() + '...' : desc;
    };

    const handlePageChange = (page: number) => {
        console.log('Page changed to:', page);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Standart Vazifalar</h1>
                    {pagination && (
                        <p className="text-gray-500 text-sm mt-1">
                            Jami {pagination.count} ta vazifa | Sahifada {tasks.length} ta
                        </p>
                    )}
                </div>
                <button
                    onClick={() => setOpenModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg"
                    style={{ background: 'linear-gradient(135deg, #69569F, #8B7AB8)' }}
                >
                    <AddIcon sx={{ fontSize: 20 }} />
                    <span>Qo'shish</span>
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <CircularProgress sx={{ color: '#7C6BB3' }} />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {tasks.map(task => (
                            <div key={task.id} className="relative bg-white rounded-xl p-5 shadow-md overflow-hidden">
                                {/* Edit/Delete buttons */}
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <button
                                        onClick={() => setEditTask(task)}
                                        className="p-1 text-gray-600 hover:bg-gray-100 rounded-md"
                                        title="Tahrirlash"
                                    >
                                        <EditIcon sx={{ fontSize: 16 }} />
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(task.id)}
                                        className="p-1 text-gray-600 hover:bg-gray-100 rounded-md"
                                        title="O'chirish"
                                    >
                                        <DeleteIcon sx={{ fontSize: 16 }} />
                                    </button>
                                </div>

                                <div className="flex flex-col items-center text-center mt-2">
                                    {/* Task icon */}
                                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3 flex-shrink-0">
                                        <div className="text-gray-600">
                                            <svg
                                                width="32"
                                                height="32"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M9 11l3 3L22 4"></path>
                                                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3
                                        className="text-base font-semibold text-gray-800 mb-2 w-full break-words"
                                        title={task.translations.find(t => t.language === 'UZ')?.title}
                                    >
                                        {getUZTitle(task.translations)}
                                    </h3>

                                    {/* Description */}
                                    <p
                                        className="text-xs text-gray-600 mb-2 w-full break-words min-h-[3rem]"
                                        title={task.translations.find(t => t.language === 'UZ')?.desc}
                                    >
                                        {getUZDescription(task.translations)}
                                    </p>

                                    {/* Date */}
                                    <p className="text-xs text-gray-400">
                                        {new Date(task.createdAt).toLocaleDateString('uz-UZ')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && (
                        <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
                            <span>
                                Sahifa {pagination.pageNumber} / {pagination.pageCount} | Jami: {pagination.count} ta
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

            {/* Create Modal */}
            <CreateDefaultTasksModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSuccess={fetchData}
            />

            {/* Update Modal */}
            <UpdateDefaultTasksModal
                open={!!editTask}
                onClose={() => setEditTask(null)}
                defaultTask={editTask}
                onSuccess={fetchData}
            />

            {/* Delete Modal */}
            <DeleteConfirmModal
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                message="Rostdan ham bu vazifani o'chirmoqchimisiz?"
            />
        </div>
    );
}
