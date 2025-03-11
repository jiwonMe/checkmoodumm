import SwiftUI
import WebKit

// ScanView: 바코드 스캔 기능을 제공하는 뷰
struct ScanView: View {
    @ObservedObject private var webViewManager = WebViewManager.shared
    @State private var showScanner = false
    @State private var isLoading = false
    
    var body: some View {
        ZStack {
            // 웹뷰가 있으면 표시
            if let webViewStore = webViewManager.scanWebViewStore {
                WebViewWrapper(webViewStore: webViewStore, isLoading: $isLoading)
                    .edgesIgnoringSafeArea(.all)
            } else {
                // 웹뷰가 없으면 스캔 버튼 표시
                VStack(spacing: 20) {
                    Image(systemName: "barcode.viewfinder")
                        .font(.system(size: 80))
                        .foregroundColor(.blue)
                    
                    Text("바코드 스캔")
                        .font(.title)
                        .fontWeight(.bold)
                    
                    Text("책의 ISBN 바코드를 스캔하여\n도서 정보를 확인하세요")
                        .font(.body)
                        .multilineTextAlignment(.center)
                        .foregroundColor(.gray)
                        .padding(.bottom, 20)
                    
                    Button(action: {
                        showScanner = true
                    }) {
                        Text("스캔 시작하기")
                            .font(.headline)
                            .foregroundColor(.white)
                            .padding()
                            .frame(maxWidth: .infinity)
                            .background(Color.blue)
                            .cornerRadius(10)
                    }
                    .padding(.horizontal, 40)
                }
                .padding()
            }
            
            // 로딩 인디케이터
            if webViewManager.isScanLoading || isLoading {
                ProgressView()
                    .scaleEffect(1.5)
                    .progressViewStyle(CircularProgressViewStyle(tint: .blue))
                    .background(
                        RoundedRectangle(cornerRadius: 10)
                            .fill(Color.white.opacity(0.8))
                            .frame(width: 80, height: 80)
                    )
            }
        }
        .onAppear {
            // 웹뷰 초기화
            if webViewManager.scanWebViewStore == nil {
                webViewManager.initializeScanWebView()
            }
        }
        .sheet(isPresented: $showScanner) {
            BarcodeScannerView(isPresented: $showScanner) { isbn in
                // ISBN 스캔 결과 처리
                handleScannedISBN(isbn)
            }
        }
    }
    
    // ISBN 스캔 결과 처리 함수
    private func handleScannedISBN(_ isbn: String) {
        // 웹뷰에 스캔 결과 전달
        if let webView = webViewManager.scanWebViewStore?.webView {
            let jsCode = "window.handleBarcodeResult('\(isbn)');"
            webView.evaluateJavaScript(jsCode) { result, error in
                if let error = error {
                    print("JavaScript 실행 오류: \(error)")
                }
            }
        }
    }
}

// WebView 래퍼 컴포넌트
struct WebViewWrapper: View {
    let webViewStore: WebViewStore
    @Binding var isLoading: Bool
    
    var body: some View {
        GeometryReader { geometry in
            WebViewContainer(webView: webViewStore.webView)
                .frame(width: geometry.size.width, height: geometry.size.height)
                .onAppear {
                    // 웹뷰 로드 상태 모니터링
                    setupLoadingObserver()
                }
        }
    }
    
    // 웹뷰 로드 상태 모니터링 설정
    private func setupLoadingObserver() {
        let keyPath = #keyPath(WKWebView.isLoading)
        webViewStore.webView.addObserver(webViewStore, forKeyPath: keyPath, options: .new, context: nil)
        
        // 로드 상태 변경 시 isLoading 업데이트
        NotificationCenter.default.addObserver(forName: NSNotification.Name("WebViewLoadingChanged"), object: nil, queue: .main) { notification in
            if let isWebViewLoading = notification.userInfo?["isLoading"] as? Bool {
                self.isLoading = isWebViewLoading
            }
        }
    }
}

// UIViewRepresentable을 사용한 WebView 컨테이너
struct WebViewContainer: UIViewRepresentable {
    let webView: WKWebView
    
    func makeUIView(context: Context) -> WKWebView {
        // 자바스크립트 인터페이스 설정
        setupJavaScriptInterface()
        return webView
    }
    
    func updateUIView(_ uiView: WKWebView, context: Context) {
        // 업데이트 필요 없음
    }
    
    // 자바스크립트 인터페이스 설정
    private func setupJavaScriptInterface() {
        // 바코드 스캔 결과 처리 함수 주입
        let script = """
        if (!window.handleBarcodeResult) {
            window.handleBarcodeResult = function(isbn) {
                console.log('바코드 스캔 결과: ' + isbn);
                // 이벤트 발생 (웹 앱에서 이벤트 리스너로 처리)
                const event = new CustomEvent('barcodeScanned', { detail: { isbn: isbn } });
                document.dispatchEvent(event);
            };
        }
        """
        
        let userScript = WKUserScript(source: script, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
        webView.configuration.userContentController.addUserScript(userScript)
    }
}

// 바코드 스캐너 뷰 래퍼
struct BarcodeScannerView: UIViewControllerRepresentable {
    @Binding var isPresented: Bool
    var onScan: (String) -> Void
    
    func makeUIViewController(context: Context) -> UIViewController {
        let scannerVC = BarcodeScannerViewController()
        scannerVC.onScan = { isbn in
            onScan(isbn)
            isPresented = false
        }
        return scannerVC
    }
    
    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
        // 업데이트 필요 없음
    }
}

// 미리보기
struct ScanView_Previews: PreviewProvider {
    static var previews: some View {
        ScanView()
    }
} 