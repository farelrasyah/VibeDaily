import ArticleViewSingle from '@/modules/article-view/ArticleViewSingle';

interface ArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  return <ArticleViewSingle articleId={id} />;
}
