import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// 도서 상세 정보 (실제로는 API에서 가져올 것)
const bookDetail = {
  id: 1,
  title: "해리 포터와 마법사의 돌",
  author: "J.K. 롤링",
  publisher: "문학수첩",
  publishDate: "2019년 12월 15일",
  isbn: "9788983927286",
  pages: 366,
  description: "해리 포터 시리즈의 첫 번째 책으로, 마법 세계로 들어가는 해리의 모험을 담고 있습니다. 해리는 자신이 마법사라는 사실을 알게 되고, 호그와트 마법학교에 입학하게 됩니다. 그곳에서 새로운 친구들을 사귀고, 마법을 배우며, 자신의 과거와 마주하게 됩니다.",
  cover: "https://picsum.photos/seed/book1/300/400",
  rating: 4.8,
  categories: ["판타지", "청소년", "모험"],
  price: 15800,
};

// 도서 리뷰 데이터 (실제로는 API에서 가져올 것)
const bookReviews = [
  {
    id: 1,
    user: {
      name: "마법사",
      avatar: "https://picsum.photos/seed/user1/200/200",
    },
    rating: 5,
    date: "2023년 5월 15일",
    content: "어린 시절부터 좋아했던 책입니다. 마법 세계의 묘사가 정말 생생하고, 캐릭터들의 성장 과정이 인상적입니다. 특히 해리, 론, 헤르미온느의 우정이 가장 감동적이었습니다.",
  },
  {
    id: 2,
    user: {
      name: "독서광",
      avatar: "https://picsum.photos/seed/user2/200/200",
    },
    rating: 4,
    date: "2023년 4월 20일",
    content: "판타지 소설의 고전이라고 할 수 있습니다. 처음 읽었을 때의 그 설렘이 아직도 기억납니다. 다만 초반부가 조금 지루할 수 있어 4점 드립니다.",
  },
  {
    id: 3,
    user: {
      name: "책벌레",
      avatar: "https://picsum.photos/seed/user3/200/200",
    },
    rating: 5,
    date: "2023년 3월 10일",
    content: "이 책은 단순한 아동 문학을 넘어서는 깊이가 있습니다. 선과 악, 용기와 우정에 대한 메시지가 잘 담겨 있어요. 시리즈 전체를 통해 캐릭터들이 성장하는 모습이 정말 인상적입니다.",
  },
];

