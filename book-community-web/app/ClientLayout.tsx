"use client";

import { Inter } from "next/font/google";
import { useEffect, useState, useRef } from "react";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Head from 'next/head';

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

export default function ClientLayout({
  children,
  isNativeAppFromHeader = false,
}: {
  children: React.ReactNode;
  isNativeAppFromHeader?: boolean;
}) {
  // 초기 상태를 서버 사이드 렌더링에서도 적용하기 위해 기본값 설정
  const [isNativeApp, setIsNativeApp] = useState(isNativeAppFromHeader);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const htmlRef = useRef<HTMLElement | null>(null);

  // 클라이언트 사이드에서 네이티브 앱 환경 감지
  useEffect(() => {
    // HTML 요소 참조 저장
    if (typeof document !== 'undefined') {
      htmlRef.current = document.documentElement;
      
      // 네이티브 앱 환경 즉시 감지 및 적용
      const isNativeAppFromWindow = typeof window !== 'undefined' && window.isNativeApp;
      const isNativeAppFromMeta = document.querySelector('meta[name="x-native-app"]')?.getAttribute('content') === 'true';
      const isNativeAppFromHtml = document.documentElement.getAttribute('data-native-app') === 'true';
      
      if (isNativeAppFromWindow || isNativeAppFromMeta || isNativeAppFromHtml || isNativeAppFromHeader) {
        setIsNativeApp(true);
        console.log('Native app environment detected immediately');
        
        // HTML 요소에 data-native-app 속성 즉시 추가
        htmlRef.current.setAttribute('data-native-app', 'true');
        htmlRef.current.classList.add('native-app-html');
        document.body.classList.add('native-app');
        
        // 네비게이션 바 즉시 숨기기
        const navElements = document.querySelectorAll('nav');
        navElements.forEach(nav => {
          const navElement = nav as HTMLElement;
          navElement.style.display = 'none';
          navElement.style.opacity = '0';
          navElement.style.visibility = 'hidden';
          navElement.style.height = '0';
          navElement.style.overflow = 'hidden';
          navElement.style.position = 'absolute';
          navElement.style.pointerEvents = 'none';
        });
        
        // 상단 고정 요소들의 위치 즉시 조정
        const fixedTopElements = document.querySelectorAll('.fixed-top, [style*="position: fixed"][style*="top"], header, nav[class*="top"], div[class*="header"], div[class*="navbar"]');
        fixedTopElements.forEach(element => {
          const fixedElement = element as HTMLElement;
          fixedElement.style.top = '0px';
        });
        
        // 메인 컨텐츠 영역 조정
        const mainElements = document.querySelectorAll('main');
        mainElements.forEach(main => {
          const mainElement = main as HTMLElement;
          mainElement.style.paddingTop = '0px';
          mainElement.style.marginTop = '0px';
        });
      }
      
      // 메타 태그 즉시 추가
      if ((isNativeAppFromWindow || isNativeAppFromHeader) && !document.querySelector('meta[name="x-native-app"]')) {
        const meta = document.createElement('meta');
        meta.name = 'x-native-app';
        meta.content = 'true';
        document.head.appendChild(meta);
      }
    }

    // 네이티브 앱 이벤트 리스너 등록
    const handleNativeAppReady = (event: Event) => {
      setIsNativeApp(true);
      console.log('Native app ready event received');
      
      // HTML 요소에 data-native-app 속성 추가
      if (htmlRef.current) {
        htmlRef.current.setAttribute('data-native-app', 'true');
        htmlRef.current.classList.add('native-app-html');
      }
      
      // body에 클래스 추가
      document.body.classList.add('native-app');
      
      // 네비게이션 바 숨기기
      const navElements = document.querySelectorAll('nav');
      navElements.forEach(nav => {
        const navElement = nav as HTMLElement;
        navElement.style.display = 'none';
        navElement.style.opacity = '0';
        navElement.style.visibility = 'hidden';
        navElement.style.height = '0';
        navElement.style.overflow = 'hidden';
        navElement.style.position = 'absolute';
        navElement.style.pointerEvents = 'none';
      });
      
      // 상단 고정 요소들의 위치 조정
      const fixedTopElements = document.querySelectorAll('.fixed-top, [style*="position: fixed"][style*="top"], header, nav[class*="top"], div[class*="header"], div[class*="navbar"]');
      fixedTopElements.forEach(element => {
        const fixedElement = element as HTMLElement;
        fixedElement.style.top = '0px';
      });
      
      // 메인 컨텐츠 영역 조정
      const mainElements = document.querySelectorAll('main');
      mainElements.forEach(main => {
        const mainElement = main as HTMLElement;
        mainElement.style.paddingTop = '0px';
        mainElement.style.marginTop = '0px';
      });
      
      // 커스텀 이벤트에서 플랫폼 정보 가져오기
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.platform) {
        if (htmlRef.current) {
          htmlRef.current.setAttribute('data-native-platform', customEvent.detail.platform);
        }
      }
    };

    // 스크롤 이벤트 처리 함수
    const handleScroll = () => {
      if (isNativeApp && window.nativeUI && window.nativeUI.notifyScroll) {
        const currentScrollY = window.scrollY;
        
        // 네이티브 앱에 스크롤 위치 알림
        window.nativeUI.notifyScroll(currentScrollY);
        
        // 스크롤 방향에 따라 헤더 표시 여부 결정
        if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
          // 아래로 스크롤 - 헤더 숨기기
          setIsHeaderVisible(false);
        } else {
          // 위로 스크롤 - 헤더 표시
          setIsHeaderVisible(true);
        }
        
        lastScrollY.current = currentScrollY;
      }
    };

    // 네이티브 앱 헤더 감지 함수 - 즉시 실행
    const checkNativeAppHeaders = () => {
      // 서버에서 전달된 헤더는 직접 접근할 수 없으므로 메타 태그를 통해 확인
      const checkHeaderInterval = setInterval(() => {
        const nativeAppMeta = document.querySelector('meta[name="x-native-app"]');
        if (nativeAppMeta) {
          console.log('Native app header detected via meta tag');
          setIsNativeApp(true);
          
          // HTML 요소에 data-native-app 속성 추가
          if (htmlRef.current) {
            htmlRef.current.setAttribute('data-native-app', 'true');
            htmlRef.current.classList.add('native-app-html');
          }
          
          // body에 native-app 클래스 추가
          document.body.classList.add('native-app');
          
          // 네비게이션 바 숨기기
          const navElements = document.querySelectorAll('nav');
          navElements.forEach(nav => {
            const navElement = nav as HTMLElement;
            navElement.style.display = 'none';
            navElement.style.opacity = '0';
            navElement.style.visibility = 'hidden';
            navElement.style.height = '0';
            navElement.style.overflow = 'hidden';
            navElement.style.position = 'absolute';
            navElement.style.pointerEvents = 'none';
          });
          
          // 상단 고정 요소들의 위치 조정
          const fixedTopElements = document.querySelectorAll('.fixed-top, [style*="position: fixed"][style*="top"], header, nav[class*="top"], div[class*="header"], div[class*="navbar"]');
          fixedTopElements.forEach(element => {
            const fixedElement = element as HTMLElement;
            fixedElement.style.top = '0px';
          });
          
          // 메인 컨텐츠 영역 조정
          const mainElements = document.querySelectorAll('main');
          mainElements.forEach(main => {
            const mainElement = main as HTMLElement;
            mainElement.style.paddingTop = '0px';
            mainElement.style.marginTop = '0px';
          });
          
          clearInterval(checkHeaderInterval);
        }
      }, 50); // 더 빠른 체크 간격
      
      // 2초 후에는 체크 중단 (더 짧은 시간으로 조정)
      setTimeout(() => {
        clearInterval(checkHeaderInterval);
      }, 2000);
    };

    window.addEventListener('nativeAppReady', handleNativeAppReady as EventListener);
    window.addEventListener('scroll', handleScroll);
    
    // 네이티브 앱 헤더 감지 즉시 실행
    checkNativeAppHeaders();

    // 초기 로딩 시 스크립트 실행
    const initialScript = `
      if (window.isNativeApp || document.documentElement.getAttribute('data-native-app') === 'true' || document.querySelector('meta[name="x-native-app"]')) {
        document.documentElement.setAttribute('data-native-app', 'true');
        document.documentElement.classList.add('native-app-html');
        document.body.classList.add('native-app');
        
        // 네비게이션 바 즉시 숨기기
        const navElements = document.querySelectorAll('nav');
        navElements.forEach(nav => {
          nav.style.display = 'none';
          nav.style.opacity = '0';
          nav.style.visibility = 'hidden';
          nav.style.height = '0';
          nav.style.overflow = 'hidden';
          nav.style.position = 'absolute';
          nav.style.pointerEvents = 'none';
        });
        
        // 상단 고정 요소들의 위치 즉시 조정
        const fixedTopElements = document.querySelectorAll('.fixed-top, [style*="position: fixed"][style*="top"], header, nav[class*="top"], div[class*="header"], div[class*="navbar"]');
        fixedTopElements.forEach(element => {
          element.style.top = '0px';
        });
        
        // 메인 컨텐츠 영역 조정
        const mainElements = document.querySelectorAll('main');
        mainElements.forEach(main => {
          main.style.paddingTop = '0px';
          main.style.marginTop = '0px';
        });
        
        // 상단 여백 즉시 조정
        document.documentElement.style.setProperty('--safe-area-top', '0px');
        document.documentElement.style.paddingTop = '0px';
        document.documentElement.style.marginTop = '0px';
        document.body.style.paddingTop = '0px';
        document.body.style.marginTop = '0px';
      }
    `;
    
    // 스크립트 즉시 실행
    const script = document.createElement('script');
    script.textContent = initialScript;
    document.head.appendChild(script);

    return () => {
      window.removeEventListener('nativeAppReady', handleNativeAppReady as EventListener);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isNativeAppFromHeader]);

  // useEffect를 사용하여 서버 사이드 렌더링과 클라이언트 사이드 렌더링 간의 일관성 유지
  useEffect(() => {
    if (isNativeApp && htmlRef.current) {
      htmlRef.current.setAttribute('data-native-app', 'true');
      htmlRef.current.classList.add('native-app-html');
      document.body.classList.add('native-app');
    }
  }, [isNativeApp]);

  return (
    <>
      <Head>
        {isNativeAppFromHeader && <meta name="x-native-app" content="true" />}
        <style dangerouslySetInnerHTML={{ __html: `
          html[data-native-app="true"] nav,
          .native-app-html nav {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            height: 0 !important;
            overflow: hidden !important;
            position: absolute !important;
            pointer-events: none !important;
          }
          
          .native-app nav {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            height: 0 !important;
            overflow: hidden !important;
            position: absolute !important;
            pointer-events: none !important;
          }
          
          /* 초기 로딩 시 레이아웃 일관성을 위한 스타일 */
          .native-app-html {
            --safe-area-top: 0px !important;
            padding-top: 0 !important;
            margin-top: 0 !important;
          }
          
          .native-app-html body {
            padding-top: 0 !important;
            margin-top: 0 !important;
          }
          
          /* 초기 로딩 시 컨텐츠 영역 조정 */
          .native-app-html main {
            padding-top: 0 !important;
            margin-top: 0 !important;
          }
          
          /* 초기 로딩 시 헤더 숨김 */
          .native-app-html .fixed-top, 
          .native-app-html [style*="position: fixed"][style*="top"],
          .native-app-html header,
          .native-app-html nav[class*="top"],
          .native-app-html div[class*="header"],
          .native-app-html div[class*="navbar"] {
            top: 0 !important;
          }
        `}} />
      </Head>
      <div className={`flex min-h-screen flex-col ${inter.className}`}>
        {!isNativeApp && <Navbar />}
        {isNativeApp && (
          <div className={`fixed top-0 left-0 right-0 z-50 bg-background ${isHeaderVisible ? 'scroll-up-header' : 'scroll-down-header'}`} style={{ display: 'none' }}>
            {/* 네이티브 앱용 헤더 (필요한 경우) */}
          </div>
        )}
        <main className={`flex-1 ${isNativeApp ? (isHeaderVisible ? 'content-with-visible-header' : 'content-with-hidden-header') : ''}`} style={isNativeApp ? { paddingTop: 0, marginTop: 0 } : undefined}>
          {children}
        </main>
        {!isNativeApp && <Footer />}
      </div>
    </>
  );
} 