import SwiftUI
import WebKit

// BookSearchView: 도서 검색 화면
struct BookSearchView: View {
    @EnvironmentObject private var webViewManager: WebViewManager
    
    var body: some View {
        ZStack {
            // 미리 로드된 웹뷰 사용
            if let webViewStore = webViewManager.searchWebViewStore {
                PreloadedWebView(webViewStore: webViewStore)
                    .edgesIgnoringSafeArea(.all) // 전체 화면 사용
            } else {
                // 웹뷰가 아직 로드되지 않은 경우 로딩 표시
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .blue))
                    .scaleEffect(1.5)
            }
            
            // 로딩 중일 때 로딩 인디케이터 표시
            if webViewManager.isSearchLoading {
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .blue))
                    .scaleEffect(1.5)
            }
        }
    }
}

// 미리보기
struct BookSearchView_Previews: PreviewProvider {
    static var previews: some View {
        BookSearchView()
            .environmentObject(WebViewManager.shared)
    }
} 