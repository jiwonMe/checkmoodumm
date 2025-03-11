import SwiftUI

// MainTabView: 앱의 메인 탭 인터페이스
struct MainTabView: View {
    @State private var selectedTab = 0
    
    init() {
        // 탭 바 스타일 설정
        let appearance = UITabBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = .systemBackground
        
        // 탭 바 그림자 제거
        appearance.shadowColor = .clear
        
        // 선택된 아이템 색상 설정
        appearance.stackedLayoutAppearance.selected.iconColor = .systemBlue
        appearance.stackedLayoutAppearance.selected.titleTextAttributes = [.foregroundColor: UIColor.systemBlue]
        
        // 선택되지 않은 아이템 색상 설정
        appearance.stackedLayoutAppearance.normal.iconColor = .systemGray
        appearance.stackedLayoutAppearance.normal.titleTextAttributes = [.foregroundColor: UIColor.systemGray]
        
        // 탭 바 외관 적용
        UITabBar.appearance().standardAppearance = appearance
        UITabBar.appearance().scrollEdgeAppearance = appearance
    }
    
    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem {
                    Image(systemName: "house.fill")
                    Text("홈")
                }
                .tag(0)
            
            BookSearchView()
                .tabItem {
                    Image(systemName: "magnifyingglass")
                    Text("도서 검색")
                }
                .tag(1)
            
            CommunityView()
                .tabItem {
                    Image(systemName: "person.3.fill")
                    Text("커뮤니티")
                }
                .tag(2)
            
            MyPageView()
                .tabItem {
                    Image(systemName: "person.fill")
                    Text("마이페이지")
                }
                .tag(3)
        }
        .accentColor(.blue)
        .edgesIgnoringSafeArea(.all) // 전체 화면 사용
        .onAppear {
            // 탭 전환 알림 관찰자 등록
            setupNotificationObservers()
        }
    }
    
    // 알림 관찰자 설정
    private func setupNotificationObservers() {
        // 기존 관찰자 제거
        NotificationCenter.default.removeObserver(self, name: NSNotification.Name("SwitchToTab"), object: nil)
        
        // 새 관찰자 등록
        NotificationCenter.default.addObserver(
            forName: NSNotification.Name("SwitchToTab"),
            object: nil,
            queue: .main
        ) { notification in
            if let userInfo = notification.userInfo,
               let tabIndex = userInfo["tabIndex"] as? Int {
                self.selectedTab = tabIndex
            }
        }
    }
}

// 미리보기
struct MainTabView_Previews: PreviewProvider {
    static var previews: some View {
        MainTabView()
    }
} 