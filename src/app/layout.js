import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'Roll & English',
  description: 'O inglês do tatame',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#080808] text-white" style={{ overscrollBehavior: 'none' }}>
        <AuthProvider>
          <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100dvh' }}>
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}