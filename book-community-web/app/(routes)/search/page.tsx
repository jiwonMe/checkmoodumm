"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// 도서 데이터 타입 정의
interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  description: string;
  category: string;
  publishedYear: number;
}

// 샘플 도서 데이터 (실제로는 API에서 가져올 것)
const sampleBooks: Book[] = [
  {
    id: 1,
    title: "해리 포터와 마법사의 돌",
    author: "J.K. 롤링",
    cover: "https://picsum.photos/seed/book1/300/400",
    description: "해리 포터 시리즈의 첫 번째 책으로, 마법 세계로 들어가는 해리의 모험을 담고 있습니다.",
    category: "판타지",
    publishedYear: 1997,
  },
  {
    id: 2,
    title: "반지의 제왕",
    author: "J.R.R. 톨킨",
    cover: "https://picsum.photos/seed/book2/300/400",
    description: "중간계를 배경으로 한 판타지 소설로, 악의 세력에 맞서는 호빗들의 모험을 그립니다.",
    category: "판타지",
    publishedYear: 1954,
  },
  {
    id: 3,
    title: "어린 왕자",
    author: "생텍쥐페리",
    cover: "https://picsum.photos/seed/book3/300/400",
    description: "사막에 불시착한 비행사와 어린 왕자의 만남을 통해 삶의 의미를 되새기게 하는 작품입니다.",
    category: "소설",
    publishedYear: 1943,
  },
  {
    id: 4,
    title: "1984",
    author: "조지 오웰",
    cover: "https://picsum.photos/seed/book4/300/400",
    description: "전체주의 사회를 그린 디스토피아 소설로, 빅브라더가 모든 것을 감시하는 세계를 묘사합니다.",
    category: "소설",
    publishedYear: 1949,
  },
  {
    id: 5,
    title: "죄와 벌",
    author: "도스토예프스키",
    cover: "https://picsum.photos/seed/book5/300/400",
    description: "가난한 대학생 라스콜니코프의 살인과 그 이후의 심리적 갈등을 다룬 소설입니다.",
    category: "소설",
    publishedYear: 1866,
  },
  {
    id: 6,
    title: "데미안",
    author: "헤르만 헤세",
    cover: "https://picsum.photos/seed/book6/300/400",
    description: "에밀 싱클레어의 성장 과정을 통해 자아 발견의 여정을 그린 소설입니다.",
    category: "소설",
    publishedYear: 1919,
  },
];

// 카테고리 목록
const categories = ["전체", "소설", "판타지", "자기계발", "역사", "과학"];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("전체");
  const [searchResults, setSearchResults] = useState<Book[]>(sampleBooks);

  // 검색 처리 함수
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      // 검색어가 없으면 카테고리만 적용
      filterByCategory(activeCategory);
      return;
    }

    // 검색어와 카테고리로 필터링
    const filtered = sampleBooks.filter((book) => {
      const matchesQuery =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = activeCategory === "전체" || book.category === activeCategory;

      return matchesQuery && matchesCategory;
    });

    setSearchResults(filtered);
  };

  // 카테고리 필터링 함수
  const filterByCategory = (category: string) => {
    setActiveCategory(category);
    
    if (category === "전체") {
      // 검색어만 적용
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        setSearchResults(sampleBooks);
      }
      return;
    }

    // 카테고리와 검색어로 필터링
    const filtered = sampleBooks.filter((book) => {
      const matchesCategory = book.category === category;
      
      if (!searchQuery.trim()) {
        return matchesCategory;
      }

      const matchesQuery =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesQuery;
    });

    setSearchResults(filtered);
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
        도서 검색
      </h1>

      {/* 검색 폼 */}
      <div className={cn(
        /* 검색 폼 */
        "mb-8",
      )}>
        <div className={cn(
          /* 검색 입력 영역 */
          "flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0",
        )}>
          <Input
            type="text"
            placeholder="도서 제목, 저자 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              /* 입력 필드 */
              "md:flex-1",
            )}
          />
          <Button onClick={handleSearch}>검색</Button>
        </div>
      </div>

      {/* 카테고리 탭 */}
      <Tabs defaultValue="전체" value={activeCategory} onValueChange={filterByCategory} className={cn(
        /* 탭 컨테이너 */
        "mb-8",
      )}>
        <TabsList className={cn(
          /* 탭 리스트 */
          "mb-4 w-full justify-start overflow-auto",
        )}>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* 검색 결과 */}
      {searchResults.length > 0 ? (
        <div className={cn(
          /* 검색 결과 그리드 */
          "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        )}>
          {searchResults.map((book) => (
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
                <CardDescription>{book.author} • {book.publishedYear}</CardDescription>
              </CardHeader>
              <CardContent className={cn(
                /* 카드 콘텐츠 */
                "p-4 pt-0",
              )}>
                <p className={cn(
                  /* 설명 텍스트 */
                  "text-sm text-muted-foreground",
                )}>{book.description}</p>
                <div className={cn(
                  /* 카테고리 태그 */
                  "mt-2",
                )}>
                  <span className={cn(
                    /* 태그 스타일 */
                    "inline-block rounded-full bg-muted px-2 py-1 text-xs",
                  )}>
                    {book.category}
                  </span>
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
                  <Link href={`/book/${book.id}`}>자세히 보기</Link>
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
    </div>
  );
} 