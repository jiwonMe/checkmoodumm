import SwiftUI
import WebKit
import UserNotifications
import Network

// 로컬 IP 주소를 가져오는 함수
func getLocalIPAddress() -> String {
    #if targetEnvironment(simulator)
    // 시뮬레이터에서는 로컬 IP 주소 사용
    var address: String = "localhost"
    
    // 네트워크 인터페이스 정보 가져오기
    var ifaddr: UnsafeMutablePointer<ifaddrs>?
    guard getifaddrs(&ifaddr) == 0 else { return address }
    guard let firstAddr = ifaddr else { return address }
    
    // 인터페이스 순회
    for ifptr in sequence(first: firstAddr, next: { $0.pointee.ifa_next }) {
        let interface = ifptr.pointee
        
        // IPv4 주소만 필터링
        let addrFamily = interface.ifa_addr.pointee.sa_family
        if addrFamily == UInt8(AF_INET) {
            // en0 인터페이스 (WiFi)만 고려
            let name = String(cString: interface.ifa_name)
            if name == "en0" {
                // IP 주소 추출
                var hostname = [CChar](repeating: 0, count: Int(NI_MAXHOST))
                getnameinfo(interface.ifa_addr, socklen_t(interface.ifa_addr.pointee.sa_len),
                           &hostname, socklen_t(hostname.count),
                           nil, socklen_t(0), NI_NUMERICHOST)
                address = String(cString: hostname)
            }
        }
    }
    
    freeifaddrs(ifaddr)
    return address
    #else
    // 실제 기기에서는 개발 컴퓨터의 IP 주소 사용
    // 개발 컴퓨터의 IP 주소를 입력하세요 (ifconfig 명령어로 확인한 IP)
    return "192.168.0.37" // 개발 컴퓨터의 IP 주소로 변경하세요
    #endif
}

// WebView: WKWebView를 SwiftUI에서 사용하기 위한 UIViewRepresentable 구현
struct WebView: UIViewRepresentable {
    let url: URL
    @Binding var isLoading: Bool
    @Binding var webViewStore: WebViewStore?
    
