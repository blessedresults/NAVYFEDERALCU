import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Navy Federal Credit Union - Sign In',
  description: 'Digital Banking Sign In',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
