import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduWave | Professional E-Learning Platform",
  description: "Next-generation educational platform for students and teachers. Learn, collaborate, and grow with EduWave.",
  keywords: "education, e-learning, online courses, AI tutor, student platform",
};

import { AuthProvider } from "@/context/AuthContext";
import NavigationHandler from "@/components/NavigationHandler";
import SecureContextPolyfill from "@/components/SecureContextPolyfill";
import CookieConsent from "@/components/CookieConsent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SecureContextPolyfill />
        <NavigationHandler />
        <AuthProvider>
          <div className="main-container">
            {children}
          </div>
        </AuthProvider>
        <CookieConsent />
      </body>
    </html>
  );
}

