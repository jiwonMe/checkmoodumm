import SwiftUI
import WebKit

// HomeView: 앱의 홈 화면
struct HomeView: View {
    @EnvironmentObject private var webViewManager: WebViewManager
    
    var body: some View {
        ZStack {
            // 미리 로드된 웹뷰 사용
            if let webViewStore = webViewManager.homeWebViewStore {
                PreloadedWebView(webViewStore: webViewStore)
                    .edgesIgnoringSafeArea(.all) // 전체 화면 사용
            } else {
                // 웹뷰가 아직 로드되지 않은 경우 로딩 표시
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .blue))
                    .scaleEffect(1.5)
            }
            
            // 로딩 중일 때 로딩 인디케이터 표시
            if webViewManager.isHomeLoading {
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .blue))
                    .scaleEffect(1.5)
            }
        }
    }
}

// 미리 로드된 웹뷰를 표시하는 뷰
struct PreloadedWebView: UIViewRepresentable {
    let webViewStore: WebViewStore
    
    func makeUIView(context: Context) -> WKWebView {
        return webViewStore.webView
    }
    
    func updateUIView(_ webView: WKWebView, context: Context) {
        // 업데이트 필요 없음 - 웹뷰는 이미 로드됨
    }
}

// 미리보기
struct HomeView_Previews: PreviewProvider {
    static var previews: some View {
        HomeView()
            .environmentObject(WebViewManager.shared)
    }
} 