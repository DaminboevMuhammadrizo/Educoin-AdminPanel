'use client'

import { getaccessToken } from '@/utils/getToken';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'

export default function Page() {
    const router = useRouter()

    // // Tokeni tekshirish
    // useEffect(() => {
    //     const token = getaccessToken()

    //     if (!token) {
    //         router.push('/auth/login')
    //     }
    // }, [router])

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

            {/* Statistika kartochalari */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4" style={{ borderColor: '#69569F' }}>
                    <h3 className="text-gray-500 text-sm font-semibold mb-2">Jami Foydalanuvchilar</h3>
                    <p className="text-4xl font-bold" style={{ color: '#69569F' }}>1,234</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-semibold mb-2">Jami Vazifalar</h3>
                    <p className="text-4xl font-bold text-blue-600">456</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
                    <h3 className="text-gray-500 text-sm font-semibold mb-2">Kategoriyalar</h3>
                    <p className="text-4xl font-bold text-orange-600">12</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm font-semibold mb-2">To'lovlar</h3>
                    <p className="text-4xl font-bold text-green-600">$12,450</p>
                </div>
            </div>
        </div>
    )
}