    // WKWebView 생성
    func makeUIView(context: Context) -> WKWebView {
        // JavaScript 인터페이스 설정
        let userContentController = WKUserContentController()
        userContentController.add(context.coordinator, name: "login")
        userContentController.add(context.coordinator, name: "share")
        userContentController.add(context.coordinator, name: "notification")
        userContentController.add(context.coordinator, name: "bookInfo")
        userContentController.add(context.coordinator, name: "nativeUI") // 네이티브 UI 제어를 위한 인터페이스 추가
        
        // 웹뷰 설정
        let configuration = WKWebViewConfiguration()
        configuration.userContentController = userContentController
        
        // 네이티브 앱 정보를 웹에 전달하는 스크립트
        let script = """
        window.isNativeApp = true;
        window.nativeAppVersion = '1.0.0';
        window.nativeAppPlatform = 'ios';
        
        // 초기 로딩 시 즉시 적용되는 스타일
        (function() {
            // 네이티브 앱 표시를 위한 HTML 속성 설정
            document.documentElement.setAttribute('data-native-app', 'true');
            document.documentElement.classList.add('native-app-html');
            
            // 상단 여백 즉시 제거
            document.documentElement.style.setProperty('--safe-area-top', '0px');
            document.documentElement.style.paddingTop = '0px';
            document.documentElement.style.marginTop = '0px';
            
            // 네비게이션 바 즉시 숨기기 위한 스타일 추가
            const style = document.createElement('style');
            style.textContent = `
                :root {
                    --safe-area-top: 0px !important;
                }
                
                html, html.native-app-html, html[data-native-app="true"] {
                    --safe-area-top: 0px !important;
                    padding-top: 0 !important;
                    margin-top: 0 !important;
                }
                
                body, html.native-app-html body, html[data-native-app="true"] body {
                    padding-top: 0 !important;
                    margin-top: 0 !important;
                }
                
                main, html.native-app-html main, html[data-native-app="true"] main {
                    padding-top: 0 !important;
                    margin-top: 0 !important;
                }
                
                nav, html.native-app-html nav, html[data-native-app="true"] nav, .native-app nav { 
                    display: none !important; 
                    opacity: 0 !important;
                    visibility: hidden !important;
                    height: 0 !important;
                    overflow: hidden !important;
                    position: absolute !important;
                    pointer-events: none !important;
                }
                
                .fixed-top, [style*="position: fixed"][style*="top"], header, nav[class*="top"], div[class*="header"], div[class*="navbar"] {
                    top: 0 !important;
                }
            `;
            document.head.appendChild(style);
            
            // 메타 태그 즉시 추가
            if (!document.querySelector('meta[name="x-native-app"]')) {
                const meta = document.createElement('meta');
                meta.name = 'x-native-app';
                meta.content = 'true';
                document.head.appendChild(meta);
            }
            
            // 네비게이션 바 요소 즉시 숨기기 시도
            const navElements = document.querySelectorAll('nav');
            if (navElements.length > 0) {
                navElements.forEach(function(nav) {
                    nav.style.display = 'none';
                    nav.style.opacity = '0';
                    nav.style.visibility = 'hidden';
                    nav.style.height = '0';
                    nav.style.overflow = 'hidden';
                    nav.style.position = 'absolute';
                    nav.style.pointerEvents = 'none';
                });
            }
            
            // 상단 고정 요소들의 위치 즉시 조정
            const fixedTopElements = document.querySelectorAll('.fixed-top, [style*="position: fixed"][style*="top"], header, nav[class*="top"], div[class*="header"], div[class*="navbar"]');
            fixedTopElements.forEach(function(element) {
                element.style.top = '0px';
            });
            
            // body 스타일 즉시 적용
            document.addEventListener('DOMContentLoaded', function() {
                document.body.classList.add('native-app');
                document.body.style.paddingTop = '0px';
                document.body.style.marginTop = '0px';
                
                // 네비게이션 바 즉시 숨기기
                const navElements = document.querySelectorAll('nav');
                navElements.forEach(function(nav) {
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
                fixedTopElements.forEach(function(element) {
                    element.style.top = '0px';
                });
                
                // 메인 컨텐츠 영역 조정
                const mainElements = document.querySelectorAll('main');
                mainElements.forEach(function(main) {
                    main.style.paddingTop = '0px';
                    main.style.marginTop = '0px';
                });
            });
        })();
        
        // 네이티브 앱에서 실행 중일 때 특정 UI 요소 숨기기
        document.addEventListener('DOMContentLoaded', function() {
            // 네이티브 앱에서 실행 중임을 body에 클래스로 추가
            document.body.classList.add('native-app');
            
            // 네비게이션 바 숨기기
            const navElements = document.querySelectorAll('nav');
            navElements.forEach(function(nav) {
                nav.style.display = 'none';
                nav.style.opacity = '0';
                nav.style.visibility = 'hidden';
                nav.style.height = '0';
                nav.style.overflow = 'hidden';
                nav.style.position = 'absolute';
                nav.style.pointerEvents = 'none';
            });
            
            // 네이티브 앱에서 실행 중임을 알리는 이벤트 발생
            const nativeAppEvent = new CustomEvent('nativeAppReady', { 
                detail: { 
                    platform: 'ios',
                    version: '1.0.0'
                } 
            });
            document.dispatchEvent(nativeAppEvent);
            
            console.log('Native app environment detected and initialized');
            
            // 스크롤 위치 초기화 방지
            if (window.history && window.history.scrollRestoration) {
                window.history.scrollRestoration = 'manual';
            }
            
            // 헤더 정보 확인 및 상단 여백 조정
            const checkHeaderAndAdjustMargin = function() {
                // 서버에서 전달된 헤더 정보를 확인하는 스크립트
                const nativeAppHeader = document.querySelector('meta[name="x-native-app"]');
                if (nativeAppHeader) {
                    console.log('Native app header detected:', nativeAppHeader.getAttribute('content'));
                    
                    // 상단 여백 조정
                    document.documentElement.style.setProperty('--safe-area-top', '0px');
                    document.body.style.paddingTop = '0px';
                    document.body.style.marginTop = '0px';
                    
                    // 상단 고정 요소들의 위치 조정
                    const fixedTopElements = document.querySelectorAll('.fixed-top, [style*="position: fixed"][style*="top"]');
                    fixedTopElements.forEach(function(element) {
                        element.style.top = '0px';
                    });
                    
                    // 네비게이션 바 숨기기
                    const navElements = document.querySelectorAll('nav');
                    navElements.forEach(function(nav) {
                        nav.style.display = 'none';
                        nav.style.opacity = '0';
                        nav.style.visibility = 'hidden';
                        nav.style.height = '0';
                        nav.style.overflow = 'hidden';
                        nav.style.position = 'absolute';
                        nav.style.pointerEvents = 'none';
                    });
                }
            };
            
            // 초기 실행 및 DOM 변경 감지
            checkHeaderAndAdjustMargin();
            
            // DOM 변경 감지를 위한 MutationObserver 설정
            const observer = new MutationObserver(function(mutations) {
                checkHeaderAndAdjustMargin();
                
                // 네비게이션 바 요소가 추가되었는지 확인하고 숨기기
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes.length) {
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeName === 'NAV' || (node.nodeType === 1 && node.querySelector('nav'))) {
                                const navs = node.nodeName === 'NAV' ? [node] : node.querySelectorAll('nav');
                                navs.forEach(function(nav) {
                                    nav.style.display = 'none';
                                    nav.style.opacity = '0';
                                    nav.style.visibility = 'hidden';
                                    nav.style.height = '0';
                                    nav.style.overflow = 'hidden';
                                    nav.style.position = 'absolute';
                                    nav.style.pointerEvents = 'none';
                                });
                            }
                            
                            // 새로 추가된 고정 요소의 위치 조정
                            if (node.nodeType === 1) {
                                const fixedElements = node.querySelectorAll ? node.querySelectorAll('.fixed-top, [style*="position: fixed"][style*="top"], header, nav[class*="top"], div[class*="header"], div[class*="navbar"]') : [];
                                fixedElements.forEach(function(element) {
                                    element.style.top = '0px';
                                });
                                
                                // 요소 자체가 고정 요소인지 확인
                                if (node.classList && (
                                    node.classList.contains('fixed-top') || 
                                    (node.style && node.style.position === 'fixed' && node.style.top) ||
                                    node.nodeName === 'HEADER' ||
                                    (node.nodeName === 'NAV' && node.className.includes('top')) ||
                                    (node.nodeName === 'DIV' && (node.className.includes('header') || node.className.includes('navbar')))
                                )) {
                                    node.style.top = '0px';
                                }
                            }
                        });
                    }
                });
            });
            
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            });
            
            // 스크롤 이벤트 리스너 등록 (디바운스 처리)
            let lastScrollTime = 0;
            let isScrollPaused = false;
            
            window.addEventListener('scroll', function(e) {
                // 자동 스크롤 조정 중에는 이벤트 무시
                if (isScrollPaused) return;
                
                const now = Date.now();
                if (now - lastScrollTime > 50) { // 50ms 디바운스
                    lastScrollTime = now;
                    window.webkit.messageHandlers.nativeUI.postMessage({
                        type: 'scroll',
                        scrollY: window.scrollY
                    });
                }
            }, { passive: true });
            
            // 터치 이벤트 처리 개선
            document.addEventListener('touchstart', function() {
                // 터치 시작 시 스크롤 일시 중지 해제
                isScrollPaused = false;
            }, { passive: true });
            
            document.addEventListener('touchmove', function() {
                // 사용자가 터치로 스크롤 중일 때는 자동 스크롤 조정 방지
                isScrollPaused = true;
            }, { passive: true });
            
            document.addEventListener('touchend', function() {
                // 터치 종료 후 약간의 지연 시간 후 스크롤 일시 중지 해제
                setTimeout(function() {
                    isScrollPaused = false;
                }, 300);
            }, { passive: true });
        });
        """
        
        let userScript = WKUserScript(source: script, injectionTime: .atDocumentStart, forMainFrameOnly: true)
        userContentController.addUserScript(userScript)
        
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        
        // 웹뷰 설정 추가
        webView.scrollView.contentInsetAdjustmentBehavior = .never // 자동 컨텐츠 인셋 조정 비활성화
        webView.scrollView.automaticallyAdjustsScrollIndicatorInsets = false // 스크롤 인디케이터 인셋 자동 조정 비활성화
        webView.scrollView.bounces = true // 바운스 효과 활성화 (iOS 네이티브 느낌)
        webView.scrollView.alwaysBounceVertical = true // 수직 바운스 항상 활성화
        webView.scrollView.showsVerticalScrollIndicator = false // 수직 스크롤 인디케이터 숨기기
        webView.scrollView.decelerationRate = .normal // 일반 감속률 사용
        
        // 스크롤 위치 자동 조정 방지
        webView.scrollView.contentOffset = .zero
        
        // 쿠키 및 캐시 설정
        webView.configuration.websiteDataStore = .default()
        
        // 스와이프 뒤로가기 제스처 활성화
        webView.allowsBackForwardNavigationGestures = true
        
        // 웹뷰 저장
        let webViewStore = WebViewStore(webView: webView)
        DispatchQueue.main.async {
            self.webViewStore = webViewStore
        }
        
        return webView
    }
    
