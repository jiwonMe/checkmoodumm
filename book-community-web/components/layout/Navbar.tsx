"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// 네비게이션 링크 정의
const navLinks = [
  { href: "/home", label: "홈" },
  { href: "/search", label: "도서 검색" },
  { href: "/community", label: "커뮤니티" },
  { href: "/mypage", label: "마이페이지" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={cn(
      /* 네비게이션 바 컨테이너 */
      "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur",
    )}>
      <div className={cn(
        /* 내부 컨테이너 */
        "container flex h-16 items-center",
      )}>
        <div className={cn(
          /* 로고 영역 */
          "mr-4 flex items-center",
        )}>
          <Link href="/home" className={cn(
            /* 로고 스타일 */
            "text-xl font-bold",
          )}>
            도서 커뮤니티
          </Link>
        </div>
        <div className={cn(
          /* 메뉴 영역 */
          "flex flex-1 items-center justify-between space-x-2 md:justify-end",
        )}>
          <div className={cn(
            /* 메뉴 링크 컨테이너 */
            "flex items-center",
          )}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  /* 기본 링크 스타일 */
                  "px-4 py-2 text-sm font-medium transition-colors",
                  /* 활성 링크 스타일 */
                  pathname.startsWith(link.href)
                    ? "text-foreground"
                    : "text-foreground/60 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
} 