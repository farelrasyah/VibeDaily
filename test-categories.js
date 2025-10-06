const { buildApiUrl, NEWS_SOURCE_CATEGORIES } = require('./src/lib/news-categories.ts');

console.log('=== NEWS CATEGORY MAPPING TEST ===');
console.log('CNN Categories:', NEWS_SOURCE_CATEGORIES.cnn.categories);
console.log('CNN internasional URL:', buildApiUrl('cnn', 'internasional'));

// Test the actual API call
const testApiCall = async () => {
  const url = buildApiUrl('cnn', 'internasional');
  console.log('Testing API call to:', url);

  try {
    const response = await fetch(url);
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (response.ok) {
      const data = await response.json();
      console.log('Data received:', {
        hasData: !!data.data,
        dataLength: data.data ? data.data.length : 0,
        total: data.total,
        messages: data.messages
      });
    } else {
      console.log('Response text:', await response.text());
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
};

testApiCall();