// 관련 도서 데이터 (실제로는 API에서 가져올 것)
const relatedBooks = [
  {
    id: 2,
    title: "해리 포터와 비밀의 방",
    author: "J.K. 롤링",
    cover: "https://picsum.photos/seed/book2/300/400",
    rating: 4.7,
  },
  {
    id: 3,
    title: "해리 포터와 아즈카반의 죄수",
    author: "J.K. 롤링",
    cover: "https://picsum.photos/seed/book3/300/400",
    rating: 4.9,
  },
  {
    id: 4,
    title: "해리 포터와 불의 잔",
    author: "J.K. 롤링",
    cover: "https://picsum.photos/seed/book4/300/400",
    rating: 4.8,
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
          star <= Math.round(rating) ? "text-yellow-500" : "text-gray-300",
        )}>
          ★
        </span>
      ))}
      <span className={cn(
        /* 별점 숫자 */
        "ml-2 text-sm text-muted-foreground",
      )}>
        ({rating.toFixed(1)})
      </span>
    </div>
  );
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  // 실제로는 params.id를 사용하여 API에서 도서 정보를 가져올 것
  // 현재는 더미 데이터를 사용하므로 params.id는 사용하지 않음
  console.log(`도서 ID: ${params.id}`); // params 사용
  
  return (
    <div className={cn(
      /* 페이지 컨테이너 */
      "container py-8",
    )}>
      {/* 도서 상세 정보 */}
      <div className={cn(
        /* 상세 정보 컨테이너 */
        "mb-12 grid grid-cols-1 gap-8 md:grid-cols-3",
      )}>
        {/* 도서 커버 */}
        <div className={cn(
          /* 커버 컨테이너 */
          "md:col-span-1",
        )}>
          <div className={cn(
            /* 이미지 컨테이너 */
            "relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-lg",
          )}>
            <Image
              src={bookDetail.cover}
              alt={bookDetail.title}
              fill
              className={cn(
                /* 커버 이미지 */
                "object-cover",
              )}
              priority
            />
          </div>
        </div>
        
        {/* 도서 정보 */}
        <div className={cn(
          /* 정보 컨테이너 */
          "flex flex-col space-y-4 md:col-span-2",
        )}>
          <h1 className={cn(
            /* 도서 제목 */
            "text-3xl font-bold",
          )}>
            {bookDetail.title}
          </h1>
          
          <div className={cn(
            /* 저자 정보 */
            "text-xl text-muted-foreground",
          )}>
            {bookDetail.author}
          </div>
          
          <StarRating rating={bookDetail.rating} />
          
          <div className={cn(
            /* 카테고리 태그 */
            "flex flex-wrap gap-2",
          )}>
            {bookDetail.categories.map((category) => (
              <span key={category} className={cn(
                /* 태그 스타일 */
                "rounded-full bg-secondary px-3 py-1 text-xs",
              )}>
                {category}
              </span>
            ))}
          </div>
          
          <div className={cn(
            /* 가격 정보 */
            "text-xl font-bold",
          )}>
            {bookDetail.price.toLocaleString()}원
          </div>
          
          <div className={cn(
            /* 버튼 그룹 */
            "flex space-x-4",
          )}>
            <Button className={cn(
              /* 구매 버튼 */
              "flex-1",
            )}>
              구매하기
            </Button>
            <Button variant="outline" className={cn(
              /* 찜하기 버튼 */
              "flex-1",
            )}>
              찜하기
            </Button>
          </div>
          
          <div className={cn(
            /* 출판 정보 */
            "mt-4 grid grid-cols-2 gap-2 text-sm",
          )}>
            <div className={cn(
              /* 정보 항목 */
              "flex flex-col",
            )}>
              <span className={cn(
                /* 레이블 */
                "text-muted-foreground",
              )}>출판사</span>
              <span>{bookDetail.publisher}</span>
            </div>
            <div className={cn(
              /* 정보 항목 */
              "flex flex-col",
            )}>
              <span className={cn(
                /* 레이블 */
                "text-muted-foreground",
              )}>출판일</span>
              <span>{bookDetail.publishDate}</span>
            </div>
            <div className={cn(
              /* 정보 항목 */
              "flex flex-col",
            )}>
              <span className={cn(
                /* 레이블 */
                "text-muted-foreground",
              )}>ISBN</span>
              <span>{bookDetail.isbn}</span>
            </div>
            <div className={cn(
              /* 정보 항목 */
              "flex flex-col",
            )}>
              <span className={cn(
                /* 레이블 */
                "text-muted-foreground",
              )}>페이지</span>
              <span>{bookDetail.pages}쪽</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 도서 상세 정보 탭 */}
      <Tabs defaultValue="description" className={cn(
        /* 탭 컨테이너 */
        "w-full",
      )}>
        <TabsList className={cn(
          /* 탭 리스트 */
          "mb-6 grid w-full grid-cols-3",
        )}>
          <TabsTrigger value="description">도서 소개</TabsTrigger>
          <TabsTrigger value="reviews">리뷰</TabsTrigger>
          <TabsTrigger value="related">관련 도서</TabsTrigger>
        </TabsList>
        
        {/* 도서 소개 탭 */}
        <TabsContent value="description">
          <Card>
            <CardHeader>
              <CardTitle>도서 소개</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={cn(
                /* 도서 설명 */
                "whitespace-pre-line text-base leading-relaxed",
              )}>
                {bookDetail.description}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 리뷰 탭 */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader className={cn(
              /* 리뷰 헤더 */
              "flex flex-row items-center justify-between",
            )}>
              <CardTitle>리뷰</CardTitle>
              <Button>리뷰 작성</Button>
            </CardHeader>
            <CardContent>
              <div className={cn(
                /* 리뷰 리스트 */
                "flex flex-col space-y-6",
              )}>
                {bookReviews.map((review) => (
                  <div key={review.id} className={cn(
                    /* 리뷰 아이템 */
                    "flex flex-col space-y-2 rounded-lg border p-4",
                  )}>
                    <div className={cn(
                      /* 리뷰 헤더 */
                      "flex items-center space-x-2",
                    )}>
                      <div className={cn(
                        /* 아바타 컨테이너 */
                        "h-10 w-10 overflow-hidden rounded-full",
                      )}>
                        <Image
                          src={review.user.avatar}
                          alt={review.user.name}
                          width={40}
                          height={40}
                          className={cn(
                            /* 아바타 이미지 */
                            "h-full w-full object-cover",
                          )}
                        />
                      </div>
                      <div className={cn(
                        /* 사용자 정보 */
                        "flex flex-col",
                      )}>
                        <span className={cn(
                          /* 사용자 이름 */
                          "font-medium",
                        )}>{review.user.name}</span>
                        <span className={cn(
                          /* 리뷰 날짜 */
                          "text-xs text-muted-foreground",
                        )}>{review.date}</span>
                      </div>
                      <div className={cn(
                        /* 별점 */
                        "ml-auto",
                      )}>
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                    <p className={cn(
                      /* 리뷰 내용 */
                      "text-sm",
                    )}>
                      {review.content}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 관련 도서 탭 */}
        <TabsContent value="related">
          <Card>
            <CardHeader>
              <CardTitle>관련 도서</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn(
                /* 관련 도서 그리드 */
                "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
              )}>
                {relatedBooks.map((book) => (
                  <Link href={`/books/${book.id}`} key={book.id}>
                    <Card className={cn(
                      /* 책 카드 */
                      "h-full transition-transform hover:scale-105",
                    )}>
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
                            "object-cover",
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
                      <CardFooter>
                        <StarRating rating={book.rating} />
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 