    // WKWebView 업데이트
    func updateUIView(_ webView: WKWebView, context: Context) {
        // 현재 로드된 URL과 새로 로드할 URL이 같은 경우 다시 로드하지 않음
        if let currentURL = webView.url, currentURL.absoluteString == url.absoluteString {
            return
        }
        
        // 커스텀 헤더를 포함한 요청 생성
        var request = URLRequest(url: url)
        
        // 네이티브 앱임을 알리는 커스텀 헤더 추가 - 서버 사이드에서 감지하기 위한 헤더
        request.addValue("true", forHTTPHeaderField: "X-Native-App")
        request.addValue("ios", forHTTPHeaderField: "X-Native-Platform")
        request.addValue("1.0.0", forHTTPHeaderField: "X-Native-Version")
        
        // 상단 여백 조정을 위한 헤더 추가
        request.addValue("0", forHTTPHeaderField: "X-Safe-Area-Top")
        
        webView.load(request)
    }
    
    // Coordinator 생성
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    // WebView의 이벤트를 처리하는 Coordinator 클래스
    class Coordinator: NSObject, WKNavigationDelegate, WKScriptMessageHandler {
        var parent: WebView
        
        init(_ parent: WebView) {
            self.parent = parent
        }
        
        // 페이지 로딩 시작
        func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
            parent.isLoading = true
        }
        
