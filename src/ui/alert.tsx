import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
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
    </>
  );
}
