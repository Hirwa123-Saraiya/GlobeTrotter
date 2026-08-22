import React from 'react';
import './globals.css';
import Navbar from '../components/Navbar';
import { ThemeProvider } from '../context/ThemeContext';

export const metadata = {
  title: 'GlobeTrotter - Empowering Personalized Travel Planning',
  description: 'Personalized multi-city travel planning platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
