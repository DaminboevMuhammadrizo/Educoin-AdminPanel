'use client';

import React from 'react';

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteConfirmModal({ open, onClose, onConfirm }: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg w-[300px] text-center" onClick={e => e.stopPropagation()}>
                <h2 className="text-lg font-semibold mb-4">Rostdan ham o'chirmoqchimisiz?</h2>
                <div className="flex justify-around gap-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200">
                        Yo'q
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-md bg-red-600 text-white">
                        Ha
                    </button>
                </div>
            </div>
        </div>
    );
}
