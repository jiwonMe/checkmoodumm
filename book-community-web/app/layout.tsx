import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import ClientLayout from "@/app/ClientLayout";

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
async function getIsNativeApp() {
  try {
    const headersList = await headers();
    return headersList.get('X-Native-App') === 'true';
  } catch {
    return false;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 서버 사이드에서 네이티브 앱 환경 감지
  const isNativeAppFromHeader = await getIsNativeApp();
  
  return (
    <html lang="ko" className={`${inter.className} ${isNativeAppFromHeader ? 'native-app-html' : ''}`} data-native-app={isNativeAppFromHeader ? 'true' : 'false'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>도서 커뮤니티</title>
        <meta name="description" content="독서를 사랑하는 사람들을 위한 커뮤니티" />
        {isNativeAppFromHeader && <meta name="x-native-app" content="true" />}
      </head>
      <body className={isNativeAppFromHeader ? 'native-app' : ''}>
        <ClientLayout isNativeAppFromHeader={isNativeAppFromHeader}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
