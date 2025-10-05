const fetch = require('node-fetch');

async function testAPI() {
  try {
    const sources = ['cnn', 'cnbc', 'tempo'];
    for (const source of sources) {
      console.log(`Testing ${source}...`);
      const response = await fetch(`https://berita-indo-api-next.vercel.app/api/${source}-news/`);
      console.log(`${source} status: ${response.status}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`${source} data length: ${data.data ? data.data.length : 'no data'}`);
        if (data.data && data.data.length > 0) {
          console.log(`${source} sample article:`, data.data[0].title);
        }
      } else {
        console.log(`${source} error: ${response.statusText}`);
      }
      console.log('---');
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
}

testAPI();