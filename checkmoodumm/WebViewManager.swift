import SwiftUI
import WebKit
import Combine

// 웹뷰 관리를 위한 싱글톤 클래스
class WebViewManager: NSObject, ObservableObject, WKNavigationDelegate, WKScriptMessageHandler {
    // 싱글톤 인스턴스
    static let shared = WebViewManager()
    
    // 각 탭별 웹뷰 스토어
    @Published var homeWebViewStore: WebViewStore?
    @Published var searchWebViewStore: WebViewStore?
    @Published var communityWebViewStore: WebViewStore?
    @Published var myPageWebViewStore: WebViewStore?
    @Published var scanWebViewStore: WebViewStore?
    
    // 각 탭별 로딩 상태
    @Published var isHomeLoading = false
    @Published var isSearchLoading = false
    @Published var isCommunityLoading = false
    @Published var isMyPageLoading = false
    @Published var isScanLoading = false
    
    // 각 탭별 URL
    private var homeURL: URL?
    private var searchURL: URL?
    private var communityURL: URL?
    private var myPageURL: URL?
    private var scanURL: URL?
    
    // 초기화 완료 여부
    private var isInitialized = false
    
    // 취소 가능한 구독
    private var cancellables = Set<AnyCancellable>()
    
    // 프라이빗 생성자 (싱글톤 패턴)
    private override init() {
        super.init()
        setupURLs()
    }
    
    // URL 설정 함수
    private func setupURLs() {
        // 로컬 IP 주소를 사용하여 URL 생성
        let localIP = getLocalIPAddress()
        print("로컬 IP 주소: \(localIP)")
        
        // 기본 URL 설정 (로컬 IP가 없는 경우 localhost 사용)
        let baseURLString = localIP.isEmpty ? "http://localhost:3000" : "http://\(localIP):3000"
        
        // URL 생성 시 안전하게 처리
        if let url = URL(string: "\(baseURLString)/home") {
            self.homeURL = url
            print("홈 URL 설정: \(url)")
        } else {
            print("홈 URL 생성 실패")
        }
        
        if let url = URL(string: "\(baseURLString)/search") {
            self.searchURL = url
            print("검색 URL 설정: \(url)")
        } else {
            print("검색 URL 생성 실패")
        }
        
        if let url = URL(string: "\(baseURLString)/community") {
            self.communityURL = url
            print("커뮤니티 URL 설정: \(url)")
        } else {
            print("커뮤니티 URL 생성 실패")
        }
        
        if let url = URL(string: "\(baseURLString)/mypage") {
            self.myPageURL = url
            print("마이페이지 URL 설정: \(url)")
        } else {
            print("마이페이지 URL 생성 실패")
        }
        
        // 스캔 URL 설정
        if let url = URL(string: "\(baseURLString)/scan") {
            scanURL = url
        }
    }
    
    // 로컬 IP 주소를 가져오는 함수
    private func getLocalIPAddress() -> String {
        #if targetEnvironment(simulator)
        // 시뮬레이터에서는 로컬 IP 주소 사용
        var address: String = "localhost"
        
        do {
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
        } catch {
            print("IP 주소 가져오기 오류: \(error.localizedDescription)")
        }
        
        return address
        #else
        // 실제 기기에서는 개발 컴퓨터의 IP 주소 사용
        // 개발 컴퓨터의 IP 주소를 입력하세요 (ifconfig 명령어로 확인한 IP)
        return "192.168.0.37" // 개발 컴퓨터의 IP 주소로 변경하세요
        #endif
    }
    
    // 웹뷰 초기화 함수
    func initializeWebViews() {
        if isInitialized {
            return
        }
        
        // 각 탭별 웹뷰 초기화
        initializeTabWebViews()
        
        isInitialized = true
    }
    
    // 각 탭별 웹뷰 초기화
    private func initializeTabWebViews() {
        // 홈 웹뷰 초기화
        if homeWebViewStore == nil, let homeURL = homeURL {
            let webView = createConfiguredWebView()
            homeWebViewStore = WebViewStore(webView: webView)
            isHomeLoading = true
            webView.load(URLRequest(url: homeURL))
        }
        
        // 검색 웹뷰 초기화
        if searchWebViewStore == nil, let searchURL = searchURL {
            let webView = createConfiguredWebView()
            searchWebViewStore = WebViewStore(webView: webView)
            isSearchLoading = true
            webView.load(URLRequest(url: searchURL))
        }
        
        // 커뮤니티 웹뷰 초기화
        if communityWebViewStore == nil, let communityURL = communityURL {
            let webView = createConfiguredWebView()
            communityWebViewStore = WebViewStore(webView: webView)
            isCommunityLoading = true
            webView.load(URLRequest(url: communityURL))
        }
        
        // 마이페이지 웹뷰 초기화
        if myPageWebViewStore == nil, let myPageURL = myPageURL {
            let webView = createConfiguredWebView()
            myPageWebViewStore = WebViewStore(webView: webView)
            isMyPageLoading = true
            webView.load(URLRequest(url: myPageURL))
        }
        
        // 스캔 웹뷰 초기화
        if scanWebViewStore == nil, let scanURL = scanURL {
            let webView = createConfiguredWebView()
            scanWebViewStore = WebViewStore(webView: webView)
            isScanLoading = true
            webView.load(URLRequest(url: scanURL))
        }
    }
    
