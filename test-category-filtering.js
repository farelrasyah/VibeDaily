// Test script to verify category filtering functionality
// Run this in the browser console to test the category system

import { newsService } from './src/lib/api/index.js';
import { 
  getCategoriesForSource, 
  buildApiUrl, 
  isValidCategoryForSource,
  getNavigationItems 
} from './src/lib/news-categories.js';

console.log('🧪 Testing Category Filtering System...\n');

// Test 1: Check category mappings
console.log('📋 Test 1: Category Mappings');
const cnnCategories = getCategoriesForSource('cnn');
console.log('CNN Categories:', cnnCategories.map(c => c.name).join(', '));

const antaraCategories = getCategoriesForSource('antara');
console.log('Antara Categories:', antaraCategories.map(c => c.name).join(', '));

const cnbcCategories = getCategoriesForSource('cnbc');
console.log('CNBC Categories:', cnbcCategories.map(c => c.name).join(', '));

// Test 2: URL building
console.log('\n🔗 Test 2: URL Building');
console.log('CNN Nasional URL:', buildApiUrl('cnn', 'nasional'));
console.log('Antara Terkini URL:', buildApiUrl('antara', 'terkini'));
console.log('CNBC Market URL:', buildApiUrl('cnbc', 'market'));

// Test 3: Category validation
console.log('\n✅ Test 3: Category Validation');
console.log('CNN has "nasional":', isValidCategoryForSource('cnn', 'nasional'));
console.log('CNN has "invalid":', isValidCategoryForSource('cnn', 'invalid'));
console.log('Antara has "terkini":', isValidCategoryForSource('antara', 'terkini'));
console.log('Antara has "invalid":', isValidCategoryForSource('antara', 'invalid'));

// Test 4: Navigation items
console.log('\n🧭 Test 4: Navigation Items');
const navItems = getNavigationItems();
navItems.forEach(item => {
  console.log(`${item.label} (${item.source}): ${item.dropdownItems.length} categories`);
});

// Test 5: API calls (async test)
async function testApiCalls() {
  console.log('\n📡 Test 5: API Calls');
  
  try {
    console.log('Testing CNN Nasional...');
    const cnnNasional = await newsService.getNewsBySourceAndCategory('cnn', 'nasional', 5);
    console.log(`✅ CNN Nasional: ${cnnNasional.length} articles`);
    
    console.log('Testing Antara Terkini...');
    const antaraTerkini = await newsService.getNewsBySourceAndCategory('antara', 'terkini', 5);
    console.log(`✅ Antara Terkini: ${antaraTerkini.length} articles`);
    
    console.log('Testing CNBC Market...');
    const cnbcMarket = await newsService.getNewsBySourceAndCategory('cnbc', 'market', 5);
    console.log(`✅ CNBC Market: ${cnbcMarket.length} articles`);
    
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

// Run async test
testApiCalls().then(() => {
  console.log('\n🎉 All tests completed!');
});

export { testApiCalls };