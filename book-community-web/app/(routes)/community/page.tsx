"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// 게시글 데이터 타입 정의
interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  date: string;
  category: string;
  likes: number;
  comments: number;
  tags: string[];
}

// 샘플 게시글 데이터 (실제로는 API에서 가져올 것)
const samplePosts: Post[] = [
  {
    id: 1,
    title: "해리 포터 시리즈를 처음 읽는 분들께 추천하는 읽는 순서",
    content: "해리 포터 시리즈는 총 7권으로 구성되어 있으며, 출간 순서대로 읽는 것이 가장 좋습니다. 각 권마다 해리의 성장과 함께 이야기가 더욱 깊어지고 어두워지는 것을 느낄 수 있습니다...",
    author: "마법사",
    authorAvatar: "https://picsum.photos/seed/user1/100/100",
    date: "2023-05-15",
    category: "독서 팁",
    likes: 42,
    comments: 24,
    tags: ["판타지", "해리포터", "독서순서"],
  },
  {
    id: 2,
    title: "반지의 제왕 영화와 원작 소설의 차이점",
    content: "피터 잭슨 감독의 반지의 제왕 영화 삼부작은 원작 소설을 상당히 충실하게 재현했지만, 몇 가지 중요한 차이점이 있습니다. 특히 톰 봄바딜 캐릭터의 생략과 엔트와이프에 대한 이야기가 축소된 점 등이 눈에 띕니다...",
    author: "호빗사랑",
    authorAvatar: "https://picsum.photos/seed/user2/100/100",
    date: "2023-05-12",
    category: "책과 영화",
    likes: 35,
    comments: 18,
    tags: ["판타지", "반지의제왕", "원작비교"],
  },
  {
    id: 3,
    title: "어린 왕자에 숨겨진 의미들",
    content: "어린 왕자는 단순한 동화가 아닌 깊은 철학적 의미를 담고 있는 작품입니다. 특히 여우와의 대화에서 '길들임'의 의미와 '네가 네 장미에 쏟은 시간 때문에 네 장미가 그토록 소중한 것'이라는 구절은 인간 관계의 본질을 생각하게 합니다...",
    author: "여우",
    authorAvatar: "https://picsum.photos/seed/user3/100/100",
    date: "2023-05-10",
    category: "작품 해석",
    likes: 56,
    comments: 32,
    tags: ["고전", "어린왕자", "철학"],
  },
  {
    id: 4,
    title: "올해 상반기 베스트셀러 리뷰",
    content: "2023년 상반기에는 다양한 장르의 책들이 사랑을 받았습니다. 특히 자기계발서와 판타지 소설의 강세가 두드러졌는데, 이는 코로나 이후 사람들의 독서 취향이 변화하고 있음을 보여줍니다...",
    author: "책벌레",
    authorAvatar: "https://picsum.photos/seed/user4/100/100",
    date: "2023-05-08",
    category: "도서 리뷰",
    likes: 28,
    comments: 15,
    tags: ["베스트셀러", "2023", "도서리뷰"],
  },
  {
    id: 5,
    title: "서울에서 가장 분위기 좋은 독립 서점 추천",
    content: "서울에는 특색 있는 독립 서점들이 많이 있습니다. 각각의 서점마다 큐레이션 방식과 공간 구성이 다르기 때문에 취향에 맞는 곳을 찾아가는 재미가 있습니다. 오늘은 제가 자주 가는 독립 서점 5곳을 소개합니다...",
    author: "책방지기",
    authorAvatar: "https://picsum.photos/seed/user5/100/100",
    date: "2023-05-05",
    category: "독서 공간",
    likes: 63,
    comments: 27,
    tags: ["독립서점", "서울", "북카페"],
  },
];

// 독서 모임 데이터 타입 정의
interface ReadingGroup {
  id: number;
  title: string;
  description: string;
  cover: string;
  members: number;
  meetingType: string;
  schedule: string;
  currentBook: string;
}

