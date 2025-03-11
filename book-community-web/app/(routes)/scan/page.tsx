"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BarcodeIcon, BookOpenIcon, InfoIcon } from "lucide-react";

// 네이티브 앱 환경 확인을 위한 타입 정의
declare global {
  interface Window {
    isNativeApp?: boolean;
    webkit?: {
      messageHandlers: {
        nativeApp: {
          postMessage: (message: any) => void;
        };
        barcodeScanner?: {
          postMessage: (message: any) => void;
        };
      };
    };
    handleBarcodeResult: (isbn: string) => void;
  }
}

export default function ScanPage() {
  const [isbn, setIsbn] = useState<string>("");
  const [bookInfo, setBookInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isNativeApp, setIsNativeApp] = useState<boolean>(false);

  // 네이티브 앱 환경 확인 및 이벤트 리스너 설정
  useEffect(() => {
    // 네이티브 앱 환경 확인
    setIsNativeApp(!!window.isNativeApp);

    // 바코드 스캔 결과 처리 함수 등록
    window.handleBarcodeResult = (scannedIsbn: string) => {
      console.log("바코드 스캔 결과 수신:", scannedIsbn);
      setIsbn(scannedIsbn);
      fetchBookInfo(scannedIsbn);
    };

    // 바코드 스캔 이벤트 리스너 등록
    const handleBarcodeScanned = (event: CustomEvent) => {
      const { isbn } = event.detail;
      console.log("바코드 스캔 이벤트 수신:", isbn);
      setIsbn(isbn);
      fetchBookInfo(isbn);
    };

    // 이벤트 리스너 등록
    document.addEventListener('barcodeScanned', handleBarcodeScanned as EventListener);

    // 컴포넌트 언마운트 시 정리
    return () => {
      window.handleBarcodeResult = () => {};
      document.removeEventListener('barcodeScanned', handleBarcodeScanned as EventListener);
    };
  }, []);

  // 바코드 스캔 시작
  const startBarcodeScanner = () => {
    if (window.isNativeApp && window.webkit?.messageHandlers.nativeApp) {
      console.log("네이티브 앱에 바코드 스캔 요청");
      // 네이티브 앱에 바코드 스캔 요청
      window.webkit.messageHandlers.nativeApp.postMessage({
        type: "barcodeScanner",
        action: "start"
      });
    } else {
      // 웹 환경에서는 알림 표시
      setError("네이티브 앱에서만 바코드 스캔이 가능합니다.");
    }
  };

  // 책 정보 가져오기
  const fetchBookInfo = async (isbn: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("ISBN으로 책 정보 조회:", isbn);
      
      // 예시: 카카오 책 API 사용 (실제 구현 시 적절한 API로 대체)
      const response = await fetch(`https://dapi.kakao.com/v3/search/book?target=isbn&query=${isbn}`, {
        headers: {
          Authorization: "KakaoAK YOUR_API_KEY" // 실제 API 키로 대체 필요
        }
      });
      
      if (!response.ok) {
        throw new Error("책 정보를 가져오는데 실패했습니다.");
      }
      
      const data = await response.json();
      console.log("책 정보 응답:", data);
      
      if (data.documents && data.documents.length > 0) {
        setBookInfo(data.documents[0]);
      } else {
        setError("해당 ISBN의 책 정보를 찾을 수 없습니다.");
      }
    } catch (err) {
      console.error("책 정보 조회 오류:", err);
      setError("책 정보를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">도서 바코드 스캔</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarcodeIcon className="h-5 w-5" />
            바코드 스캔
          </CardTitle>
          <CardDescription>
            책의 ISBN 바코드를 스캔하여 도서 정보를 확인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={startBarcodeScanner} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "로딩 중..." : "바코드 스캔 시작하기"}
          </Button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md flex items-start gap-2">
              <InfoIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          {isbn && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">스캔된 ISBN:</p>
              <p className="font-mono">{isbn}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {bookInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpenIcon className="h-5 w-5" />
              도서 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {bookInfo.thumbnail && (
                <img 
                  src={bookInfo.thumbnail} 
                  alt={bookInfo.title} 
                  className="w-32 h-auto object-cover rounded-md"
                />
              )}
              <div>
                <h3 className="text-xl font-bold">{bookInfo.title}</h3>
                <p className="text-gray-600 mt-1">{bookInfo.authors?.join(", ")}</p>
                <p className="text-gray-600 mt-1">{bookInfo.publisher}</p>
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">출판일</p>
                    <p>{bookInfo.datetime ? new Date(bookInfo.datetime).toLocaleDateString() : "정보 없음"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">정가</p>
                    <p>{bookInfo.price ? `${bookInfo.price.toLocaleString()}원` : "정보 없음"}</p>
                  </div>
                </div>
                
                {bookInfo.contents && (
                  <div className="mt-4">
                    <p className="text-gray-500">소개</p>
                    <p className="text-sm mt-1">{bookInfo.contents}...</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => window.open(bookInfo.url, "_blank")}>
              상세 정보 보기
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
