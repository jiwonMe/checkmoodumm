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
export const navigateToNativeTab = (tabName: 'home' | 'search' | 'community' | 'mypage' | 'scan'): boolean => {
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

// 바코드 스캔 결과를 처리하기 위한 콜백 저장소
let barcodeCallbacks: Array<(isbn: string) => void> = [];

/**
 * 네이티브 앱에서 바코드 스캔 기능을 요청하는 함수
 * @returns 요청 성공 여부
 */
export const requestBarcodeScanner = (): boolean => {
  if (!isNativeApp() || typeof window === 'undefined') return false;
  
  try {
    // iOS WebKit 메시지 핸들러 호출
    if (window.webkit && window.webkit.messageHandlers) {
      if (window.webkit.messageHandlers.barcodeScanner) {
        window.webkit.messageHandlers.barcodeScanner.postMessage({ action: 'scan' });
        return true;
      }
      
      if (window.webkit.messageHandlers.nativeUI) {
        window.webkit.messageHandlers.nativeUI.postMessage({ 
          type: 'barcodeScanner',
          action: 'scan'
        });
        return true;
      }
    }
    
    // Android 인터페이스 호출
    if (window.Android && typeof window.Android.scanBarcode === 'function') {
      window.Android.scanBarcode();
      return true;
    }
    
    console.warn('네이티브 앱 바코드 스캐너 인터페이스를 찾을 수 없습니다.');
    return false;
  } catch (error) {
    console.error('네이티브 앱 바코드 스캐너 호출 중 오류 발생:', error);
    return false;
  }
};

/**
 * 바코드 스캔 결과를 받을 콜백 등록
 * @param callback 바코드 스캔 결과(ISBN)를 처리할 콜백 함수
 * @returns 콜백 제거 함수
 */
export const onBarcodeScanned = (callback: (isbn: string) => void): () => void => {
  barcodeCallbacks.push(callback);
  
  // 네이티브 앱에서 호출할 글로벌 함수 등록
  if (typeof window !== 'undefined') {
    window.handleBarcodeResult = (isbn: string) => {
      barcodeCallbacks.forEach(cb => cb(isbn));
    };
  }
  
  // 콜백 제거 함수 반환
  return () => {
    barcodeCallbacks = barcodeCallbacks.filter(cb => cb !== callback);
    
    // 모든 콜백이 제거되면 글로벌 함수도 제거
    if (barcodeCallbacks.length === 0 && typeof window !== 'undefined') {
      delete window.handleBarcodeResult;
    }
  };
};

// 타입 정의를 위한 전역 인터페이스 확장
declare global {
  interface Window {
    isNativeApp?: boolean;
    nativeAppVersion?: string;
    nativeAppPlatform?: string;
    handleBarcodeResult?: (isbn: string) => void;
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
      scanBarcode?: () => void;
      [key: string]: unknown;
    };
  }
} 