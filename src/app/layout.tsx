// 'use client';

// import React from 'react';
// import './globals.css';
// import Navbar from '@/components/Navabar';
// import Sidebar from '@/components/Sedbar';
// import { usePathname } from 'next/navigation';

// export default function RootLayout({
//     children,
// }: {
//     children: React.ReactNode;
// }) {
//     const pathname = usePathname();

//     const isAuthPage = pathname?.startsWith('/auth');

//     return (
//         <html lang="uz">
//             <body>
//                 <div className="min-h-screen bg-gray-100">
//                     {!isAuthPage && (
//                         <>
//                             <Navbar />
//                             <Sidebar />
//                         </>
//                     )}

//                     <main className={!isAuthPage ? "ml-64 pt-[61px] min-h-screen" : ""}>
//                         <div className={!isAuthPage ? "p-6" : ""}>
//                             {children}
//                         </div>
//                     </main>
//                 </div>
//             </body>
//         </html>
//     );
// }


'use client';

import React, { useEffect } from 'react';
import './globals.css';
import Navbar from '@/components/Navabar';
import Sidebar from '@/components/Sedbar';
import { usePathname, useRouter } from 'next/navigation';
import { getaccessToken } from '@/utils/getToken';

export default function RootLayout({ children, }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const isAuthPage = pathname?.startsWith('/auth');

    const router = useRouter();

    useEffect(() => {
        const token = getaccessToken();
        const isAuthPage = window.location.pathname.startsWith('/auth');

        if (!token && !isAuthPage) {
            router.push('/auth/login');
        }
    }, [router]);



    return (
        <html lang="uz">
            <body>
                {isAuthPage ? (
                    // Auth sahifalar uchun (navbar/sidebar yo'q)
                    <div className="min-h-screen">
                        {children}
                    </div>
                ) : (
                    // Oddiy sahifalar uchun (navbar/sidebar bor)
                    <div className="min-h-screen bg-gray-100">
                        <Navbar />
                        <Sidebar />
                        <main className="ml-64 pt-[61px] min-h-screen">
                            <div className="p-6">
                                {children}
                            </div>
                        </main>
                    </div>
                )}
            </body>
        </html>
    );
}
