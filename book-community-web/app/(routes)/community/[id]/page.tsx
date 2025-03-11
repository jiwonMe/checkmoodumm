"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// 게시글 상세 정보 (실제로는 API에서 가져올 것)
const postDetail = {
  id: 1,
  title: "해리 포터 시리즈를 처음 읽는 분들께 추천하는 읽는 순서",
  content: `안녕하세요, 마법사입니다. 오늘은 해리 포터 시리즈를 처음 접하시는 분들을 위해 추천 읽기 순서를 소개해드리려고 합니다.

해리 포터 시리즈는 총 7권으로 구성되어 있으며, 기본적으로는 출간 순서대로 읽는 것이 가장 좋습니다.

1. 해리 포터와 마법사의 돌 (1997)
2. 해리 포터와 비밀의 방 (1998)
3. 해리 포터와 아즈카반의 죄수 (1999)
4. 해리 포터와 불의 잔 (2000)
5. 해리 포터와 불사조 기사단 (2003)
6. 해리 포터와 혼혈 왕자 (2005)
7. 해리 포터와 죽음의 성물 (2007)

각 권은 해리의 학년이 올라감에 따라 내용도 점점 성숙해지고 어두워지는 경향이 있습니다. 1-3권은 비교적 가볍게 읽을 수 있지만, 4권부터는 분량도 늘어나고 내용도 복잡해집니다.

특히 마지막 7권은 이전 권들의 복선과 떡밥이 모두 회수되는 구조이기 때문에, 반드시 순서대로 읽는 것을 추천합니다.

추가로, '신비한 동물사전', '퀴디치의 역사' 등의 외전은 메인 시리즈를 모두 읽은 후에 보시는 것이 좋습니다.

여러분의 해리 포터 여행이 즐겁기를 바랍니다! 궁금한 점이 있으시면 댓글로 남겨주세요.`,
  author: {
    id: 1,
    name: "마법사",
    avatar: "https://picsum.photos/seed/user1/200/200",
  },
  date: "2023년 5월 15일",
  views: 1245,
  likes: 42,
  comments: 24,
  tags: ["해리 포터", "독서 순서", "판타지 소설"],
};

// 댓글 데이터 (실제로는 API에서 가져올 것)
const comments = [
  {
    id: 1,
    user: {
      id: 2,
      name: "호그와트학생",
      avatar: "https://picsum.photos/seed/user2/200/200",
    },
    content: "정말 유용한 정보 감사합니다! 저는 영화만 봤었는데, 이번 기회에 책도 읽어봐야겠어요.",
    date: "2023년 5월 15일",
    likes: 8,
  },
  {
    id: 2,
    user: {
      id: 3,
      name: "독서광",
      avatar: "https://picsum.photos/seed/user3/200/200",
    },
    content: "저는 개인적으로 3권인 '아즈카반의 죄수'가 가장 재미있었어요. 시리우스 블랙이라는 캐릭터의 등장과 함께 이야기가 더 깊어지는 느낌이었습니다.",
    date: "2023년 5월 16일",
    likes: 15,
  },
  {
    id: 3,
    user: {
      id: 4,
      name: "책벌레",
      avatar: "https://picsum.photos/seed/user4/200/200",
    },
    content: "외전 중에서는 '호그와트의 유산'도 추천합니다. 마법 세계의 역사와 배경을 더 자세히 알 수 있어요.",
    date: "2023년 5월 17일",
    likes: 5,
  },
];

// 관련 게시글 (실제로는 API에서 가져올 것)
const relatedPosts = [
  {
    id: 2,
    title: "반지의 제왕 영화와 원작 소설의 차이점",
    author: "호빗사랑",
    date: "2023년 4월 12일",
    comments: 18,
    views: 876,
  },
  {
    id: 3,
    title: "판타지 소설 입문자를 위한 추천 도서 10선",
    author: "책벌레",
    date: "2023년 3월 25일",
    comments: 32,
    views: 1543,
  },
  {
    id: 4,
    title: "해리 포터 시리즈의 숨겨진 복선들",
    author: "마법사",
    date: "2023년 2월 10일",
    comments: 45,
    views: 2134,
  },
];

