import '../src/index.css';
import '../src/App.css'; 

import { AuthProvider } from '../src/context/AuthContext';
import ClientWrapper from '../src/components/ClientWrapper';

export const metadata = {
  title: 'Web Steganography',
  description: 'Secure image steganography application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ClientWrapper>
            {children}
          </ClientWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}