import React from 'react';
import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import ClientLayout from "./ClientLayout";

// 네이티브 앱 환경에서 추가되는 window 속성 타입 정의
declare global {
  interface Window {
    isNativeApp?: boolean;
    nativeAppVersion?: string;
    nativeAppPlatform?: string;
    nativeUI?: {
      notifyScroll?: (scrollY: number) => void;
    };
  }
}

const inter = Inter({ subsets: ["latin"] });

// 서버 컴포넌트에서 헤더 확인
function getIsNativeApp() {
  try {
    const headersList = headers();
    // @ts-expect-error - headers().get은 서버 컴포넌트에서 사용 가능
    return headersList.get('X-Native-App') === 'true';
  } catch {
    return false;
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 서버 사이드에서 네이티브 앱 환경 감지
  const isNativeAppFromHeader = getIsNativeApp();
  
  return (
    <ClientLayout isNativeAppFromHeader={isNativeAppFromHeader}>
      {children}
    </ClientLayout>
  );
} 