        // 네비게이션 시작 전 호출
        func webView(_ webView: WKWebView, didCommit navigation: WKNavigation!) {
            // 네비게이션 시작 시 처리할 작업이 있다면 여기에 추가
        }
        
        // 페이지 로딩 완료
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            parent.isLoading = false
            
            // 페이지 로딩 완료 후 스크롤 위치 초기화 방지 스크립트 실행
            let preventScrollResetScript = """
            if (window.history && window.history.scrollRestoration) {
                window.history.scrollRestoration = 'manual';
            }
            
            // 상단 여백 조정 스크립트 실행
            document.documentElement.style.setProperty('--safe-area-top', '0px');
            document.documentElement.style.paddingTop = '0px';
            document.documentElement.style.marginTop = '0px';
            document.documentElement.classList.add('native-app-html');
            document.documentElement.setAttribute('data-native-app', 'true');
            
            // body 스타일 적용
            document.body.style.paddingTop = '0px';
            document.body.style.marginTop = '0px';
            document.body.classList.add('native-app');
            
            // 상단 고정 요소들의 위치 조정
            const fixedTopElements = document.querySelectorAll('.fixed-top, [style*="position: fixed"][style*="top"], header, nav[class*="top"], div[class*="header"], div[class*="navbar"]');
            fixedTopElements.forEach(function(element) {
                element.style.top = '0px';
            });
            
            // 네이티브 앱 헤더 메타 태그 추가
            if (!document.querySelector('meta[name="x-native-app"]')) {
                const meta = document.createElement('meta');
                meta.name = 'x-native-app';
                meta.content = 'true';
                document.head.appendChild(meta);
            }
            
            // 네비게이션 바 숨기기
            const navElements = document.querySelectorAll('nav');
            navElements.forEach(function(nav) {
                nav.style.display = 'none';
                nav.style.opacity = '0';
                nav.style.visibility = 'hidden';
                nav.style.height = '0';
                nav.style.overflow = 'hidden';
                nav.style.position = 'absolute';
                nav.style.pointerEvents = 'none';
            });
            
            // 네이티브 앱 클래스 추가
            document.body.classList.add('native-app');
            document.documentElement.setAttribute('data-native-app', 'true');
            document.documentElement.classList.add('native-app-html');
            
            // 메인 컨텐츠 영역 조정
            const mainElements = document.querySelectorAll('main');
            mainElements.forEach(function(main) {
                main.style.paddingTop = '0px';
                main.style.marginTop = '0px';
            });
            
            // 네비게이션 바 숨기기 위한 스타일 추가
            if (!document.querySelector('style#native-app-style')) {
                const style = document.createElement('style');
                style.id = 'native-app-style';
                style.textContent = `
                    :root {
                        --safe-area-top: 0px !important;
                    }
                    
                    html, html.native-app-html, html[data-native-app="true"] {
                        --safe-area-top: 0px !important;
                        padding-top: 0 !important;
                        margin-top: 0 !important;
                    }
                    
                    body, html.native-app-html body, html[data-native-app="true"] body {
                        padding-top: 0 !important;
                        margin-top: 0 !important;
                    }
                    
                    main, html.native-app-html main, html[data-native-app="true"] main {
                        padding-top: 0 !important;
                        margin-top: 0 !important;
                    }
                    
                    nav, html.native-app-html nav, html[data-native-app="true"] nav, .native-app nav { 
                        display: none !important; 
                        opacity: 0 !important;
                        visibility: hidden !important;
                        height: 0 !important;
                        overflow: hidden !important;
                        position: absolute !important;
                        pointer-events: none !important;
                    }
                    
                    .fixed-top, [style*="position: fixed"][style*="top"], header, nav[class*="top"], div[class*="header"], div[class*="navbar"] {
                        top: 0 !important;
                    }
                `;
                document.head.appendChild(style);
            }
            
            // 스와이프 뒤로가기 제스처 지원을 위한 코드
            if (!window.swipeBackGestureInitialized) {
                window.swipeBackGestureInitialized = true;
                
                // 스와이프 이벤트 처리를 위한 변수
                let touchStartX = 0;
                let touchEndX = 0;
                const minSwipeDistance = 100; // 최소 스와이프 거리 (픽셀)
                const maxSwipeTime = 300; // 최대 스와이프 시간 (밀리초)
                let touchStartTime = 0;
                let touchEndTime = 0;
                
                // 터치 시작 이벤트 처리
                document.addEventListener('touchstart', function(e) {
                    touchStartX = e.changedTouches[0].screenX;
                    touchStartTime = new Date().getTime();
                }, { passive: true });
                
                // 터치 종료 이벤트 처리
                document.addEventListener('touchend', function(e) {
                    touchEndX = e.changedTouches[0].screenX;
                    touchEndTime = new Date().getTime();
                    
                    // 스와이프 거리와 시간 계산
                    const swipeDistance = touchEndX - touchStartX;
                    const swipeTime = touchEndTime - touchStartTime;
                    
                    // 왼쪽에서 오른쪽으로 스와이프하고, 최소 거리와 최대 시간 조건을 만족하면 뒤로가기
                    if (swipeDistance > minSwipeDistance && swipeTime < maxSwipeTime && touchStartX < 50) {
                        // 웹뷰에 뒤로가기 메시지 전송
                        window.webkit.messageHandlers.nativeUI.postMessage({
                            type: 'navigation',
                            action: 'back'
                        });
                    }
                }, { passive: true });
            }
            """
            webView.evaluateJavaScript(preventScrollResetScript, completionHandler: nil)
            
