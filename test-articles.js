const { newsService } = require('./src/lib/api/index.ts');

async function test() {
  try {
    const articles = await newsService.getMixedNews(5);
    console.log('Sample articles:');
    articles.forEach((article, i) => {
      console.log(`${i+1}. ID: ${article.id}`);
      console.log(`   Title: ${article.title.substring(0, 50)}...`);
      console.log(`   Content length: ${article.content?.length || 0}`);
      console.log(`   Description length: ${article.description?.length || 0}`);
      console.log(`   Has image: ${!!article.imageUrl}`);
      console.log(`   URL: ${article.url}`);
      console.log('');
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

test();