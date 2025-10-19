'use client';

import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect } from 'react';

export default function NotFound() {
  // Navbar va Sidebar ni yashirish uchun
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const mainElement = document.querySelector('main');
    const navbar = document.querySelector('nav');
    const sidebar = document.querySelector('aside');

    if (mainElement) mainElement.style.display = 'none';
    if (navbar) navbar.style.display = 'none';
    if (sidebar) sidebar.style.display = 'none';

    return () => {
      document.body.style.overflow = 'auto';
      if (mainElement) mainElement.style.display = '';
      if (navbar) navbar.style.display = '';
      if (sidebar) sidebar.style.display = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center px-4">
        <div className="relative">
          <h1 className="text-[200px] font-bold text-gray-200 leading-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-2xl font-semibold text-gray-700">
              Sahifa topilmadi
            </p>
          </div>
        </div>

        <p className="text-gray-600 mt-8 text-lg max-w-md mx-auto">
          Kechirasiz, siz izlayotgan sahifa o&apos;chirilgan, nomi o&apos;zgartirilgan
          yoki vaqtincha mavjud emas.
        </p>

        <div className="mt-10 flex gap-4 justify-center flex-wrap">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
          >
            <HomeIcon fontSize="small" />
            Bosh sahifa
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition border border-gray-300 shadow-lg hover:shadow-xl"
          >
            <ArrowBackIcon fontSize="small" />
            Orqaga
          </button>
        </div>
      </div>
    </div>
  );
}
