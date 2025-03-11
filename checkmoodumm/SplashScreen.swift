import SwiftUI

struct SplashScreen: View {
    @Binding var isShowingSplash: Bool
    @EnvironmentObject var webViewManager: WebViewManager
    
    // 로딩 상태 관리
    @State private var isLoading = true
    @State private var loadingProgress: Double = 0.0
    @State private var loadingText = "초기화 중..."
    @State private var initializationFailed = false
    
    // 애니메이션 상태
    @State private var scale: CGFloat = 0.8
    @State private var opacity: Double = 0
    
    var body: some View {
        ZStack {
            // 그라데이션 배경
            LinearGradient(
                gradient: Gradient(colors: [Color(#colorLiteral(red: 0.2196078449, green: 0.007843137719, blue: 0.8549019694, alpha: 1)), Color(#colorLiteral(red: 0.2588235438, green: 0.7568627596, blue: 0.9686274529, alpha: 1))]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .edgesIgnoringSafeArea(.all)
            
            VStack(spacing: 30) {
                // 앱 로고
                Image(systemName: "heart.fill")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 100, height: 100)
                    .foregroundColor(.white)
                    .scaleEffect(scale)
                    .opacity(opacity)
                
                // 앱 이름
                Text("Check Mood UMM")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                    .opacity(opacity)
                
                if isLoading {
                    VStack(spacing: 15) {
                        // 로딩 프로그레스 바
                        ProgressView(value: loadingProgress, total: 1.0)
                            .progressViewStyle(LinearProgressViewStyle(tint: .white))
                            .frame(width: 200)
                        
                        // 로딩 텍스트
                        Text(loadingText)
                            .font(.caption)
                            .foregroundColor(.white)
                    }
                    .opacity(opacity)
                }
                
                // 초기화 실패 시 재시도 버튼
                if initializationFailed {
                    Button(action: {
                        retryInitialization()
                    }) {
                        Text("다시 시도")
                            .fontWeight(.semibold)
                            .foregroundColor(.white)
                            .padding(.horizontal, 30)
                            .padding(.vertical, 10)
                            .background(Color.blue.opacity(0.7))
                            .cornerRadius(8)
                    }
                    .opacity(opacity)
                }
            }
        }
        .onAppear {
            // 애니메이션 시작
            withAnimation(.easeOut(duration: 0.8)) {
                scale = 1.0
                opacity = 1.0
            }
            
            // 웹뷰 초기화 시작
            initializeWebViews()
        }
    }
    
    // 웹뷰 초기화 함수
    private func initializeWebViews() {
        isLoading = true
        loadingProgress = 0.0
        initializationFailed = false
        
        // 진행 상황 업데이트를 위한 타이머
        let progressTimer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { timer in
            // 최대 80%까지만 자동 진행 (실제 완료는 초기화 완료 후 100%로 설정)
            if self.loadingProgress < 0.8 {
                self.loadingProgress += 0.01
            }
        }
        
        // 메인 스레드에서 웹뷰 초기화 (WebKit은 메인 스레드에서 초기화해야 함)
        DispatchQueue.main.async {
            // 초기화 시작
            self.loadingText = "웹뷰 초기화 중..."
            
            // 웹뷰 초기화 시도
            self.webViewManager.initializeWebViews()
            
            // 타이머 중지
            progressTimer.invalidate()
            
            if self.webViewManager.isWebViewInitialized() {
                // 초기화 성공
                self.loadingText = "초기화 완료"
                self.loadingProgress = 1.0
                
                // 잠시 후 스플래시 화면 종료
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    withAnimation(.easeIn(duration: 0.5)) {
                        self.isShowingSplash = false
                    }
                }
            } else {
                // 초기화 실패
                self.loadingText = "초기화 실패"
                self.initializationFailed = true
            }
        }
    }
    
    // 초기화 재시도
    private func retryInitialization() {
        initializeWebViews()
    }
}

// 미리보기
struct SplashScreen_Previews: PreviewProvider {
    static var previews: some View {
        SplashScreen(isShowingSplash: .constant(true))
            .environmentObject(WebViewManager.shared)
    }
} 