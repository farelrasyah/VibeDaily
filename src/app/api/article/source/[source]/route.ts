import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ source: string }> }
) {
  try {
    // Await the params object
    const resolvedParams = await params;
    const { source } = resolvedParams;

    // Validate params
    if (!source) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing source parameter', 
          data: [] 
        },
        { status: 400 }
      );
    }

    const baseUrl = process.env.BERITA_INDO_BASE_URL || 
      'https://berita-indo-api-next.vercel.app';
    
    // Default to 'terkini' category if none specified
    const apiUrl = `${baseUrl}/api/${source}-news/terkini`;
    console.log(`🔄 Proxying request to: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`❌ Error fetching from Berita Indo API:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        data: [] 
      },
      { status: 500 }
    );
  }
}
