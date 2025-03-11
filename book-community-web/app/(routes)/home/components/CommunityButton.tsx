"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { isNativeApp, navigateToNativeTab } from "@/lib/native-bridge";

export function CommunityButton() {
  const [isNative, setIsNative] = useState(false);
  
  // 클라이언트 사이드에서만 네이티브 앱 여부 확인
  useEffect(() => {
    setIsNative(isNativeApp());
  }, []);
  
  // 네이티브 앱에서 커뮤니티 탭으로 이동하는 핸들러
  const handleCommunityClick = () => {
    navigateToNativeTab("community");
  };
  
  // 네이티브 앱 환경이면 onClick 이벤트 사용, 아니면 Link 컴포넌트 사용
  if (isNative) {
    return (
      <Button 
        variant="outline" 
        size="lg" 
        onClick={handleCommunityClick}
        className={
          /* 버튼 스타일 */
          "w-full sm:w-auto"
        }
      >
        커뮤니티 참여하기
      </Button>
    );
  }
  
  // 웹 환경에서는 일반 링크 사용
  return (
    <Button asChild variant="outline" size="lg">
      <Link href="/community">커뮤니티 참여하기</Link>
    </Button>
  );
} 