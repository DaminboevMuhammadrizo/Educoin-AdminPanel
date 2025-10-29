'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from './type';

export default function LoginPage() {
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data: LoginInput) => {
        setError(null);
        setLoading(true);

        try {
            const res = await axios.post(`${baseUrl}/auth/login`, {
                phone: data.phone,
                password: data.password,
            });

            if (res.status === 200 && res.data?.data?.accessToken) {
                localStorage.setItem('accessToken', res.data.data.accessToken);
                console.log(res.data.data.accessToken)
                router.push('/');
            } else {
                setError('Noto‘g‘ri javob formati yoki foydalanuvchi topilmadi.');
            }
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 401) {
                setError('Telefon raqam yoki parol xato!');
            } else {
                setError(err.response?.data?.message || 'Tizimda xatolik yuz berdi.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{
                background: 'linear-gradient(135deg, #69569F 0%, #8B7AB8 100%)',
            }}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl"
            >
                <div className="flex flex-col items-center mb-8">
                    <div
                        className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg overflow-hidden"
                        style={{
                            background:
                                'linear-gradient(135deg, #69569F 0%, #8B7AB8 100%)',
                        }}
                    >
                        <Image
                            src="/educoin.png"
                            alt="EduCoin logo"
                            width={100}
                            height={100}
                            className="object-cover"
                        />
                    </div>
                    <h1
                        className="text-4xl font-bold mt-4"
                        style={{ color: '#69569F' }}
                    >
                        EduCoin
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Hisobingizga kiring
                    </p>
                </div>

                {/* Telefon raqam */}
                <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: '#69569F' }}
                >
                    Telefon raqam
                </label>
                <input
                    {...register('phone')}
                    defaultValue="+998"
                    placeholder="+998 90 123 45 67"
                    className={`w-full px-4 py-3 border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 mb-1 transition-all ${errors.phone
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-200 focus:border-[#69569F] focus:ring-[#69569F]/20'
                        }`}
                />
                {errors.phone && (
                    <p className="text-red-600 text-sm mb-5 flex items-center gap-1">
                        <span>⚠</span>
                        {errors.phone.message}
                    </p>
                )}
                {!errors.phone && <div className="mb-5" />}

                {/* Parol */}
                <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: '#69569F' }}
                >
                    Parol
                </label>
                <input
                    {...register('password')}
                    type="password"
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 mb-1 transition-all ${errors.password
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-200 focus:border-[#69569F] focus:ring-[#69569F]/20'
                        }`}
                />
                {errors.password && (
                    <p className="text-red-600 text-sm mb-5 flex items-center gap-1">
                        <span>⚠</span>
                        {errors.password.message}
                    </p>
                )}
                {!errors.password && <div className="mb-5" />}

                {/* Xatolik xabari */}
                {error && (
                    <div className="text-red-600 text-sm text-center mb-4">
                        ⚠ {error}
                    </div>
                )}

                {/* Tugma */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 text-white font-bold rounded-lg shadow-lg transition-all transform ${loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'hover:shadow-xl hover:scale-[1.02]'
                        }`}
                    style={{
                        background: loading
                            ? '#A9A4C1'
                            : 'linear-gradient(135deg, #69569F 0%, #8B7AB8 100%)',
                    }}
                >
                    {loading ? 'Kirish...' : 'Kirish'}
                </button>

                <div className="mt-6 text-center">
                    <a
                        href="#"
                        className="text-sm hover:underline"
                        style={{ color: '#69569F' }}
                    >
                        Parolni unutdingizmi?
                    </a>
                </div>
            </form>
        </div>
    );
}
