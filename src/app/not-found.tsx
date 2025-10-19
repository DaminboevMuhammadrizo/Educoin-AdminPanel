'use client';

import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      <div className="text-center px-4 max-w-2xl">
        {/* Logo va Icon */}
        <div className="flex justify-center mb-8">
          <div className="bg-indigo-600 rounded-full p-6 shadow-2xl">
            <SchoolIcon sx={{ fontSize: 80, color: 'white' }} />
          </div>
        </div>

        {/* 404 raqami */}
        <div className="relative mb-8">
          <h1 className="text-[180px] font-bold text-indigo-100 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg">
              <p className="text-3xl font-bold text-indigo-900">
                Sahifa topilmadi
              </p>
            </div>
          </div>
        </div>

        {/* Matn */}
        <p className="text-gray-700 text-lg mb-4 font-medium">
          Kechirasiz, siz qidirayotgan ta&apos;lim resursi topilmadi
        </p>
        <p className="text-gray-600 mb-10">
          Bu sahifa o&apos;chirilgan, ko&apos;chirilgan yoki hech qachon mavjud bo&apos;lmagan.
          <br />
          Bosh sahifaga qaytib, o&apos;quv materiallaringizni davom ettiring!
        </p>

        {/* Tugmalar */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/"
            className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
          >
            <HomeIcon fontSize="small" />
            Bosh sahifaga qaytish
          </Link>

          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
            className="flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-gray-50 transition-all border-2 border-indigo-200 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
          >
            <ArrowBackIcon fontSize="small" />
            Orqaga
          </Link>
        </div>

        {/* Dekorativ elementlar */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-indigo-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-20 blur-xl"></div>
      </div>
    </div>
  );
}
