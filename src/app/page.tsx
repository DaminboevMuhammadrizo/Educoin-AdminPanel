// 'use client'

// import Navbar from '@/components/Navabar';
// import Sidebar from '@/components/Sedbar';
// import { getaccessToken } from '@/utils/getToken';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react'

// function page() {

//     const router = useRouter()

//     // // Tokeni tekshirsh !
//     // useEffect(() => {
//     //     const token = getaccessToken()

//     //     if (!token)
//     //         router.push('/auth/login')

//     // }, [router])

//     return (
//         <>
//             <Navbar/>
//             <Sidebar/>
//         </>
//     )
// }

// export default page



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
                    <p className="text-green-500 text-xs mt-2">↑ 12% o'sdi</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-semibold mb-2">Jami Vazifalar</h3>
                    <p className="text-4xl font-bold text-blue-600">456</p>
                    <p className="text-green-500 text-xs mt-2">↑ 8% o'sdi</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
                    <h3 className="text-gray-500 text-sm font-semibold mb-2">Kategoriyalar</h3>
                    <p className="text-4xl font-bold text-orange-600">12</p>
                    <p className="text-gray-400 text-xs mt-2">Barqaror</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm font-semibold mb-2">To'lovlar</h3>
                    <p className="text-4xl font-bold text-green-600">$12,450</p>
                    <p className="text-green-500 text-xs mt-2">↑ 23% o'sdi</p>
                </div>
            </div>

            {/* Faoliyat grafigi */}
            <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Oxirgi Faoliyatlar</h2>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#69569F' }}>
                                <span className="text-white font-bold">JD</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">John Doe</p>
                                <p className="text-sm text-gray-500">Yangi vazifa qo'shdi</p>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400">5 daqiqa oldin</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500">
                                <span className="text-white font-bold">SA</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">Sarah Ali</p>
                                <p className="text-sm text-gray-500">Kategoriya o'zgartirdi</p>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400">15 daqiqa oldin</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500">
                                <span className="text-white font-bold">MK</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">Mike Khan</p>
                                <p className="text-sm text-gray-500">To'lov qabul qilindi</p>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400">1 soat oldin</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
