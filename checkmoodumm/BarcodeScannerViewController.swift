import UIKit
import AVFoundation
import WebKit

class BarcodeScannerViewController: UIViewController, AVCaptureMetadataOutputObjectsDelegate {
    // MARK: - Properties
    
    private var captureSession: AVCaptureSession?
    private var previewLayer: AVCaptureVideoPreviewLayer?
    private var webView: WKWebView?
    
    // 스캔 결과 콜백
    var onScan: ((String) -> Void)?
    
    // MARK: - Lifecycle
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupUI()
        setupCaptureSession()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        // 세션 시작
        if let captureSession = captureSession, !captureSession.isRunning {
            DispatchQueue.global(qos: .background).async {
                self.captureSession?.startRunning()
            }
        }
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        
        // 세션 중지
        if let captureSession = captureSession, captureSession.isRunning {
            captureSession.stopRunning()
        }
    }
    
    // MARK: - UI Setup
    
    private func setupUI() {
        view.backgroundColor = .black
        
        // 닫기 버튼 추가
        let closeButton = UIButton(type: .system)
        closeButton.setTitle("닫기", for: .normal)
        closeButton.setTitleColor(.white, for: .normal)
        closeButton.addTarget(self, action: #selector(closeButtonTapped), for: .touchUpInside)
        
        view.addSubview(closeButton)
        closeButton.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            closeButton.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
            closeButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16)
        ])
        
        // 안내 레이블 추가
        let guideLabel = UILabel()
        guideLabel.text = "책의 바코드를 스캔해주세요"
        guideLabel.textColor = .white
        guideLabel.textAlignment = .center
        guideLabel.font = UIFont.systemFont(ofSize: 18, weight: .medium)
        
        view.addSubview(guideLabel)
        guideLabel.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            guideLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            guideLabel.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -32)
        ])
    }
    
    // MARK: - Camera Setup
    
    private func setupCaptureSession() {
        // 카메라 권한 확인
        AVCaptureDevice.requestAccess(for: .video) { [weak self] granted in
            guard granted else {
                DispatchQueue.main.async {
                    self?.showCameraPermissionAlert()
                }
                return
            }
            
            DispatchQueue.main.async {
                self?.initializeCaptureSession()
            }
        }
    }
    
    private func initializeCaptureSession() {
        captureSession = AVCaptureSession()
        
        guard let captureSession = captureSession,
              let videoCaptureDevice = AVCaptureDevice.default(for: .video) else {
            return
        }
        
        do {
            let videoInput = try AVCaptureDeviceInput(device: videoCaptureDevice)
            if captureSession.canAddInput(videoInput) {
                captureSession.addInput(videoInput)
            } else {
                failed()
                return
            }
            
            let metadataOutput = AVCaptureMetadataOutput()
            if captureSession.canAddOutput(metadataOutput) {
                captureSession.addOutput(metadataOutput)
                
                metadataOutput.setMetadataObjectsDelegate(self, queue: DispatchQueue.main)
                metadataOutput.metadataObjectTypes = [.ean13, .ean8] // ISBN은 EAN-13 형식
            } else {
                failed()
                return
            }
            
            // 프리뷰 레이어 설정
            previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
            previewLayer?.videoGravity = .resizeAspectFill
            previewLayer?.frame = view.layer.bounds
            
            if let previewLayer = previewLayer {
                view.layer.insertSublayer(previewLayer, at: 0)
            }
            
            // 세션 시작
            DispatchQueue.global(qos: .background).async {
                captureSession.startRunning()
            }
        } catch {
            failed()
        }
    }
    
    private func failed() {
        let alert = UIAlertController(
            title: "스캐너를 초기화할 수 없습니다",
            message: "카메라에 접근할 수 없습니다. 설정에서 카메라 권한을 확인해주세요.",
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "확인", style: .default))
        present(alert, animated: true)
        captureSession = nil
    }
    
    private func showCameraPermissionAlert() {
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
        alert.addAction(UIAlertAction(title: "취소", style: .cancel) { [weak self] _ in
            self?.dismiss(animated: true)
        })
        present(alert, animated: true)
    }
    
    // MARK: - Actions
    
    @objc private func closeButtonTapped() {
        dismiss(animated: true)
    }
    
    // MARK: - AVCaptureMetadataOutputObjectsDelegate
    
    func metadataOutput(_ output: AVCaptureMetadataOutput, didOutput metadataObjects: [AVMetadataObject], from connection: AVCaptureConnection) {
        // 이미 스캔된 경우 중복 처리 방지
        captureSession?.stopRunning()
        
        // 바코드 정보 추출
        if let metadataObject = metadataObjects.first as? AVMetadataMachineReadableCodeObject,
           let stringValue = metadataObject.stringValue {
            
            // 진동 피드백
            AudioServicesPlaySystemSound(SystemSoundID(kSystemSoundID_Vibrate))
            
            // ISBN 형식 확인 (EAN-13 형식의 ISBN은 978 또는 979로 시작)
            if (stringValue.hasPrefix("978") || stringValue.hasPrefix("979")) && stringValue.count == 13 {
                // 성공 알림 표시
                let alert = UIAlertController(
                    title: "바코드 스캔 성공",
                    message: "ISBN: \(stringValue)",
                    preferredStyle: .alert
                )
                alert.addAction(UIAlertAction(title: "확인", style: .default) { [weak self] _ in
                    // 콜백으로 ISBN 전달
                    DispatchQueue.main.async {
                        self?.onScan?(stringValue)
                    }
                    self?.dismiss(animated: true)
                })
                present(alert, animated: true)
            } else {
                // 유효하지 않은 ISBN인 경우
                let alert = UIAlertController(
                    title: "유효하지 않은 ISBN",
                    message: "스캔된 바코드가 유효한 ISBN 형식이 아닙니다. 다시 시도해주세요.",
                    preferredStyle: .alert
                )
                alert.addAction(UIAlertAction(title: "확인", style: .default) { [weak self] _ in
                    // 다시 스캔 시작
                    DispatchQueue.global(qos: .background).async {
                        self?.captureSession?.startRunning()
                    }
                })
                present(alert, animated: true)
            }
        } else {
            // 바코드를 인식하지 못한 경우
            let alert = UIAlertController(
                title: "바코드 인식 실패",
                message: "바코드를 인식하지 못했습니다. 다시 시도해주세요.",
                preferredStyle: .alert
            )
            alert.addAction(UIAlertAction(title: "확인", style: .default) { [weak self] _ in
                // 다시 스캔 시작
                DispatchQueue.global(qos: .background).async {
                    self?.captureSession?.startRunning()
                }
            })
            present(alert, animated: true)
        }
    }
    
    // MARK: - WebView Communication
    
    func setWebView(_ webView: WKWebView) {
        self.webView = webView
    }
    
    private func sendISBNToWebView(isbn: String) {
        // 웹뷰에 JavaScript 실행
        let jsCode = "window.handleBarcodeResult('\(isbn)');"
        webView?.evaluateJavaScript(jsCode) { result, error in
            if let error = error {
                print("JavaScript 실행 오류: \(error)")
            }
        }
    }
}