            // 약간의 지연 후 다시 한번 네비게이션 바 숨기기 시도
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                let hideNavScript = """
                // 네비게이션 바 숨기기 재시도
                const navElements = document.querySelectorAll('nav');
                navElements.forEach(function(nav) {
                    nav.style.display = 'none';
                    nav.style.opacity = '0';
                    nav.style.visibility = 'hidden';
                    nav.style.height = '0';
                    nav.style.overflow = 'hidden';
                    nav.style.position = 'absolute';
                    nav.style.pointerEvents = 'none';
                });
                
                // 네이티브 앱 클래스 확인 및 추가
                if (!document.body.classList.contains('native-app')) {
                    document.body.classList.add('native-app');
                }
                
                // HTML 속성 확인 및 추가
                if (!document.documentElement.hasAttribute('data-native-app')) {
                    document.documentElement.setAttribute('data-native-app', 'true');
                }
                
                if (!document.documentElement.classList.contains('native-app-html')) {
                    document.documentElement.classList.add('native-app-html');
                }
                
                // 상단 고정 요소들의 위치 조정
                const fixedTopElements = document.querySelectorAll('.fixed-top, [style*="position: fixed"][style*="top"], header, nav[class*="top"], div[class*="header"], div[class*="navbar"]');
                fixedTopElements.forEach(function(element) {
                    element.style.top = '0px';
                });
                
                // 메인 컨텐츠 영역 조정
                const mainElements = document.querySelectorAll('main');
                mainElements.forEach(function(main) {
                    main.style.paddingTop = '0px';
                    main.style.marginTop = '0px';
                });
                
                // 상단 여백 조정
                document.documentElement.style.setProperty('--safe-area-top', '0px');
                document.documentElement.style.paddingTop = '0px';
                document.documentElement.style.marginTop = '0px';
                document.body.style.paddingTop = '0px';
                document.body.style.marginTop = '0px';
                """
                webView.evaluateJavaScript(hideNavScript, completionHandler: nil)
            }
        }
        
        // 페이지 로딩 실패
        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            parent.isLoading = false
        }
        
        // 요청이 시작되기 전에 호출되는 메서드 - 커스텀 헤더 추가
        func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            // 기본 요청 가져오기
            if let originalRequest = navigationAction.request as NSURLRequest? {
                // 새로운 요청 생성
                let request = NSMutableURLRequest(url: originalRequest.url!)
                
                // 기존 헤더 복사
                if let headers = originalRequest.allHTTPHeaderFields {
                    for (key, value) in headers {
                        request.setValue(value, forHTTPHeaderField: key)
                    }
                }
                
                // 네이티브 앱임을 알리는 커스텀 헤더 추가 - 서버 사이드에서 감지하기 위한 헤더
                request.addValue("true", forHTTPHeaderField: "X-Native-App")
                request.addValue("ios", forHTTPHeaderField: "X-Native-Platform")
                request.addValue("1.0.0", forHTTPHeaderField: "X-Native-Version")
                
                // 상단 여백 조정을 위한 헤더 추가
                request.addValue("0", forHTTPHeaderField: "X-Safe-Area-Top")
                
                // 수정된 요청으로 로드
                if navigationAction.navigationType == .other {
                    decisionHandler(.allow)
                } else {
                    decisionHandler(.cancel)
                    webView.load(request as URLRequest)
                }
            } else {
                decisionHandler(.allow)
            }
        }
        
        // JavaScript에서 보낸 메시지 처리
        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            // 메시지 이름에 따라 다른 처리
            guard let messageBody = message.body as? [String: Any] else { return }
            
            switch message.name {
            case "login":
                handleLogin(messageBody)
            case "share":
                handleShare(messageBody)
            case "notification":
                handleNotification(messageBody)
            case "bookInfo":
                handleBookInfo(messageBody)
            case "nativeUI":
                handleNativeUI(messageBody)
            default:
                print("Unknown message: \(message.name)")
            }
        }
        
        // 로그인 처리
        private func handleLogin(_ data: [String: Any]) {
            guard let token = data["token"] as? String else { return }
            
            // 토큰 저장
            UserDefaults.standard.set(token, forKey: "userToken")
            
            // 로그인 상태 업데이트
            NotificationCenter.default.post(name: NSNotification.Name("UserLoggedIn"), object: nil)
        }
        
        // 공유 기능 처리
        private func handleShare(_ data: [String: Any]) {
            guard let title = data["title"] as? String,
                  let content = data["content"] as? String,
                  let url = data["url"] as? String else { return }
            
            // 공유 시트 표시
            let activityItems: [Any] = ["\(title)\n\(content)", URL(string: url)!]
            let activityVC = UIActivityViewController(activityItems: activityItems, applicationActivities: nil)
            
            // 공유 시트 표시
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
               let rootViewController = windowScene.windows.first?.rootViewController {
                rootViewController.present(activityVC, animated: true)
            }
        }
        
        // 알림 처리
        private func handleNotification(_ data: [String: Any]) {
            guard let title = data["title"] as? String,
                  let body = data["body"] as? String else { return }
            
            // 로컬 알림 생성
            let content = UNMutableNotificationContent()
            content.title = title
            content.body = body
            content.sound = .default
            
            let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
            let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: trigger)
            
            UNUserNotificationCenter.current().add(request)
        }
        
        // 도서 정보 처리
        private func handleBookInfo(_ data: [String: Any]) {
            guard let isbn = data["isbn"] as? String else { return }
            
            // 외부 API를 통해 도서 정보 가져오기
            // 실제 구현에서는 네트워크 요청 코드 추가
            print("도서 정보 요청: \(isbn)")
        }
        
        // 네이티브 UI 제어 처리
        private func handleNativeUI(_ data: [String: Any]) {
            guard let type = data["type"] as? String else { return }
            
            switch type {
            case "scroll":
                if let scrollY = data["scrollY"] as? CGFloat {
                    // 스크롤 위치에 따라 네이티브 UI 조정
                    NotificationCenter.default.post(
                        name: NSNotification.Name("WebViewScrollChanged"),
                        object: nil,
                        userInfo: ["scrollY": scrollY]
                    )
                }
            case "navigation":
                if let action = data["action"] as? String {
                    switch action {
                    case "back":
                        // 뒤로가기
                        if parent.webViewStore?.webView.canGoBack == true {
                            parent.webViewStore?.goBack()
                        }
                    case "forward":
                        // 앞으로가기
                        if parent.webViewStore?.webView.canGoForward == true {
                            parent.webViewStore?.goForward()
                        }
                    default:
                        print("Unknown navigation action: \(action)")
                    }
                }
            default:
                print("Unknown nativeUI type: \(type)")
            }
        }
        
        // 웹뷰에 JavaScript 함수 호출
        func callJavaScriptFunction(functionName: String, parameter: String, webView: WKWebView) {
            let script = "\(functionName)('\(parameter)')"
            webView.evaluateJavaScript(script) { result, error in
                if let error = error {
                    print("JavaScript 호출 오류: \(error.localizedDescription)")
                }
            }
        }
    }
}

