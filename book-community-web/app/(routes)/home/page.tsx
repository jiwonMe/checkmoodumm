import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// 추천 도서 데이터 (실제로는 API에서 가져올 것)
const featuredBooks = [
  {
    id: 1,
    title: "해리 포터와 마법사의 돌",
    author: "J.K. 롤링",
    cover: "https://picsum.photos/seed/book1/300/400",
    description: "해리 포터 시리즈의 첫 번째 책으로, 마법 세계로 들어가는 해리의 모험을 담고 있습니다.",
  },
  {
    id: 2,
    title: "반지의 제왕",
    author: "J.R.R. 톨킨",
    cover: "https://picsum.photos/seed/book2/300/400",
    description: "중간계를 배경으로 한 판타지 소설로, 악의 세력에 맞서는 호빗들의 모험을 그립니다.",
  },
  {
    id: 3,
    title: "어린 왕자",
    author: "생텍쥐페리",
    cover: "https://picsum.photos/seed/book3/300/400",
    description: "사막에 불시착한 비행사와 어린 왕자의 만남을 통해 삶의 의미를 되새기게 하는 작품입니다.",
  },
];

// 최신 커뮤니티 게시글 데이터 (실제로는 API에서 가져올 것)
const recentPosts = [
  {
    id: 1,
    title: "해리 포터 시리즈를 처음 읽는 분들께 추천하는 읽는 순서",
    author: "마법사",
    date: "2023-05-15",
    comments: 24,
  },
  {
    id: 2,
    title: "반지의 제왕 영화와 원작 소설의 차이점",
    author: "호빗사랑",
    date: "2023-05-12",
    comments: 18,
  },
  {
    id: 3,
    title: "어린 왕자에 숨겨진 의미들",
    author: "여우",
    date: "2023-05-10",
    comments: 32,
  },
  {
    id: 4,
    title: "올해 상반기 베스트셀러 리뷰",
    author: "책벌레",
    date: "2023-05-08",
    comments: 15,
  },
];

export default function HomePage() {
  return (
    <div className={cn(
      /* 페이지 컨테이너 */
      "container py-8",
    )}>
      {/* 히어로 섹션 */}
      <section className={cn(
        /* 히어로 섹션 */
        "mb-12 rounded-lg bg-muted p-8 md:p-12",
      )}>
        <div className={cn(
          /* 히어로 콘텐츠 */
          "flex flex-col items-center text-center md:flex-row md:text-left",
        )}>
          <div className={cn(
            /* 텍스트 영역 */
            "md:w-2/3",
          )}>
            <h1 className={cn(
              /* 제목 */
              "mb-4 text-3xl font-bold md:text-4xl",
            )}>
              독서를 사랑하는 사람들의 커뮤니티
            </h1>
            <p className={cn(
              /* 설명 */
              "mb-6 text-muted-foreground md:text-lg",
            )}>
              다양한 도서 정보와 독서 경험을 공유하고, 새로운 책을 발견하세요.
              독서 모임에 참여하고 다른 독자들과 소통해보세요.
            </p>
            <div className={cn(
              /* 버튼 그룹 */
              "flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0",
            )}>
              <Button asChild size="lg">
                <Link href="/search">도서 검색하기</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/community">커뮤니티 참여하기</Link>
              </Button>
            </div>
          </div>
          <div className={cn(
            /* 이미지 영역 */
            "mt-8 md:mt-0 md:w-1/3",
          )}>
            <Image
              src="https://picsum.photos/seed/books/600/400"
              alt="책 이미지"
              width={600}
              height={400}
              className={cn(
                /* 이미지 스타일 */
                "rounded-lg",
              )}
            />
          </div>
        </div>
      </section>

      {/* 추천 도서 섹션 */}
      <section className={cn(
        /* 추천 도서 섹션 */
        "mb-12",
      )}>
        <div className={cn(
          /* 섹션 헤더 */
          "mb-6 flex items-center justify-between",
        )}>
          <h2 className={cn(
            /* 섹션 제목 */
            "text-2xl font-bold",
          )}>
            추천 도서
          </h2>
          <Button asChild variant="link">
            <Link href="/search">더 보기</Link>
          </Button>
        </div>
        <div className={cn(
          /* 도서 그리드 */
          "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        )}>
          {featuredBooks.map((book) => (
            <Card key={book.id}>
              <CardHeader className={cn(
                /* 카드 헤더 */
                "p-4",
              )}>
                <div className={cn(
                  /* 이미지 컨테이너 */
                  "mb-4 overflow-hidden rounded-md",
                )}>
                  <Image
                    src={book.cover}
                    alt={book.title}
                    width={300}
                    height={400}
                    className={cn(
                      /* 이미지 스타일 */
                      "h-[250px] w-full object-cover transition-transform hover:scale-105",
                    )}
                  />
                </div>
                <CardTitle>{book.title}</CardTitle>
                <CardDescription>{book.author}</CardDescription>
              </CardHeader>
              <CardContent className={cn(
                /* 카드 콘텐츠 */
                "p-4 pt-0",
              )}>
                <p className={cn(
                  /* 설명 텍스트 */
                  "text-sm text-muted-foreground",
                )}>{book.description}</p>
              </CardContent>
              <CardFooter className={cn(
                /* 카드 푸터 */
                "p-4",
              )}>
                <Button asChild className={cn(
                  /* 버튼 스타일 */
                  "w-full",
                )}>
                  <Link href={`/book/${book.id}`}>자세히 보기</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* 최신 게시글 섹션 */}
      <section className={cn(
        /* 최신 게시글 섹션 */
        "mb-12",
      )}>
        <div className={cn(
          /* 섹션 헤더 */
          "mb-6 flex items-center justify-between",
        )}>
          <h2 className={cn(
            /* 섹션 제목 */
            "text-2xl font-bold",
          )}>
            최신 게시글
          </h2>
          <Button asChild variant="link">
            <Link href="/community">더 보기</Link>
          </Button>
        </div>
        <div className={cn(
          /* 게시글 리스트 */
          "space-y-4",
        )}>
          {recentPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader className={cn(
                /* 카드 헤더 */
                "p-4",
              )}>
                <CardTitle className={cn(
                  /* 제목 스타일 */
                  "text-lg",
                )}>
                  <Link href={`/community/post/${post.id}`} className={cn(
                    /* 링크 스타일 */
                    "hover:underline",
                  )}>
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription>
                  {post.author} • {post.date} • 댓글 {post.comments}개
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* 독서 모임 배너 */}
      <section className={cn(
        /* 독서 모임 배너 */
        "rounded-lg bg-primary p-8 text-primary-foreground",
      )}>
        <div className={cn(
          /* 배너 콘텐츠 */
          "flex flex-col items-center text-center md:flex-row md:text-left",
        )}>
          <div className={cn(
            /* 텍스트 영역 */
            "md:w-3/4",
          )}>
            <h2 className={cn(
              /* 제목 */
              "mb-4 text-2xl font-bold",
            )}>
              독서 모임에 참여하세요
            </h2>
            <p className={cn(
              /* 설명 */
              "mb-6",
            )}>
              매주 다양한 주제로 진행되는 온라인 독서 모임에 참여하고 다른 독자들과 함께 책에 대한 생각을 나눠보세요.
            </p>
          </div>
          <div className={cn(
            /* 버튼 영역 */
            "md:w-1/4 md:text-right",
          )}>
            <Button asChild variant="secondary" size="lg">
              <Link href="/community/reading-groups">참여하기</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 