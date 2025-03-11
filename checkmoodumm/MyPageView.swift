import SwiftUI
import WebKit

// MyPageView: 마이페이지 화면
struct MyPageView: View {
    @EnvironmentObject private var webViewManager: WebViewManager
    
    var body: some View {
        ZStack {
            // 미리 로드된 웹뷰 사용
            if let webViewStore = webViewManager.myPageWebViewStore {
                PreloadedWebView(webViewStore: webViewStore)
                    .edgesIgnoringSafeArea(.all) // 전체 화면 사용
            } else {
                // 웹뷰가 아직 로드되지 않은 경우 로딩 표시
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .blue))
                    .scaleEffect(1.5)
            }
            
            // 로딩 중일 때 로딩 인디케이터 표시
            if webViewManager.isMyPageLoading {
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .blue))
                    .scaleEffect(1.5)
            }
        }
    }
}

// 미리보기
struct MyPageView_Previews: PreviewProvider {
    static var previews: some View {
        MyPageView()
            .environmentObject(WebViewManager.shared)
    }
} 