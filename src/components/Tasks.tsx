'use client';

import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ChildIcon from '@mui/icons-material/ChildCare';

const mockTasks = {
    statusCode: 200,
    success: true,
    data: [
        {
            id: "1",
            title: "Matematika vazifasi",
            desc: "5 ta masala yechish",
            coin: 50,
            dueDate: "2025-09-21T00:00:00.000Z",
            children: [
                { id: "child1" },
                { id: "child2" }
            ]
        },
        {
            id: "2",
            title: "Kitob o'qish",
            desc: "Kuniga 10 bet kitob o'qish",
            coin: 30,
            dueDate: "2025-09-22T00:00:00.000Z",
            children: [
                { id: "child1" }
            ]
        },
        {
            id: "3",
            title: "Sport mashg'uloti",
            desc: "30 daqiqa jismoniy mashq",
            coin: 25,
            dueDate: "2025-09-23T00:00:00.000Z",
            children: [
                { id: "child1" },
                { id: "child2" },
                { id: "child3" }
            ]
        },
        {
            id: "4",
            title: "Uy vazifasi",
            desc: "Darslikdagi barcha topshiriqlar",
            coin: 40,
            dueDate: "2025-09-24T00:00:00.000Z",
            children: [
                { id: "child1" }
            ]
        },
        {
            id: "5",
            title: "Loyiha ishi",
            desc: "Science loyihasini tayyorlash",
            coin: 100,
            dueDate: "2025-09-25T00:00:00.000Z",
            children: [
                { id: "child1" },
                { id: "child2" }
            ]
        }
    ]
};

export default function TasksPage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const tasks = mockTasks.data;

    const formatDate = (date: string) => {
        if (!isClient) return '';
        return new Date(date).toLocaleDateString('uz-UZ').replaceAll('/', '.');
    };

    const handleEdit = (id: string) => console.log('Edit:', id);
    const handleDelete = (id: string) => console.log('Delete:', id);
    const handleAdd = () => console.log('Add new task');

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Vazifalar</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Jami {tasks.length} ta vazifa
                    </p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg"
                    style={{ background: 'linear-gradient(135deg, #69569F, #8B7AB8)' }}
                >
                    <AddIcon sx={{ fontSize: 20 }} />
                    <span>Qo&apos;shish</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vazifa
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tavsif
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Coin
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Muddat
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Farzandlar
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Harakatlar
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tasks.map((task) => (
                            <tr key={task.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {task.title}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-600 max-w-xs truncate">
                                        {task.desc}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-yellow-600 flex items-center gap-1">
                                        🪙 {task.coin}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">
                                        {formatDate(task.dueDate)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-blue-600 flex items-center gap-1">
                                        <ChildIcon sx={{ fontSize: 16 }} />
                                        {task.children.length} ta
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(task.id)}
                                            className="text-gray-600 hover:text-blue-600 p-1 rounded"
                                        >
                                            <EditIcon sx={{ fontSize: 18 }} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(task.id)}
                                            className="text-gray-600 hover:text-red-600 p-1 rounded"
                                        >
                                            <DeleteIcon sx={{ fontSize: 18 }} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
