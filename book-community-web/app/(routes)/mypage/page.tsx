"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// 사용자 정보 (실제로는 API에서 가져올 것)
const userProfile = {
  name: "김독서",
  email: "reader@example.com",
  bio: "책을 사랑하는 평범한 독서가입니다. 주로 소설과 에세이를 즐겨 읽습니다.",
  avatar: "https://picsum.photos/seed/user1/200/200",
  joinDate: "2022년 3월 15일",
  readCount: 42,
  postCount: 15,
  bookmarkCount: 23,
};

// 읽은 책 목록 (실제로는 API에서 가져올 것)
const readBooks = [
  {
    id: 1,
    title: "해리 포터와 마법사의 돌",
    author: "J.K. 롤링",
    cover: "https://picsum.photos/seed/book1/300/400",
    readDate: "2023년 5월 15일",
    rating: 5,
  },
  {
    id: 2,
    title: "반지의 제왕",
    author: "J.R.R. 톨킨",
    cover: "https://picsum.photos/seed/book2/300/400",
    readDate: "2023년 4월 20일",
    rating: 4,
  },
  {
    id: 3,
    title: "어린 왕자",
    author: "생텍쥐페리",
    cover: "https://picsum.photos/seed/book3/300/400",
    readDate: "2023년 3월 10일",
    rating: 5,
  },
  {
    id: 4,
    title: "데미안",
    author: "헤르만 헤세",
    cover: "https://picsum.photos/seed/book4/300/400",
    readDate: "2023년 2월 5일",
    rating: 4,
  },
];

// 작성한 게시글 목록 (실제로는 API에서 가져올 것)
const userPosts = [
  {
    id: 1,
    title: "해리 포터 시리즈를 처음 읽는 분들께 추천하는 읽는 순서",
    date: "2023년 5월 15일",
    comments: 24,
    likes: 42,
  },
  {
    id: 2,
    title: "반지의 제왕 영화와 원작 소설의 차이점",
    date: "2023년 4월 12일",
    comments: 18,
    likes: 35,
  },
  {
    id: 3,
    title: "어린 왕자에 숨겨진 의미들",
    date: "2023년 3월 8일",
    comments: 15,
    likes: 28,
  },
];

// 북마크한 게시글 목록 (실제로는 API에서 가져올 것)
const bookmarkedPosts = [
  {
    id: 1,
    title: "2023년 상반기 베스트셀러 TOP 10",
    author: "책벌레",
    date: "2023년 6월 30일",
    comments: 32,
    likes: 87,
  },
  {
    id: 2,
    title: "독서 습관을 기르는 7가지 방법",
    author: "독서광",
    date: "2023년 6월 15일",
    comments: 45,
    likes: 120,
  },
  {
    id: 3,
    title: "책을 더 빨리 읽는 방법",
    author: "속독마스터",
    date: "2023년 5월 20일",
    comments: 28,
    likes: 76,
  },
];

