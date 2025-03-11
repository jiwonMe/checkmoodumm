"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { isNativeApp, navigateToNativeTab } from "@/lib/native-bridge";
import { cn } from "@/lib/utils";

type NativeLinkProps = {
  href: string;
  nativeTab?: "home" | "search" | "community" | "mypage";
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

/**
 * 네이티브 앱과 웹 앱 모두에서 사용할 수 있는 링크 컴포넌트
 * 네이티브 앱에서는 네이티브 탭으로 이동하고, 웹 앱에서는 일반 링크로 동작합니다.
 */
export function NativeLink({
  href,
  nativeTab,
  children,
  className,
  onClick,
}: NativeLinkProps) {
  const [isNative, setIsNative] = useState(false);
  
  // 클라이언트 사이드에서만 네이티브 앱 여부 확인
  useEffect(() => {
    setIsNative(isNativeApp());
  }, []);
  
  // 네이티브 앱에서 탭 전환 핸들러
  const handleNativeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // 사용자 정의 onClick 핸들러가 있으면 실행
    if (onClick) {
      onClick();
    }
    
    // nativeTab이 지정되어 있으면 해당 탭으로 이동
    if (nativeTab) {
      navigateToNativeTab(nativeTab);
    }
  };
  
  // 네이티브 앱 환경이면 onClick 이벤트 사용
  if (isNative && nativeTab) {
    return (
      <a 
        href={href} 
        className={cn(className)} 
        onClick={handleNativeClick}
      >
        {children}
      </a>
    );
  }
  
  // 웹 환경이거나 nativeTab이 지정되지 않은 경우 일반 링크 사용
  return (
    <Link href={href} className={cn(className)} onClick={onClick}>
      {children}
    </Link>
  );
} 