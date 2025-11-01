'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from '@/utils/getToken';
import CircularProgress from '@mui/material/CircularProgress';
import toast from 'react-hot-toast';
import SearchIcon from '@mui/icons-material/Search';

interface User {
    id: string;
    firstname: string;
    lastname: string;
    phone: string;
}

interface Transaction {
    id: string;
    amount: number;
    user: User;
    createdAt: string;
}

export default function PaymentsPage() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        count: 0,
        pageCount: 0,
        pageNumber: 1,
        pageSize: 10
    });

    const fetchTransactions = async (page: number = 1) => {
        try {
            setLoading(true);
            const params: any = {
                pageNumber: page,
                pageSize: 10
            };

            if (searchTerm) {
                params.search = searchTerm;
            }

            const response = await axios.get(`${baseUrl}/transactions`, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    'Content-Type': 'application/json'
                },
                params
            });

            if (response.data.success && response.data.data.data) {
                setTransactions(response.data.data.data);
                setPagination(response.data.data.meta.pagination);
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
        fetchTransactions(currentPage);
    }, [currentPage]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchTransactions(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replaceAll('/', '.');
    };

    const formatAmount = (amount: number) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Foydalanuvchi ismi, familiyasi yoki telefon raqami bo'yicha qidirish..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 justify-center"
                    >
                        <SearchIcon sx={{ fontSize: 20 }} />
                        <span>Qidirish</span>
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <CircularProgress sx={{ color: '#7C6BB3' }} />
                </div>
            ) : transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-6xl mb-4">💳</div>
                    <p className="text-lg font-medium mb-2">To'lovlar topilmadi</p>
                    <p className="text-sm">Hech qanday to'lov transaktsiyasi mavjud emas</p>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Foydalanuvchi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Telefon
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Miqdor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sana
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transactions.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-medium text-sm">
                                                        {transaction.user.firstname[0]}{transaction.user.lastname[0]}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {transaction.user.firstname} {transaction.user.lastname}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{transaction.user.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-green-600">
                                                {formatAmount(transaction.amount)} so'm
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {formatDate(transaction.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-400 font-mono">
                                                {transaction.id.substring(0, 8)}...
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pagination.pageCount > 1 && (
                        <div className="flex items-center justify-between mt-6 px-4">
                            <div className="flex justify-between items-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Oldingi
                                </button>

                                <div className="flex space-x-1">
                                    {Array.from({ length: Math.min(5, pagination.pageCount) }, (_, i) => {
                                        let pageNum;
                                        if (pagination.pageCount <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= pagination.pageCount - 2) {
                                            pageNum = pagination.pageCount - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                                    currentPage === pageNum
                                                        ? 'bg-purple-600 text-white'
                                                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === pagination.pageCount}
                                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Keyingi
                                </button>
                            </div>

                            <div className="text-sm text-gray-500">
                                {pagination.pageSize * (currentPage - 1) + 1} -{' '}
                                {Math.min(pagination.pageSize * currentPage, pagination.count)} of{' '}
                                {pagination.count}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