    // 설정된 웹뷰 생성
    private func createConfiguredWebView() -> WKWebView {
        let configuration = WKWebViewConfiguration()
        
        // 사용자 에이전트 설정
        let userAgent = "CheckMoodUMM-iOS/\(Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0")"
        
        // 웹뷰 생성
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.customUserAgent = userAgent
        webView.navigationDelegate = self
        
        // 자바스크립트 인터페이스 설정
        setupJavaScriptInterface(webView)
        
        return webView
    }
    
    // 자바스크립트 인터페이스 설정
    private func setupJavaScriptInterface(_ webView: WKWebView) {
        // 자바스크립트 메시지 핸들러 추가
        webView.configuration.userContentController.add(self, name: "nativeApp")
        
        // 네이티브 앱 환경 표시를 위한 스크립트 추가
        let script = """
        document.documentElement.classList.add('native-app-html');
        window.isNativeApp = true;
        window.nativeAppVersion = '\(Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0")';
        window.nativeAppPlatform = 'ios';
        
        // 바코드 스캐너 인터페이스
        window.webkit.messageHandlers.barcodeScanner = {
            postMessage: function(message) {
                window.webkit.messageHandlers.nativeApp.postMessage({
                    type: 'barcodeScanner',
                    action: message.action
                });
            }
        };
        """
        
        let userScript = WKUserScript(source: script, injectionTime: .atDocumentStart, forMainFrameOnly: true)
        webView.configuration.userContentController.addUserScript(userScript)
    }
    
    // 웹뷰 설정 생성
    private func createWebViewConfiguration() -> WKWebViewConfiguration {
        // 메인 스레드에서 실행 중인지 확인
        if !Thread.isMainThread {
            print("경고: WebKit 설정은 메인 스레드에서 생성되어야 합니다.")
            // 메인 스레드에서 다시 호출
            var configuration: WKWebViewConfiguration?
            DispatchQueue.main.sync {
                configuration = self.createWebViewConfiguration()
            }
            return configuration ?? WKWebViewConfiguration()
        }
        
        let configuration = WKWebViewConfiguration()
        let userContentController = WKUserContentController()
        
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
        })();
        """
        
        let userScript = WKUserScript(source: script, injectionTime: .atDocumentStart, forMainFrameOnly: true)
        userContentController.addUserScript(userScript)
        
        // JavaScript 인터페이스 설정 - 메시지 핸들러는 직접 WebViewManager에서 처리
        userContentController.add(self, name: "login")
        userContentController.add(self, name: "share")
        userContentController.add(self, name: "notification")
        userContentController.add(self, name: "bookInfo")
        userContentController.add(self, name: "nativeUI")
        userContentController.add(self, name: "navigation")
        
        configuration.userContentController = userContentController
        configuration.websiteDataStore = .default()
        
        // 추가 설정
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []
        configuration.preferences.javaScriptEnabled = true
        
        return configuration
    }
    
    // 웹뷰 설정
    private func configureWebView(_ webView: WKWebView) {
        // 웹뷰 설정
        webView.allowsBackForwardNavigationGestures = true
        webView.allowsLinkPreview = false
        webView.scrollView.bounces = true
        webView.scrollView.alwaysBounceVertical = true
        
        // 자바스크립트 활성화
        webView.configuration.preferences.javaScriptEnabled = true
        
        // 디버깅 메시지 설정
        if #available(iOS 16.4, *) {
            webView.isInspectable = true
        }
        
        // 웹뷰 UI 설정
        webView.backgroundColor = .white
        webView.scrollView.backgroundColor = .white
        
        // 웹뷰 컨텐츠 모드 설정
        webView.configuration.allowsInlineMediaPlayback = true
        webView.configuration.mediaTypesRequiringUserActionForPlayback = []
        
        // 웹뷰 데이터 저장 설정
        let websiteDataTypes = WKWebsiteDataStore.allWebsiteDataTypes()
        let date = Date(timeIntervalSince1970: 0)
        WKWebsiteDataStore.default().removeData(ofTypes: websiteDataTypes, modifiedSince: date) { [weak self] in
            guard let _ = self else { return }
            print("웹뷰 캐시 초기화 완료")
        }
        
        // 오류 처리를 위한 네비게이션 델리게이트 설정
        webView.navigationDelegate = self
        
        // 사용자 에이전트 설정
        webView.customUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS \(UIDevice.current.systemVersion) like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1 CheckMoodUMM/1.0"
    }
    
    // URL 로드
    private func loadURL(_ url: URL, in webView: WKWebView) {
        var request = URLRequest(url: url)
        
        // 네이티브 앱임을 알리는 커스텀 헤더 추가
        request.addValue("true", forHTTPHeaderField: "X-Native-App")
        request.addValue("ios", forHTTPHeaderField: "X-Native-Platform")
        request.addValue("1.0.0", forHTTPHeaderField: "X-Native-Version")
        
        // 상단 여백 조정을 위한 헤더 추가
        request.addValue("0", forHTTPHeaderField: "X-Safe-Area-Top")
        
        // 로드 시도 횟수 제한
        let maxRetries = 3
        var retryCount = 0
        
        func attemptLoad() {
            webView.load(request)
            
            // 로드 상태 모니터링
            DispatchQueue.main.asyncAfter(deadline: .now() + 5.0) { [weak self, weak webView] in
                guard let self = self, let webView = webView else { return }
                
                // 로드가 완료되지 않았고 재시도 횟수가 남아있는 경우
                if webView.isLoading && retryCount < maxRetries {
                    print("URL 로드 타임아웃: \(url.absoluteString), 재시도 중... (\(retryCount + 1)/\(maxRetries))")
                    webView.stopLoading()
                    retryCount += 1
                    attemptLoad()
                } else if retryCount >= maxRetries && webView.isLoading {
                    print("URL 로드 실패: \(url.absoluteString), 최대 시도 횟수 초과")
                    webView.stopLoading()
                    
                    // 로드 실패 시 빈 HTML로 대체
                    let fallbackHTML = """
                    <html>
                    <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; text-align: center; padding: 50px 20px; color: #333; }
                            h2 { color: #555; }
                            p { margin: 20px 0; line-height: 1.5; }
                            button { background: #007AFF; color: white; border: none; padding: 10px 20px; border-radius: 5px; font-size: 16px; }
                        </style>
                    </head>
                    <body>
                        <h2>연결 오류</h2>
                        <p>콘텐츠를 불러오는 중 문제가 발생했습니다.</p>
                        <button onclick="window.location.reload()">다시 시도</button>
                    </body>
                    </html>
                    """
                    webView.loadHTMLString(fallbackHTML, baseURL: nil)
                }
            }
        }
        
        // 첫 번째 로드 시도
        attemptLoad()
    }
    
    // 웹뷰 새로고침
    func refreshWebViews() {
        homeWebViewStore?.webView.reload()
        searchWebViewStore?.webView.reload()
        communityWebViewStore?.webView.reload()
        myPageWebViewStore?.webView.reload()
        scanWebViewStore?.webView.reload()
    }
    
    // 초기화 상태 확인 메서드
    func isWebViewInitialized() -> Bool {
        return isInitialized
    }
    
    // MARK: - WKNavigationDelegate 메서드
    
    // 웹뷰 로딩 시작
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        print("웹뷰 로딩 시작: \(webView.url?.absoluteString ?? "unknown")")
        
        // 로딩 상태 업데이트
        if webView == homeWebViewStore?.webView {
            isHomeLoading = true
        } else if webView == searchWebViewStore?.webView {
            isSearchLoading = true
        } else if webView == communityWebViewStore?.webView {
            isCommunityLoading = true
        } else if webView == myPageWebViewStore?.webView {
            isMyPageLoading = true
        } else if webView == scanWebViewStore?.webView {
            isScanLoading = true
        }
    }
    
    // 웹뷰 로딩 완료
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        print("웹뷰 로딩 완료: \(webView.url?.absoluteString ?? "unknown")")
        
        // 로딩 상태 업데이트
        if webView == homeWebViewStore?.webView {
            isHomeLoading = false
        } else if webView == searchWebViewStore?.webView {
            isSearchLoading = false
        } else if webView == communityWebViewStore?.webView {
            isCommunityLoading = false
        } else if webView == myPageWebViewStore?.webView {
            isMyPageLoading = false
        } else if webView == scanWebViewStore?.webView {
            isScanLoading = false
        }
        
        // 페이지 로딩 완료 후 스크립트 실행
        let script = """
        // 네이티브 앱 클래스 추가
        document.body.classList.add('native-app');
        document.documentElement.setAttribute('data-native-app', 'true');
        document.documentElement.classList.add('native-app-html');
        
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
        """
        
        webView.evaluateJavaScript(script, completionHandler: nil)
    }
    
    // 웹뷰 로딩 실패
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print("웹뷰 로딩 실패: \(webView.url?.absoluteString ?? "unknown"), 오류: \(error.localizedDescription)")
        
        // 로딩 상태 업데이트
        if webView == homeWebViewStore?.webView {
            isHomeLoading = false
        } else if webView == searchWebViewStore?.webView {
            isSearchLoading = false
        } else if webView == communityWebViewStore?.webView {
            isCommunityLoading = false
        } else if webView == myPageWebViewStore?.webView {
            isMyPageLoading = false
        } else if webView == scanWebViewStore?.webView {
            isScanLoading = false
        }
    }
    
    // MARK: - WKScriptMessageHandler 메서드
    
    // JavaScript에서 보낸 메시지 처리
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        // 메시지 처리
        guard let body = message.body as? [String: Any] else {
            print("메시지 형식 오류")
            return
        }
        
        // 메시지 타입 확인
        if let type = body["type"] as? String {
            switch type {
            case "barcodeScanner":
                // 바코드 스캐너 관련 메시지 처리
                handleBarcodeScannerMessage(body)
            default:
                print("알 수 없는 메시지 타입: \(type)")
            }
        }
    }
    
    // 바코드 스캐너 메시지 처리
    private func handleBarcodeScannerMessage(_ message: [String: Any]) {
        // 액션 확인
        guard let action = message["action"] as? String else {
            print("바코드 스캐너 액션 누락")
            return
        }
        
        // 액션에 따른 처리
        switch action {
        case "start":
            // 메인 스레드에서 실행
            DispatchQueue.main.async {
                // 스캔 뷰 컨트롤러 표시
                if let rootViewController = UIApplication.shared.windows.first?.rootViewController {
                    let scannerVC = BarcodeScannerViewController()
                    scannerVC.onScan = { [weak self] isbn in
                        // 스캔 결과를 웹뷰에 전달
                        self?.sendISBNToWebView(isbn)
                    }
                    rootViewController.present(scannerVC, animated: true)
                }
            }
        default:
            print("알 수 없는 바코드 스캐너 액션: \(action)")
        }
    }
    
    // 스캔 결과를 웹뷰에 전달
    private func sendISBNToWebView(_ isbn: String) {
        // 스캔 웹뷰에 결과 전달
        if let webView = scanWebViewStore?.webView {
            let jsCode = "window.handleBarcodeResult('\(isbn)');"
            webView.evaluateJavaScript(jsCode) { result, error in
                if let error = error {
                    print("JavaScript 실행 오류: \(error)")
                }
            }
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
                    // 뒤로가기 처리
                    break
                case "forward":
                    // 앞으로가기 처리
                    break
                case "switchTab":
                    if let tabName = data["tabName"] as? String {
                        switchToNativeTab(tabName: tabName)
                    }
                default:
                    print("Unknown navigation action: \(action)")
                }
            }
        default:
            print("Unknown nativeUI type: \(type)")
        }
    }
    
    // 네비게이션 처리
    private func handleNavigation(_ data: [String: Any]) {
        if let tabName = data["tabName"] as? String {
            switchToNativeTab(tabName: tabName)
        }
    }
    
    // 네이티브 탭 전환 함수
    private func switchToNativeTab(tabName: String) {
        var tabIndex = 0
        
        switch tabName.lowercased() {
        case "home":
            tabIndex = 0
        case "search":
            tabIndex = 1
        case "community":
            tabIndex = 2
        case "mypage":
            tabIndex = 3
        default:
            print("Unknown tab name: \(tabName)")
            return
        }
        
        // 메인 스레드에서 탭 전환 알림 발송
        DispatchQueue.main.async {
            NotificationCenter.default.post(
                name: NSNotification.Name("SwitchToTab"),
                object: nil,
                userInfo: ["tabIndex": tabIndex]
            )
        }
    }
    
    // 스캔 웹뷰 초기화
    func initializeScanWebView() {
        // 이미 초기화된 경우 리턴
        if scanWebViewStore != nil {
            return
        }
        
        // 스캔 URL 확인
        guard let scanURL = scanURL else {
            print("스캔 URL이 설정되지 않았습니다.")
            return
        }
        
        // 웹뷰 생성
        let webView = createConfiguredWebView()
        scanWebViewStore = WebViewStore(webView: webView)
        
        // 로딩 상태 설정
        isScanLoading = true
        
        // URL 로드
        webView.load(URLRequest(url: scanURL))
        
        print("스캔 웹뷰 초기화 완료: \(scanURL)")
    }
} 