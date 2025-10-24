'use client';

import React, { useEffect } from 'react';
import './globals.css';
import Navbar from '@/components/Navabar';
import Sidebar from '@/components/Sedbar';
import { usePathname, useRouter } from 'next/navigation';
import { getAccessToken } from '@/utils/getToken';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname?.startsWith('/auth');
    const router = useRouter();

    useEffect(() => {
        const token = getAccessToken();
        const isAuthPage = window.location.pathname.startsWith('/auth');

        if (!token && !isAuthPage) {
            router.push('/auth/login');
        }
    }, [router]);

    return (
        <html lang="uz">
            <body>
                {isAuthPage ? (
                    <div className="min-h-screen">
                        {children}
                    </div>
                ) : (
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
                {/* Toaster har doim rootda bo'lishi kerak */}
                <Toaster
                    position="top-right"
                    reverseOrder={false}
                    toastOptions={{
                        duration: 4000,
                        style: {
                            borderRadius: '8px',
                            padding: '12px 16px',
                            color: '#fff',
                            fontWeight: 500,
                        },
                        success: {
                            style: { background: '#22c55e' },
                        },
                        error: {
                            style: { background: '#ef4444' },
                        },
                    }}
                />
            </body>
        </html>
    );
}
