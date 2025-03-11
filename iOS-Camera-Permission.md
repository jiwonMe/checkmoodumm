# iOS 카메라 권한 설정 가이드

iOS 앱에서 바코드 스캐너 기능을 사용하기 위해서는 카메라 접근 권한이 필요합니다. 이 문서는 iOS 앱에서 카메라 권한을 설정하는 방법을 설명합니다.

## Info.plist 설정

1. Xcode에서 프로젝트를 열고 `Info.plist` 파일을 찾습니다.
2. 오른쪽 클릭 후 "Add Row"를 선택합니다.
3. 키 이름으로 `Privacy - Camera Usage Description` 또는 `NSCameraUsageDescription`을 입력합니다.
4. 값으로는 사용자에게 표시될 카메라 사용 목적에 대한 설명을 입력합니다.
   예: "바코드 스캔을 통해 책 정보를 검색하기 위해 카메라 접근 권한이 필요합니다."

## XML 형식으로 직접 추가

`Info.plist` 파일을 XML 형식으로 열어서 다음과 같이 추가할 수도 있습니다:

```xml
<key>NSCameraUsageDescription</key>
<string>바코드 스캔을 통해 책 정보를 검색하기 위해 카메라 접근 권한이 필요합니다.</string>
```

## 코드에서 권한 요청

AVFoundation 프레임워크를 사용하여 카메라 접근 권한을 요청하는 코드:

```swift
import AVFoundation

func requestCameraPermission() {
    AVCaptureDevice.requestAccess(for: .video) { granted in
        if granted {
            // 권한이 허용된 경우
            DispatchQueue.main.async {
                self.setupCameraSession()
            }
        } else {
            // 권한이 거부된 경우
            DispatchQueue.main.async {
                self.showCameraPermissionAlert()
            }
        }
    }
}

func showCameraPermissionAlert() {
    let alert = UIAlertController(
        title: "카메라 접근 권한이 필요합니다",
        message: "바코드 스캔을 위해 카메라 접근 권한이 필요합니다. 설정에서 권한을 허용해주세요.",
        preferredStyle: .alert
    )
    alert.addAction(UIAlertAction(title: "설정으로 이동", style: .default) { _ in
        if let url = URL(string: UIApplication.openSettingsURLString) {
            UIApplication.shared.open(url)
        }
    })
    alert.addAction(UIAlertAction(title: "취소", style: .cancel))
    present(alert, animated: true)
}
```

## 권한 상태 확인

현재 카메라 권한 상태를 확인하는 코드:

```swift
func checkCameraPermission() -> Bool {
    let status = AVCaptureDevice.authorizationStatus(for: .video)
    
    switch status {
    case .authorized:
        // 이미 권한이 허용됨
        return true
    case .notDetermined:
        // 아직 권한 요청이 이루어지지 않음
        return false
    case .denied, .restricted:
        // 권한이 거부되었거나 제한됨
        showCameraPermissionAlert()
        return false
    @unknown default:
        return false
    }
}
```

## 주의사항

1. iOS 10 이상에서는 `NSCameraUsageDescription` 키가 필수입니다. 이 키가 없으면 앱이 크래시될 수 있습니다.
2. 사용자에게 표시되는 설명은 명확하고 구체적이어야 합니다. 애플은 모호하거나 불충분한 설명이 있는 앱을 거부할 수 있습니다.
3. 사용자가 권한을 거부한 경우, 앱 설정으로 이동하여 권한을 변경할 수 있도록 안내해야 합니다.
4. 카메라 권한은 사용자가 실제로 카메라 기능을 사용하려고 할 때 요청하는 것이 좋습니다. 