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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}