// WebView 인스턴스를 저장하는 클래스
class WebViewStore: ObservableObject {
    let webView: WKWebView
    @Published var isNavBarHidden: Bool = false
    @Published var canGoBack: Bool = false
    @Published var canGoForward: Bool = false
    
    private var lastScrollY: CGFloat = 0
    private var scrollThreshold: CGFloat = 50
    private var isScrolling = false
    private var scrollDebounceTimer: Timer?
    private var isUserScrolling = false
    private var navigationObserver: NSKeyValueObservation?
    
    init(webView: WKWebView) {
        self.webView = webView
        
        // 스크롤 변경 알림 구독
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleScrollChange),
            name: NSNotification.Name("WebViewScrollChanged"),
            object: nil
        )
        
        // 스크롤뷰 델리게이트 설정
        webView.scrollView.delegate = ScrollViewDelegate(store: self)
        
        // 네비게이션 상태 관찰
        setupNavigationStateObserver()
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
        scrollDebounceTimer?.invalidate()
        navigationObserver?.invalidate()
    }
    
    private func setupNavigationStateObserver() {
        // canGoBack 속성 관찰
        let backObserver = webView.observe(\.canGoBack) { [weak self] webView, _ in
            DispatchQueue.main.async {
                self?.canGoBack = webView.canGoBack
            }
        }
        
        // canGoForward 속성 관찰
        let forwardObserver = webView.observe(\.canGoForward) { [weak self] webView, _ in
            DispatchQueue.main.async {
                self?.canGoForward = webView.canGoForward
            }
        }
        
        // 관찰자 저장
        navigationObserver = backObserver
    }
    
    @objc private func handleScrollChange(_ notification: Notification) {
        guard let userInfo = notification.userInfo,
              let scrollY = userInfo["scrollY"] as? CGFloat else { return }
        
        // 사용자가 직접 스크롤 중일 때는 자동 스크롤 조정 방지
        if isUserScrolling {
            return
        }
        
        // 스크롤 위치 업데이트
        lastScrollY = scrollY
        
        // 스크롤 중임을 표시
        isScrolling = true
        
        // 이전 타이머 취소
        scrollDebounceTimer?.invalidate()
        
        // 스크롤 종료 감지를 위한 디바운스 타이머 설정
        scrollDebounceTimer = Timer.scheduledTimer(withTimeInterval: 0.3, repeats: false) { [weak self] _ in
            self?.isScrolling = false
        }
    }
    
    func setUserScrolling(_ isScrolling: Bool) {
        isUserScrolling = isScrolling
    }
    
    func reload() {
        webView.reload()
    }
    
    func loadURL(_ url: URL) {
        let request = URLRequest(url: url)
        webView.load(request)
    }
    
    // 뒤로가기
    func goBack() {
        if webView.canGoBack {
            webView.goBack()
        }
    }
    
    // 앞으로가기
    func goForward() {
        if webView.canGoForward {
            webView.goForward()
        }
    }
}

// 스크롤뷰 델리게이트 클래스
class ScrollViewDelegate: NSObject, UIScrollViewDelegate {
    weak var store: WebViewStore?
    
    init(store: WebViewStore) {
        self.store = store
        super.init()
    }
    
    func scrollViewWillBeginDragging(_ scrollView: UIScrollView) {
        // 사용자가 스크롤 시작
        store?.setUserScrolling(true)
    }
    
    func scrollViewDidEndDragging(_ scrollView: UIScrollView, willDecelerate decelerate: Bool) {
        if !decelerate {
            // 감속 없이 스크롤 종료
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) { [weak self] in
                self?.store?.setUserScrolling(false)
            }
        }
    }
    
    func scrollViewDidEndDecelerating(_ scrollView: UIScrollView) {
        // 감속 후 스크롤 종료
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) { [weak self] in
            self?.store?.setUserScrolling(false)
        }
    }
} 