// MARK: - WKWebView Extension

extension WKWebView {
    func setupBarcodeScanner() {
        // JavaScript 인터페이스 설정
        let contentController = self.configuration.userContentController
        
        // 바코드 스캐너 메시지 핸들러 추가
        let scriptSource = """
        window.webkit.messageHandlers.barcodeScanner = {
            postMessage: function(message) {
                window.webkit.messageHandlers.nativeApp.postMessage({
                    type: 'barcodeScanner',
                    action: message.action
                });
            }
        };
        """
        
        let script = WKUserScript(source: scriptSource, injectionTime: .atDocumentStart, forMainFrameOnly: false)
        contentController.addUserScript(script)
    }
}

// MARK: - WebView Message Handler

class WebViewMessageHandler: NSObject, WKScriptMessageHandler {
    weak var viewController: UIViewController?
    weak var webView: WKWebView?
    
    init(viewController: UIViewController, webView: WKWebView) {
        self.viewController = viewController
        self.webView = webView
        super.init()
    }
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let body = message.body as? [String: Any],
              let type = body["type"] as? String else {
            return
        }
        
        if type == "barcodeScanner", let action = body["action"] as? String, action == "scan" {
            openBarcodeScanner()
        }
    }
    
    private func openBarcodeScanner() {
        let scannerVC = BarcodeScannerViewController()
        if let webView = webView {
            scannerVC.setWebView(webView)
        }
        scannerVC.modalPresentationStyle = .fullScreen
        viewController?.present(scannerVC, animated: true)
    }
}

// MARK: - Main App Integration

// AppDelegate 또는 SceneDelegate에서 WebView 설정 시 사용할 코드
/*
func setupWebView() {
    let webView = WKWebView()
    webView.setupBarcodeScanner()
    
    let messageHandler = WebViewMessageHandler(viewController: rootViewController, webView: webView)
    webView.configuration.userContentController.add(messageHandler, name: "nativeApp")
    
    // 웹뷰를 뷰 계층에 추가
    rootViewController.view.addSubview(webView)
    webView.frame = rootViewController.view.bounds
    webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    
    // 웹 앱 로드
    if let url = URL(string: "https://your-web-app-url.com") {
        webView.load(URLRequest(url: url))
    }
}
*/ 