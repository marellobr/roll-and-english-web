import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'Roll & English — O inglês do tatame',
  description: 'Aprenda inglês praticando jiu-jitsu',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#080808] text-white min-h-screen">
        <AuthProvider>
          <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh' }}>
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}