// 별점 컴포넌트
function StarRating({ rating }: { rating: number }) {
  return (
    <div className={cn(
      /* 별점 컨테이너 */
      "flex",
    )}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={cn(
          /* 별 아이콘 */
          "text-lg",
          /* 별 색상 */
          star <= rating ? "text-yellow-500" : "text-gray-300",
        )}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function MyPage() {
  return (
    <div className={cn(
      /* 페이지 컨테이너 */
      "container py-8",
    )}>
      <h1 className={cn(
        /* 페이지 제목 */
        "mb-8 text-3xl font-bold",
      )}>
        마이페이지
      </h1>

      <div className={cn(
        /* 콘텐츠 레이아웃 */
        "grid grid-cols-1 gap-8 md:grid-cols-4",
      )}>
        {/* 사이드바 - 프로필 정보 */}
        <div className={cn(
          /* 사이드바 컨테이너 */
          "md:col-span-1",
        )}>
          <Card>
            <CardHeader className={cn(
              /* 카드 헤더 */
              "text-center",
            )}>
              <div className={cn(
                /* 프로필 이미지 컨테이너 */
                "mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full",
              )}>
                <Image
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  width={96}
                  height={96}
                  className={cn(
                    /* 프로필 이미지 */
                    "h-full w-full object-cover",
                  )}
                />
              </div>
              <CardTitle>{userProfile.name}</CardTitle>
              <CardDescription>{userProfile.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className={cn(
                /* 자기소개 */
                "mb-4 text-sm text-muted-foreground",
              )}>
                {userProfile.bio}
              </p>
              <div className={cn(
                /* 통계 컨테이너 */
                "grid grid-cols-3 gap-2 text-center",
              )}>
                <div>
                  <p className={cn(
                    /* 통계 숫자 */
                    "text-xl font-bold",
                  )}>{userProfile.readCount}</p>
                  <p className={cn(
                    /* 통계 레이블 */
                    "text-xs text-muted-foreground",
                  )}>읽은 책</p>
                </div>
                <div>
                  <p className={cn(
                    /* 통계 숫자 */
                    "text-xl font-bold",
                  )}>{userProfile.postCount}</p>
                  <p className={cn(
                    /* 통계 레이블 */
                    "text-xs text-muted-foreground",
                  )}>게시글</p>
                </div>
                <div>
                  <p className={cn(
                    /* 통계 숫자 */
                    "text-xl font-bold",
                  )}>{userProfile.bookmarkCount}</p>
                  <p className={cn(
                    /* 통계 레이블 */
                    "text-xs text-muted-foreground",
                  )}>북마크</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className={cn(
                /* 가입일 */
                "w-full text-center text-xs text-muted-foreground",
              )}>
                가입일: {userProfile.joinDate}
              </p>
            </CardFooter>
          </Card>
        </div>

        {/* 메인 콘텐츠 */}
        <div className={cn(
          /* 메인 콘텐츠 컨테이너 */
          "md:col-span-3",
        )}>
          <Tabs defaultValue="books" className={cn(
            /* 탭 컨테이너 */
            "w-full",
          )}>
            <TabsList className={cn(
              /* 탭 리스트 */
              "mb-6 grid w-full grid-cols-3",
            )}>
              <TabsTrigger value="books">읽은 책</TabsTrigger>
              <TabsTrigger value="posts">작성한 게시글</TabsTrigger>
              <TabsTrigger value="bookmarks">북마크</TabsTrigger>
            </TabsList>

            {/* 읽은 책 탭 */}
            <TabsContent value="books">
              <div className={cn(
                /* 책 그리드 */
                "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
              )}>
                {readBooks.map((book) => (
                  <Card key={book.id}>
                    <div className={cn(
                      /* 책 커버 컨테이너 */
                      "relative h-48 w-full overflow-hidden",
                    )}>
                      <Image
                        src={book.cover}
                        alt={book.title}
                        fill
                        className={cn(
                          /* 책 커버 이미지 */
                          "object-cover transition-transform hover:scale-105",
                        )}
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className={cn(
                        /* 책 제목 */
                        "line-clamp-1 text-lg",
                      )}>{book.title}</CardTitle>
                      <CardDescription>{book.author}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className={cn(
                        /* 책 정보 */
                        "flex flex-col space-y-2",
                      )}>
                        <p className={cn(
                          /* 읽은 날짜 */
                          "text-sm text-muted-foreground",
                        )}>
                          읽은 날짜: {book.readDate}
                        </p>
                        <StarRating rating={book.rating} />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className={cn(
                        /* 버튼 */
                        "w-full",
                      )}>
                        리뷰 작성
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* 작성한 게시글 탭 */}
            <TabsContent value="posts">
              <div className={cn(
                /* 게시글 리스트 */
                "flex flex-col space-y-4",
              )}>
                {userPosts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <CardTitle className={cn(
                        /* 게시글 제목 */
                        "text-lg",
                      )}>{post.title}</CardTitle>
                      <CardDescription>{post.date}</CardDescription>
                    </CardHeader>
                    <CardFooter className={cn(
                      /* 게시글 푸터 */
                      "flex justify-between",
                    )}>
                      <div className={cn(
                        /* 게시글 통계 */
                        "flex space-x-4 text-sm text-muted-foreground",
                      )}>
                        <span>댓글 {post.comments}</span>
                        <span>좋아요 {post.likes}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        보기
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* 북마크 탭 */}
            <TabsContent value="bookmarks">
              <div className={cn(
                /* 북마크 리스트 */
                "flex flex-col space-y-4",
              )}>
                {bookmarkedPosts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <CardTitle className={cn(
                        /* 게시글 제목 */
                        "text-lg",
                      )}>{post.title}</CardTitle>
                      <CardDescription>
                        작성자: {post.author} | {post.date}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className={cn(
                      /* 게시글 푸터 */
                      "flex justify-between",
                    )}>
                      <div className={cn(
                        /* 게시글 통계 */
                        "flex space-x-4 text-sm text-muted-foreground",
                      )}>
                        <span>댓글 {post.comments}</span>
                        <span>좋아요 {post.likes}</span>
                      </div>
                      <div className={cn(
                        /* 버튼 그룹 */
                        "flex space-x-2",
                      )}>
                        <Button variant="ghost" size="sm">
                          보기
                        </Button>
                        <Button variant="outline" size="sm">
                          북마크 해제
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 