// 샘플 독서 모임 데이터 (실제로는 API에서 가져올 것)
const sampleReadingGroups: ReadingGroup[] = [
  {
    id: 1,
    title: "SF 소설 읽기 모임",
    description: "SF 소설을 함께 읽고 토론하는 모임입니다. 매월 한 권의 책을 선정하여 읽고 온라인으로 만나 이야기를 나눕니다.",
    cover: "https://picsum.photos/seed/group1/300/200",
    members: 42,
    meetingType: "온라인",
    schedule: "매월 첫째, 셋째 토요일 오후 3시",
    currentBook: "듄 - 프랭크 허버트",
  },
  {
    id: 2,
    title: "고전 문학 탐험",
    description: "세계 각국의 고전 문학을 함께 읽고 토론하는 모임입니다. 깊이 있는 작품 해석과 역사적 맥락을 함께 공부합니다.",
    cover: "https://picsum.photos/seed/group2/300/200",
    members: 35,
    meetingType: "오프라인 (서울 강남)",
    schedule: "매월 둘째, 넷째 일요일 오후 2시",
    currentBook: "죄와 벌 - 도스토예프스키",
  },
  {
    id: 3,
    title: "에세이 & 시 낭독회",
    description: "아름다운 에세이와 시를 함께 읽고 감상을 나누는 모임입니다. 직접 작성한 글도 공유할 수 있습니다.",
    cover: "https://picsum.photos/seed/group3/300/200",
    members: 28,
    meetingType: "혼합 (온/오프라인)",
    schedule: "매주 금요일 저녁 7시",
    currentBook: "나의 라임오렌지나무 - J.M. 바스콘셀로스",
  },
];

