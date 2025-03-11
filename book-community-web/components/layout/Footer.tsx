import Link from "next/link";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className={cn(
      /* 푸터 컨테이너 */
      "border-t bg-background/95",
    )}>
      <div className={cn(
        /* 내부 컨테이너 */
        "container py-8 md:py-12",
      )}>
        <div className={cn(
          /* 콘텐츠 그리드 */
          "grid grid-cols-1 gap-8 md:grid-cols-4",
        )}>
          <div className={cn(
            /* 로고 및 설명 영역 */
            "flex flex-col",
          )}>
            <Link href="/home" className={cn(
              /* 로고 스타일 */
              "text-xl font-bold",
            )}>
              도서 커뮤니티
            </Link>
            <p className={cn(
              /* 설명 텍스트 */
              "mt-2 text-sm text-muted-foreground",
            )}>
              독서를 사랑하는 사람들을 위한 커뮤니티입니다.
            </p>
          </div>
          
          <div className={cn(
            /* 링크 섹션 */
            "flex flex-col space-y-2",
          )}>
            <h3 className={cn(
              /* 섹션 제목 */
              "text-sm font-medium",
            )}>
              서비스
            </h3>
            <Link href="/home" className={cn(
              /* 링크 스타일 */
              "text-sm text-muted-foreground hover:text-foreground",
            )}>
              홈
            </Link>
            <Link href="/search" className={cn(
              /* 링크 스타일 */
              "text-sm text-muted-foreground hover:text-foreground",
            )}>
              도서 검색
            </Link>
            <Link href="/community" className={cn(
              /* 링크 스타일 */
              "text-sm text-muted-foreground hover:text-foreground",
            )}>
              커뮤니티
            </Link>
          </div>
          
          <div className={cn(
            /* 링크 섹션 */
            "flex flex-col space-y-2",
          )}>
            <h3 className={cn(
              /* 섹션 제목 */
              "text-sm font-medium",
            )}>
              정보
            </h3>
            <Link href="#" className={cn(
              /* 링크 스타일 */
              "text-sm text-muted-foreground hover:text-foreground",
            )}>
              이용약관
            </Link>
            <Link href="#" className={cn(
              /* 링크 스타일 */
              "text-sm text-muted-foreground hover:text-foreground",
            )}>
              개인정보처리방침
            </Link>
            <Link href="#" className={cn(
              /* 링크 스타일 */
              "text-sm text-muted-foreground hover:text-foreground",
            )}>
              고객센터
            </Link>
          </div>
          
          <div className={cn(
            /* 링크 섹션 */
            "flex flex-col space-y-2",
          )}>
            <h3 className={cn(
              /* 섹션 제목 */
              "text-sm font-medium",
            )}>
              연락처
            </h3>
            <p className={cn(
              /* 연락처 정보 */
              "text-sm text-muted-foreground",
            )}>
              이메일: contact@bookcommunity.com
            </p>
            <p className={cn(
              /* 연락처 정보 */
              "text-sm text-muted-foreground",
            )}>
              전화: 02-123-4567
            </p>
          </div>
        </div>
        
        <div className={cn(
          /* 저작권 정보 */
          "mt-8 border-t pt-8 text-center text-sm text-muted-foreground",
        )}>
          &copy; {new Date().getFullYear()} 도서 커뮤니티. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 