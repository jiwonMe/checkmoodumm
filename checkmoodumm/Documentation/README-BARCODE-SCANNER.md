# 바코드 스캐너 기능 구현 가이드

이 문서는 iOS 네이티브 앱에서 카메라를 통해 바코드(ISBN)를 인식하고 웹 앱으로 전달하는 기능을 구현하는 방법을 설명합니다.

## 구현 개요

1. 웹 앱에서 네이티브 앱과 통신하기 위한 브릿지 함수 구현
2. iOS 네이티브 앱에서 바코드 스캐너 기능 구현
3. 웹 앱에서 바코드 스캔 결과를 활용하는 컴포넌트 구현
4. 네이티브 앱에 새로운 탭(scan) 추가

## 1. 웹 앱 브릿지 함수 구현

`native-bridge.ts` 파일에 다음 기능을 추가했습니다:

- `requestBarcodeScanner()`: 네이티브 앱에 바코드 스캔 기능을 요청하는 함수
- `onBarcodeScanned()`: 바코드 스캔 결과를 받을 콜백을 등록하는 함수
- `navigateToNativeTab()` 함수에 'scan' 탭 추가

## 2. iOS 네이티브 앱 구현

iOS 네이티브 앱에서는 다음 구성 요소를 구현해야 합니다:

### 2.1. 바코드 스캐너 뷰 컨트롤러

`BarcodeScannerViewController.swift` 파일에 다음 기능을 구현했습니다:

- AVFoundation을 사용한 카메라 접근 및 바코드 인식
- 스캔된 ISBN 정보를 웹뷰로 전달하는 기능
- 사용자 인터페이스 (닫기 버튼, 안내 메시지 등)

### 2.2. 웹뷰 확장 및 메시지 핸들러

- `WKWebView` 확장을 통한 JavaScript 인터페이스 설정
- `WebViewMessageHandler` 클래스를 통한 웹뷰 메시지 처리

## 3. 네이티브 앱에 새 탭 추가하기

iOS 앱의 탭바 컨트롤러에 새로운 'scan' 탭을 추가하는 방법:

### 3.1. TabBarController 수정

```swift
class MainTabBarController: UITabBarController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // 기존 탭 설정
        let homeVC = HomeViewController()
        let searchVC = SearchViewController()
        let communityVC = CommunityViewController()
        let myPageVC = MyPageViewController()
        
        // 새로운 스캔 탭 추가
        let scanVC = UIViewController() // 스캔 버튼만 있는 간단한 뷰 컨트롤러
        let scanWebView = WKWebView()
        scanWebView.setupBarcodeScanner()
        scanVC.view.addSubview(scanWebView)
        scanWebView.frame = scanVC.view.bounds
        scanWebView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        
        // 웹뷰 로드
        if let url = URL(string: "https://your-web-app-url.com/scan") {
            scanWebView.load(URLRequest(url: url))
        }
        
        // 메시지 핸들러 설정
        let messageHandler = WebViewMessageHandler(viewController: scanVC, webView: scanWebView)
        scanWebView.configuration.userContentController.add(messageHandler, name: "nativeApp")
        
        // 탭바 아이템 설정
        homeVC.tabBarItem = UITabBarItem(title: "홈", image: UIImage(named: "home"), tag: 0)
        searchVC.tabBarItem = UITabBarItem(title: "검색", image: UIImage(named: "search"), tag: 1)
        communityVC.tabBarItem = UITabBarItem(title: "커뮤니티", image: UIImage(named: "community"), tag: 2)
        scanVC.tabBarItem = UITabBarItem(title: "스캔", image: UIImage(named: "scan"), tag: 3)
        myPageVC.tabBarItem = UITabBarItem(title: "마이페이지", image: UIImage(named: "mypage"), tag: 4)
        
        // 뷰 컨트롤러 설정
        viewControllers = [homeVC, searchVC, communityVC, scanVC, myPageVC]
    }
}
```

### 3.2. 웹 앱에서 탭 처리

웹 앱에서는 URL 라우팅을 통해 `/scan` 경로에 `BookScanner` 컴포넌트를 연결합니다.

```typescript
// 라우터 설정 예시 (Next.js)
const routes = [
  { path: '/', component: Home },
  { path: '/search', component: Search },
  { path: '/community', component: Community },
  { path: '/scan', component: BookScanner }, // 새로운 스캔 페이지
  { path: '/mypage', component: MyPage },
];
```

## 4. 웹 앱에서 바코드 스캔 결과 활용

`BookScanner.tsx` 컴포넌트에서는 다음 기능을 구현했습니다:

- 바코드 스캔 요청 버튼
- 스캔된 ISBN으로 책 정보 조회 (Google Books API 활용)
- 조회된 책 정보 표시 (제목, 저자, 출판사, 표지 이미지 등)

## 5. 구현 시 주의사항

1. **카메라 권한**: iOS에서는 카메라 접근 권한을 요청해야 합니다. `Info.plist`에 `NSCameraUsageDescription` 키를 추가하고 적절한 설명을 제공해야 합니다.

2. **JavaScript 인터페이스**: 웹뷰와 네이티브 앱 간의 통신을 위한 JavaScript 인터페이스가 올바르게 설정되어 있어야 합니다.

3. **ISBN 형식**: ISBN-13 형식은 일반적으로 978 또는 979로 시작하는 13자리 숫자입니다. 바코드 스캔 결과가 이 형식에 맞는지 확인해야 합니다.

4. **오류 처리**: 카메라 접근 실패, 바코드 인식 실패, 책 정보 조회 실패 등 다양한 오류 상황에 대한 처리가 필요합니다.

## 6. 테스트 방법

1. iOS 시뮬레이터에서는 카메라를 사용할 수 없으므로 실제 기기에서 테스트해야 합니다.
2. 테스트용 ISBN 바코드 이미지를 준비하거나 실제 책의 바코드를 사용합니다.
3. 스캔 결과가 웹 앱으로 올바르게 전달되는지 확인합니다.
4. 스캔된 ISBN으로 책 정보가 올바르게 조회되는지 확인합니다.

## 7. 추가 개선 사항

- 바코드 인식 영역 시각화 (스캔 가이드라인 표시)
- 여러 형식의 바코드 지원 (QR 코드, UPC 등)
- 오프라인 모드 지원 (스캔 결과 로컬 저장)
- 스캔 기록 관리 기능
- 다크 모드 지원 