export default function PostDetailPage({ params }: { params: { id: string } }) {
  // 실제로는 params.id를 사용하여 API에서 게시글 정보를 가져올 것
  console.log(`게시글 ID: ${params.id}`); // params 사용
  
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(postDetail.likes);
  
  // 좋아요 토글 함수
  const toggleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };
  
  // 댓글 작성 함수
  const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (commentText.trim()) {
      // 실제로는 API를 통해 댓글 저장
      alert("댓글이 등록되었습니다.");
      setCommentText("");
    }
  };
  
  return (
    <div className={cn(
      /* 페이지 컨테이너 */
      "container py-8",
    )}>
      <div className={cn(
        /* 콘텐츠 레이아웃 */
        "grid grid-cols-1 gap-8 md:grid-cols-4",
      )}>
        {/* 메인 콘텐츠 */}
        <div className={cn(
          /* 메인 콘텐츠 영역 */
          "md:col-span-3",
        )}>
          {/* 게시글 카드 */}
          <Card className={cn(
            /* 게시글 카드 */
            "mb-8",
          )}>
            <CardHeader>
              <div className={cn(
                /* 태그 컨테이너 */
                "mb-2 flex flex-wrap gap-2",
              )}>
                {postDetail.tags.map((tag) => (
                  <Link href={`/community/tags/${tag}`} key={tag}>
                    <span className={cn(
                      /* 태그 스타일 */
                      "rounded-full bg-secondary px-3 py-1 text-xs hover:bg-secondary/80",
                    )}>
                      #{tag}
                    </span>
                  </Link>
                ))}
              </div>
              <CardTitle className={cn(
                /* 게시글 제목 */
                "text-2xl font-bold",
              )}>
                {postDetail.title}
              </CardTitle>
              <CardDescription>
                <div className={cn(
                  /* 작성자 정보 컨테이너 */
                  "mt-2 flex items-center",
                )}>
                  <div className={cn(
                    /* 아바타 컨테이너 */
                    "mr-2 h-8 w-8 overflow-hidden rounded-full",
                  )}>
                    <Image
                      src={postDetail.author.avatar}
                      alt={postDetail.author.name}
                      width={32}
                      height={32}
                      className={cn(
                        /* 아바타 이미지 */
                        "h-full w-full object-cover",
                      )}
                    />
                  </div>
                  <span className={cn(
                    /* 작성자 이름 */
                    "font-medium",
                  )}>{postDetail.author.name}</span>
                  <span className={cn(
                    /* 구분자 */
                    "mx-2 text-muted-foreground",
                  )}>•</span>
                  <span className={cn(
                    /* 작성일 */
                    "text-muted-foreground",
                  )}>{postDetail.date}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={cn(
                /* 게시글 내용 */
                "prose max-w-none",
              )}>
                {postDetail.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className={cn(
                    /* 문단 */
                    "mb-4",
                  )}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
            <CardFooter className={cn(
              /* 게시글 푸터 */
              "flex items-center justify-between border-t p-4",
            )}>
              <div className={cn(
                /* 게시글 통계 */
                "flex space-x-4 text-sm text-muted-foreground",
              )}>
                <span>조회 {postDetail.views}</span>
                <span>댓글 {postDetail.comments}</span>
              </div>
              <div className={cn(
                /* 액션 버튼 */
                "flex space-x-2",
              )}>
                <Button
                  variant={isLiked ? "default" : "outline"}
                  size="sm"
                  onClick={toggleLike}
                  className={cn(
                    /* 좋아요 버튼 */
                    "flex items-center space-x-1",
                  )}
                >
                  <span>👍</span>
                  <span>좋아요 {likeCount}</span>
                </Button>
                <Button variant="outline" size="sm">
                  공유
                </Button>
                <Button variant="outline" size="sm">
                  북마크
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          {/* 댓글 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle>댓글 {comments.length}개</CardTitle>
            </CardHeader>
            <CardContent className={cn(
              /* 댓글 컨테이너 */
              "space-y-6",
            )}>
              {/* 댓글 작성 폼 */}
              <form onSubmit={handleCommentSubmit} className={cn(
                /* 댓글 폼 */
                "mb-6 space-y-4",
              )}>
                <Textarea
                  placeholder="댓글을 작성해주세요..."
                  value={commentText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentText(e.target.value)}
                  className={cn(
                    /* 댓글 입력창 */
                    "min-h-[100px]",
                  )}
                />
                <div className={cn(
                  /* 버튼 컨테이너 */
                  "flex justify-end",
                )}>
                  <Button type="submit">댓글 작성</Button>
                </div>
              </form>
              
              {/* 댓글 목록 */}
              <div className={cn(
                /* 댓글 목록 */
                "space-y-4",
              )}>
                {comments.map((comment) => (
                  <div key={comment.id} className={cn(
                    /* 댓글 아이템 */
                    "rounded-lg border p-4",
                  )}>
                    <div className={cn(
                      /* 댓글 헤더 */
                      "mb-2 flex items-center",
                    )}>
                      <div className={cn(
                        /* 아바타 컨테이너 */
                        "mr-2 h-8 w-8 overflow-hidden rounded-full",
                      )}>
                        <Image
                          src={comment.user.avatar}
                          alt={comment.user.name}
                          width={32}
                          height={32}
                          className={cn(
                            /* 아바타 이미지 */
                            "h-full w-full object-cover",
                          )}
                        />
                      </div>
                      <span className={cn(
                        /* 사용자 이름 */
                        "font-medium",
                      )}>{comment.user.name}</span>
                      <span className={cn(
                        /* 구분자 */
                        "mx-2 text-muted-foreground",
                      )}>•</span>
                      <span className={cn(
                        /* 작성일 */
                        "text-muted-foreground",
                      )}>{comment.date}</span>
                    </div>
                    <p className={cn(
                      /* 댓글 내용 */
                      "mb-2 text-sm",
                    )}>
                      {comment.content}
                    </p>
                    <div className={cn(
                      /* 댓글 푸터 */
                      "flex items-center justify-between text-sm",
                    )}>
                      <Button variant="ghost" size="sm" className={cn(
                        /* 좋아요 버튼 */
                        "h-8 px-2",
                      )}>
                        👍 {comment.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className={cn(
                        /* 답글 버튼 */
                        "h-8 px-2",
                      )}>
                        답글
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* 사이드바 */}
        <div className={cn(
          /* 사이드바 */
          "md:col-span-1",
        )}>
          {/* 작성자 정보 */}
          <Card className={cn(
            /* 작성자 카드 */
            "mb-6",
          )}>
            <CardHeader>
              <CardTitle className={cn(
                /* 카드 제목 */
                "text-lg",
              )}>작성자</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn(
                /* 작성자 정보 */
                "flex flex-col items-center",
              )}>
                <div className={cn(
                  /* 아바타 컨테이너 */
                  "mb-4 h-20 w-20 overflow-hidden rounded-full",
                )}>
                  <Image
                    src={postDetail.author.avatar}
                    alt={postDetail.author.name}
                    width={80}
                    height={80}
                    className={cn(
                      /* 아바타 이미지 */
                      "h-full w-full object-cover",
                    )}
                  />
                </div>
                <h3 className={cn(
                  /* 작성자 이름 */
                  "mb-2 text-lg font-medium",
                )}>{postDetail.author.name}</h3>
                <Button variant="outline" size="sm" className={cn(
                  /* 프로필 버튼 */
                  "w-full",
                )}>
                  프로필 보기
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* 관련 게시글 */}
          <Card>
            <CardHeader>
              <CardTitle className={cn(
                /* 카드 제목 */
                "text-lg",
              )}>관련 게시글</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn(
                /* 관련 게시글 목록 */
                "space-y-4",
              )}>
                {relatedPosts.map((post) => (
                  <Link href={`/community/${post.id}`} key={post.id}>
                    <div className={cn(
                      /* 게시글 아이템 */
                      "rounded-lg p-2 transition-colors hover:bg-secondary/50",
                    )}>
                      <h4 className={cn(
                        /* 게시글 제목 */
                        "mb-1 line-clamp-2 text-sm font-medium",
                      )}>{post.title}</h4>
                      <div className={cn(
                        /* 게시글 정보 */
                        "flex items-center text-xs text-muted-foreground",
                      )}>
                        <span>{post.author}</span>
                        <span className={cn(
                          /* 구분자 */
                          "mx-1",
                        )}>•</span>
                        <span>조회 {post.views}</span>
                        <span className={cn(
                          /* 구분자 */
                          "mx-1",
                        )}>•</span>
                        <span>댓글 {post.comments}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 