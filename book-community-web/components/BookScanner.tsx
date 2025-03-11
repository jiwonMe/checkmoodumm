import React, { useState, useEffect } from 'react';
import { requestBarcodeScanner, onBarcodeScanned, isNativeApp } from '../lib/native-bridge';

interface BookInfo {
  isbn: string;
  title?: string;
  author?: string;
  publisher?: string;
  coverUrl?: string;
  loading: boolean;
  error?: string;
}

const BookScanner: React.FC = () => {
  const [bookInfo, setBookInfo] = useState<BookInfo | null>(null);
  const [isNative, setIsNative] = useState<boolean>(false);

  useEffect(() => {
    // 네이티브 앱 환경인지 확인
    setIsNative(isNativeApp());

    // 바코드 스캔 결과 처리 콜백 등록
    const unsubscribe = onBarcodeScanned((isbn) => {
      handleIsbnScanned(isbn);
    });

    // 컴포넌트 언마운트 시 콜백 제거
    return () => {
      unsubscribe();
    };
  }, []);

  // ISBN으로 책 정보 조회
  const fetchBookInfo = async (isbn: string): Promise<Partial<BookInfo>> => {
    try {
      // 여기서는 예시로 Google Books API를 사용
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      const data = await response.json();

      if (data.totalItems === 0) {
        return { error: '해당 ISBN으로 책을 찾을 수 없습니다.' };
      }

      const bookData = data.items[0].volumeInfo;
      return {
        title: bookData.title,
        author: bookData.authors ? bookData.authors.join(', ') : '저자 정보 없음',
        publisher: bookData.publisher || '출판사 정보 없음',
        coverUrl: bookData.imageLinks?.thumbnail || '',
      };
    } catch (error) {
      console.error('책 정보 조회 중 오류 발생:', error);
      return { error: '책 정보를 불러오는 중 오류가 발생했습니다.' };
    }
  };

  // ISBN 스캔 결과 처리
  const handleIsbnScanned = async (isbn: string) => {
    setBookInfo({
      isbn,
      loading: true,
    });

    const bookData = await fetchBookInfo(isbn);
    
    setBookInfo(prev => {
      if (!prev) return null;
      return {
        ...prev,
        ...bookData,
        loading: false,
      };
    });
  };

  // 바코드 스캔 요청
  const handleScanButtonClick = () => {
    if (!isNative) {
      alert('이 기능은 네이티브 앱에서만 사용 가능합니다.');
      return;
    }

    requestBarcodeScanner();
  };

  return (
    <div className={cn(
      /* 컨테이너 */
      "flex flex-col items-center p-4 w-full max-w-md mx-auto",
    )}>
      <h2 className={cn(
        /* 제목 스타일 */
        "text-2xl font-bold mb-6 text-gray-800",
      )}>
        책 스캔하기
      </h2>

      <button
        onClick={handleScanButtonClick}
        disabled={!isNative}
        className={cn(
          /* 기본 버튼 스타일 */
          "w-full py-3 px-4 rounded-lg font-medium transition-colors",
          /* 네이티브 앱 여부에 따른 스타일 */
          isNative 
            ? "bg-blue-600 text-white hover:bg-blue-700" 
            : "bg-gray-300 text-gray-500 cursor-not-allowed",
        )}
      >
        {isNative ? '바코드 스캔하기' : '네이티브 앱에서만 사용 가능'}
      </button>

      {bookInfo && (
        <div className={cn(
          /* 결과 컨테이너 */
          "mt-8 w-full border border-gray-200 rounded-lg p-4",
          /* 로딩 상태에 따른 스타일 */
          bookInfo.loading ? "opacity-70" : "",
        )}>
          <div className={cn(
            /* 로딩 인디케이터 */
            "flex justify-center mb-4",
            bookInfo.loading ? "block" : "hidden",
          )}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>

          {!bookInfo.loading && (
            <>
              {bookInfo.error ? (
                <p className="text-red-500">{bookInfo.error}</p>
              ) : (
                <div className="flex flex-col md:flex-row gap-4">
                  {bookInfo.coverUrl && (
                    <div className={cn(
                      /* 책 커버 이미지 컨테이너 */
                      "flex-shrink-0 w-32 h-48 bg-gray-100 rounded overflow-hidden",
                    )}>
                      <img 
                        src={bookInfo.coverUrl} 
                        alt={`${bookInfo.title} 표지`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex-grow">
                    <h3 className={cn(
                      /* 책 제목 */
                      "text-xl font-bold text-gray-800 mb-2",
                    )}>
                      {bookInfo.title || '제목 정보 없음'}
                    </h3>
                    
                    <p className={cn(
                      /* 저자 정보 */
                      "text-gray-600 mb-1",
                    )}>
                      <span className="font-medium">저자:</span> {bookInfo.author}
                    </p>
                    
                    <p className={cn(
                      /* 출판사 정보 */
                      "text-gray-600 mb-1",
                    )}>
                      <span className="font-medium">출판사:</span> {bookInfo.publisher}
                    </p>
                    
                    <p className={cn(
                      /* ISBN 정보 */
                      "text-gray-600 mb-1",
                    )}>
                      <span className="font-medium">ISBN:</span> {bookInfo.isbn}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

// cn 유틸리티 함수 (tailwind 클래스 결합)
function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default BookScanner; 