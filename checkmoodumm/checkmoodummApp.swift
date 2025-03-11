//
//  checkmoodummApp.swift
//  checkmoodumm
//
//  Created by Jiwon Park on 3/11/25.
//

import SwiftUI
import SwiftData
import Network

@main
struct checkmoodummApp: App {
    @State private var isNetworkAuthorized = false
    @State private var isShowingSplash = true // 스플래시 화면 표시 여부
    @StateObject private var webViewManager = WebViewManager.shared // 웹뷰 매니저
    
    var sharedModelContainer: ModelContainer = {
        let schema = Schema([
            Item.self,
        ])
        let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)

        do {
            return try ModelContainer(for: schema, configurations: [modelConfiguration])
        } catch {
            fatalError("Could not create ModelContainer: \(error)")
        }
    }()
    
    init() {
        // 로컬 네트워크 접근 권한 요청을 위한 더미 연결 시도
        let monitor = NWPathMonitor(requiredInterfaceType: .wifi)
        let queue = DispatchQueue(label: "NetworkMonitor")
        monitor.start(queue: queue)
        
        // Info.plist에 다음 키를 추가해야 합니다:
        // NSLocalNetworkUsageDescription - 로컬 네트워크 접근 권한 설명
        // NSBonjourServices - _http._tcp
        print("로컬 네트워크 접근 권한을 요청합니다.")
        
        // 네비게이션 바 완전히 제거
        UINavigationBar.appearance().isHidden = true
        
        // 상태 바 스타일 설정
        UIApplication.shared.statusBarStyle = .lightContent
        
        // 스크롤 관련 전역 설정
        UIScrollView.appearance().bounces = true
        UIScrollView.appearance().alwaysBounceVertical = true
        UIScrollView.appearance().showsVerticalScrollIndicator = false
        UIScrollView.appearance().decelerationRate = .normal
        
        // 스크롤 자동 조정 방지 설정
        UIScrollView.appearance().contentInsetAdjustmentBehavior = .never
        UIScrollView.appearance().automaticallyAdjustsScrollIndicatorInsets = false
        
        // 웹뷰 관련 설정
        if #available(iOS 15.0, *) {
            let appearance = UINavigationBarAppearance()
            appearance.configureWithTransparentBackground()
            UINavigationBar.appearance().standardAppearance = appearance
            UINavigationBar.appearance().compactAppearance = appearance
            UINavigationBar.appearance().scrollEdgeAppearance = appearance
        }
    }

    var body: some Scene {
        WindowGroup {
            ZStack {
                MainTabView()
                    .environmentObject(webViewManager) // 웹뷰 매니저를 환경 객체로 전달
                    .onAppear {
                        // 앱이 시작될 때 로컬 IP 주소 확인
                        let localIP = getLocalIPAddress()
                        print("로컬 IP 주소: \(localIP)")
                    }
                    .preferredColorScheme(.light) // 라이트 모드 강제 적용
                    .edgesIgnoringSafeArea(.all) // 전체 화면 사용
                    .opacity(isShowingSplash ? 0 : 1) // 스플래시 화면이 표시 중일 때는 투명하게 처리
                
                // 스플래시 화면이 표시되어야 할 때만 보여줌
                if isShowingSplash {
                    SplashScreen(isShowingSplash: $isShowingSplash)
                        .environmentObject(webViewManager)
                        .edgesIgnoringSafeArea(.all)
                        .zIndex(100) // 최상단에 표시
                }
            }
        }
        .modelContainer(sharedModelContainer)
    }
}