// 카테고리 목록
const categories = ["전체", "독서 팁", "도서 리뷰", "작품 해석", "책과 영화", "독서 공간"];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [activeCategory, setActiveCategory] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(samplePosts);

  // 검색 및 필터링 처리 함수
  const handleSearch = () => {
    if (!searchQuery.trim() && activeCategory === "전체") {
      setFilteredPosts(samplePosts);
      return;
    }

    const filtered = samplePosts.filter((post) => {
      const matchesQuery = !searchQuery.trim() || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = activeCategory === "전체" || post.category === activeCategory;

      return matchesQuery && matchesCategory;
    });

    setFilteredPosts(filtered);
  };

  // 카테고리 변경 처리 함수
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    
    if (category === "전체" && !searchQuery.trim()) {
      setFilteredPosts(samplePosts);
      return;
    }

    const filtered = samplePosts.filter((post) => {
      const matchesCategory = category === "전체" || post.category === category;
      
      const matchesQuery = !searchQuery.trim() || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesQuery;
    });

    setFilteredPosts(filtered);
  };

  return (
    <div className={cn(
      /* 페이지 컨테이너 */
      "container py-8",
    )}>
      <h1 className={cn(
        /* 페이지 제목 */
        "mb-6 text-3xl font-bold",
      )}>
        독서 커뮤니티
      </h1>

      {/* 메인 탭 */}
      <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab} className={cn(
        /* 탭 컨테이너 */
        "mb-8",
      )}>
        <TabsList className={cn(
          /* 탭 리스트 */
          "mb-4",
        )}>
          <TabsTrigger value="posts">게시글</TabsTrigger>
          <TabsTrigger value="reading-groups">독서 모임</TabsTrigger>
        </TabsList>

        {/* 게시글 탭 콘텐츠 */}
        <TabsContent value="posts" className={cn(
          /* 게시글 탭 콘텐츠 */
          "space-y-6",
        )}>
          {/* 검색 및 필터링 */}
          <div className={cn(
            /* 검색 및 필터링 영역 */
            "mb-6 space-y-4",
          )}>
            <div className={cn(
              /* 검색 입력 영역 */
              "flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0",
            )}>
              <Input
                type="text"
                placeholder="게시글 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  /* 입력 필드 */
                  "md:flex-1",
                )}
              />
              <Button onClick={handleSearch}>검색</Button>
              <Button asChild variant="outline">
                <Link href="/community/new-post">글쓰기</Link>
              </Button>
            </div>

            {/* 카테고리 필터 */}
            <div className={cn(
              /* 카테고리 필터 */
              "flex flex-wrap gap-2",
            )}>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* 게시글 목록 */}
          {filteredPosts.length > 0 ? (
            <div className={cn(
              /* 게시글 목록 */
              "space-y-4",
            )}>
              {filteredPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader className={cn(
                    /* 카드 헤더 */
                    "p-4 md:p-6",
                  )}>
                    <div className={cn(
                      /* 작성자 정보 */
                      "mb-2 flex items-center",
                    )}>
                      <Image
                        src={post.authorAvatar}
                        alt={post.author}
                        width={40}
                        height={40}
                        className={cn(
                          /* 아바타 이미지 */
                          "mr-2 rounded-full",
                        )}
                      />
                      <div>
                        <p className={cn(
                          /* 작성자 이름 */
                          "font-medium",
                        )}>
                          {post.author}
                        </p>
                        <p className={cn(
                          /* 날짜 및 카테고리 */
                          "text-xs text-muted-foreground",
                        )}>
                          {post.date} • {post.category}
                        </p>
                      </div>
                    </div>
                    <CardTitle className={cn(
                      /* 제목 스타일 */
                      "text-xl",
                    )}>
                      <Link href={`/community/post/${post.id}`} className={cn(
                        /* 링크 스타일 */
                        "hover:underline",
                      )}>
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={cn(
                    /* 카드 콘텐츠 */
                    "p-4 pt-0 md:p-6 md:pt-0",
                  )}>
                    <p className={cn(
                      /* 내용 텍스트 */
                      "mb-4 text-muted-foreground",
                    )}>
                      {post.content.length > 200
                        ? `${post.content.substring(0, 200)}...`
                        : post.content}
                    </p>
                    <div className={cn(
                      /* 태그 컨테이너 */
                      "mb-4 flex flex-wrap gap-2",
                    )}>
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className={cn(
                            /* 태그 스타일 */
                            "inline-block rounded-full bg-muted px-2 py-1 text-xs",
                          )}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className={cn(
                    /* 카드 푸터 */
                    "flex items-center justify-between p-4 md:p-6",
                  )}>
                    <div className={cn(
                      /* 상호작용 정보 */
                      "flex items-center space-x-4 text-sm text-muted-foreground",
                    )}>
                      <span className={cn(
                        /* 좋아요 */
                        "flex items-center",
                      )}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={cn(
                            /* 아이콘 */
                            "mr-1 h-4 w-4",
                          )}
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        {post.likes}
                      </span>
                      <span className={cn(
                        /* 댓글 */
                        "flex items-center",
                      )}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={cn(
                            /* 아이콘 */
                            "mr-1 h-4 w-4",
                          )}
                        >
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                        </svg>
                        {post.comments}
                      </span>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/community/post/${post.id}`}>자세히 보기</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className={cn(
              /* 결과 없음 메시지 */
              "rounded-lg border p-8 text-center",
            )}>
              <h3 className={cn(
                /* 메시지 제목 */
                "mb-2 text-lg font-medium",
              )}>
                검색 결과가 없습니다
              </h3>
              <p className={cn(
                /* 메시지 설명 */
                "text-muted-foreground",
              )}>
                다른 검색어나 카테고리로 다시 시도해보세요.
              </p>
            </div>
          )}
        </TabsContent>

        {/* 독서 모임 탭 콘텐츠 */}
        <TabsContent value="reading-groups" className={cn(
          /* 독서 모임 탭 콘텐츠 */
          "space-y-6",
        )}>
          <div className={cn(
            /* 독서 모임 헤더 */
            "mb-6 flex flex-col justify-between md:flex-row md:items-center",
          )}>
            <h2 className={cn(
              /* 섹션 제목 */
              "mb-4 text-2xl font-bold md:mb-0",
            )}>
              독서 모임
            </h2>
            <Button asChild>
              <Link href="/community/new-group">모임 만들기</Link>
            </Button>
          </div>

          {/* 독서 모임 목록 */}
          <div className={cn(
            /* 독서 모임 그리드 */
            "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3",
          )}>
            {sampleReadingGroups.map((group) => (
              <Card key={group.id} className={cn(
                /* 카드 스타일 */
                "overflow-hidden",
              )}>
                <div className={cn(
                  /* 이미지 컨테이너 */
                  "relative h-40",
                )}>
                  <Image
                    src={group.cover}
                    alt={group.title}
                    fill
                    className={cn(
                      /* 이미지 스타일 */
                      "object-cover transition-transform hover:scale-105",
                    )}
                  />
                </div>
                <CardHeader className={cn(
                  /* 카드 헤더 */
                  "p-4",
                )}>
                  <CardTitle className={cn(
                    /* 제목 스타일 */
                    "text-lg",
                  )}>
                    {group.title}
                  </CardTitle>
                  <CardDescription>
                    {group.meetingType} • {group.members}명 참여 중
                  </CardDescription>
                </CardHeader>
                <CardContent className={cn(
                  /* 카드 콘텐츠 */
                  "p-4 pt-0",
                )}>
                  <p className={cn(
                    /* 설명 텍스트 */
                    "mb-2 text-sm text-muted-foreground",
                  )}>
                    {group.description.length > 100
                      ? `${group.description.substring(0, 100)}...`
                      : group.description}
                  </p>
                  <div className={cn(
                    /* 모임 정보 */
                    "mt-4 space-y-1 text-sm",
                  )}>
                    <p>
                      <span className={cn(
                        /* 라벨 */
                        "font-medium",
                      )}>
                        일정:
                      </span>{" "}
                      {group.schedule}
                    </p>
                    <p>
                      <span className={cn(
                        /* 라벨 */
                        "font-medium",
                      )}>
                        현재 도서:
                      </span>{" "}
                      {group.currentBook}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className={cn(
                  /* 카드 푸터 */
                  "p-4",
                )}>
                  <Button asChild className={cn(
                    /* 버튼 스타일 */
                    "w-full",
                  )}>
                    <Link href={`/community/reading-group/${group.id}`}>
                      자세히 보기
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 