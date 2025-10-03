import { NextRequest, NextResponse } from 'next/server';
import { newsService } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    // Decode URL if it's encoded
    const decodedId = decodeURIComponent(id);
    console.log('🔍 API route searching for article ID:', decodedId);
    
    // Fetch article menggunakan server-side untuk menghindari CORS
    const article = await newsService.getArticleById(decodedId);
    
    if (!article) {
      console.log('❌ Article not found in API route');
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    console.log('✅ Article found in API route:', article.title);
    
    return NextResponse.json({ article });
  } catch (error) {
    console.error('❌ API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}