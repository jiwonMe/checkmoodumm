# 도서 커뮤니티 iOS 앱

WebView를 활용한 iOS 도서 커뮤니티 앱입니다.

## 주요 기능

- **홈**: 메인 화면으로 최신 도서 정보와 추천 도서를 표시합니다.
- **도서 검색**: 도서 제목, 저자 등으로 도서를 검색할 수 있습니다.
- **커뮤니티**: 독서 모임, 도서 리뷰, 토론 등의 커뮤니티 기능을 제공합니다.
- **마이페이지**: 사용자 프로필, 관심 도서, 작성한 글 등을 관리할 수 있습니다.

## 기술 스택

- **SwiftUI**: 모던한 UI 구현
- **WKWebView**: 웹 콘텐츠 표시
- **JavaScript 인터페이스**: 네이티브 앱과 웹 간의 통신

## 설정 방법

1. Xcode에서 프로젝트를 엽니다.
2. 다음 권한을 Info.plist에 추가합니다:
   - `NSCameraUsageDescription`: 카메라 접근 권한 (도서 스캔 기능)
   - `NSPhotoLibraryUsageDescription`: 사진 라이브러리 접근 권한 (프로필 이미지 등)
   - `NSUserNotificationsUsageDescription`: 알림 권한

3. 웹 서버 URL을 설정합니다:
   - `HomeView.swift`, `BookSearchView.swift`, `CommunityView.swift`, `MyPageView.swift` 파일에서 URL을 실제 서버 URL로 변경합니다.

## 웹-앱 통신 가이드

### 웹에서 네이티브 앱 기능 호출

```javascript
// 로그인 정보 전달
window.webkit.messageHandlers.login.postMessage({
  token: "사용자_토큰"
});

// 공유 기능
window.webkit.messageHandlers.share.postMessage({
  title: "공유 제목",
  content: "공유 내용",
  url: "https://example.com/share-url"
});

// 알림 전송
window.webkit.messageHandlers.notification.postMessage({
  title: "알림 제목",
  body: "알림 내용"
});

// 도서 정보 요청
window.webkit.messageHandlers.bookInfo.postMessage({
  isbn: "9788901234567"
});
```

### 네이티브 앱에서 웹 함수 호출

네이티브 앱에서는 `callJavaScriptFunction` 메서드를 사용하여 웹 페이지의 JavaScript 함수를 호출할 수 있습니다.

## 라이센스

MIT License 