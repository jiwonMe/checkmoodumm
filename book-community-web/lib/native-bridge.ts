/**
 * 네이티브 앱과 웹 앱 간의 통신을 위한 브릿지 유틸리티
 */

// 네이티브 앱 환경인지 확인
export const isNativeApp = (): boolean => {
  if (typeof window !== 'undefined') {
    return window.isNativeApp === true || 
           window.navigator.userAgent.includes('CheckMoodUMM') ||
           document.documentElement.classList.contains('native-app-html');
  }
  return false;
};

// 네이티브 앱 플랫폼 확인
export const getNativePlatform = (): 'ios' | 'android' | null => {
  if (!isNativeApp() || typeof window === 'undefined') return null;
  
  if (window.nativeAppPlatform === 'ios' || 
      window.navigator.userAgent.includes('iOS')) {
    return 'ios';
  }
  
  if (window.nativeAppPlatform === 'android' || 
      window.navigator.userAgent.includes('Android')) {
    return 'android';
  }
  
  return null;
};

// 네이티브 앱의 특정 탭으로 이동
export const navigateToNativeTab = (tabName: 'home' | 'search' | 'community' | 'mypage'): boolean => {
  if (!isNativeApp() || typeof window === 'undefined') return false;
  
  try {
    // iOS WebKit 메시지 핸들러 호출
    if (window.webkit && window.webkit.messageHandlers) {
      if (window.webkit.messageHandlers.navigation) {
        window.webkit.messageHandlers.navigation.postMessage({ tabName });
        return true;
      }
      
      if (window.webkit.messageHandlers.nativeUI) {
        window.webkit.messageHandlers.nativeUI.postMessage({ 
          type: 'navigation',
          action: 'switchTab',
          tabName 
        });
        return true;
      }
    }
    
    // Android 인터페이스 호출
    if (window.Android && typeof window.Android.navigateToTab === 'function') {
      window.Android.navigateToTab(tabName);
      return true;
    }
    
    console.warn('네이티브 앱 네비게이션 인터페이스를 찾을 수 없습니다.');
    return false;
  } catch (error) {
    console.error('네이티브 앱 네비게이션 호출 중 오류 발생:', error);
    return false;
  }
};

// 네이티브 앱에 공유 기능 요청
export const shareContent = (title: string, content: string, url: string): boolean => {
  if (!isNativeApp() || typeof window === 'undefined') return false;
  
  try {
    // iOS WebKit 메시지 핸들러 호출
    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.share) {
      window.webkit.messageHandlers.share.postMessage({ title, content, url });
      return true;
    }
    
    // Android 인터페이스 호출
    if (window.Android && typeof window.Android.shareContent === 'function') {
      window.Android.shareContent(title, content, url);
      return true;
    }
    
    console.warn('네이티브 앱 공유 인터페이스를 찾을 수 없습니다.');
    return false;
  } catch (error) {
    console.error('네이티브 앱 공유 기능 호출 중 오류 발생:', error);
    return false;
  }
};

// 타입 정의를 위한 전역 인터페이스 확장
declare global {
  interface Window {
    isNativeApp?: boolean;
    nativeAppVersion?: string;
    nativeAppPlatform?: string;
    webkit?: {
      messageHandlers: {
        [key: string]: {
          postMessage: (message: unknown) => void;
        };
      };
    };
    Android?: {
      navigateToTab?: (tabName: string) => void;
      shareContent?: (title: string, content: string, url: string) => void;
      [key: string]: unknown;
    };
  }
} 