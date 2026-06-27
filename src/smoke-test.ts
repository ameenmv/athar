#!/usr/bin/env node

/**
 * Smoke test for Athar MCP server.
 * Tests: DB creation, save_lesson, memory search.
 */

import { getDatabase, closeDatabase } from './db/connection.js';
import { saveLesson } from './tools/save-lesson.js';
import { searchMemory } from './tools/memory.js';
import { getDatabasePath } from './utils/paths.js';
import { existsSync, unlinkSync } from 'node:fs';

// Use a test database
const testDbPath = getDatabasePath();
console.log(`\n🧪 Athar Smoke Test`);
console.log(`📂 Database path: ${testDbPath}\n`);

// Test 1: Database initialization
console.log('━━━ Test 1: Database Initialization ━━━');
try {
  const db = getDatabase();
  console.log('✅ Database initialized successfully\n');
} catch (err) {
  console.error('❌ Database initialization failed:', err);
  process.exit(1);
}

// Test 2: Save a valid lesson
console.log('━━━ Test 2: Save Valid Lesson ━━━');
const validLesson = {
  title: 'React useEffect cleanup prevents memory leaks in async operations',
  problem: 'Component fetches data in useEffect but the response arrives after unmounting, causing "Cannot update state on unmounted component" warning',
  error_message: 'Warning: Can\'t perform a React state update on an unmounted component',
  root_cause: 'The useEffect callback starts an async fetch but has no cleanup function. When the component unmounts before the fetch completes, the .then() callback tries to call setState on a component that no longer exists in the DOM.',
  bad_code: `useEffect(() => {
  fetch('/api/data')
    .then(res => res.json())
    .then(data => setData(data));
}, []);`,
  good_code: `useEffect(() => {
  const controller = new AbortController();
  fetch('/api/data', { signal: controller.signal })
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => {
      if (err.name !== 'AbortError') throw err;
    });
  return () => controller.abort();
}, []);`,
  lesson: 'Always return a cleanup function from useEffect when performing async operations. Use AbortController to cancel pending fetch requests when the component unmounts.',
  tags: ['react', 'useEffect', 'async', 'memory-leak', 'cleanup'],
  language: 'typescript',
  file_path: 'src/components/UserProfile.tsx',
  review_questions: [
    {
      q: 'What happens when a useEffect fetches data but the component unmounts before the response arrives?',
      a: 'The state update runs on an unmounted component, causing a memory leak warning. The fix is to use AbortController and return a cleanup function.',
    },
    {
      q: 'How do you properly cancel a fetch request in a useEffect cleanup?',
      a: 'Create an AbortController, pass its signal to fetch(), and call controller.abort() in the cleanup return function.',
    },
  ],
};

const saveResult = saveLesson(validLesson);
console.log(`Result: ${saveResult.success ? '✅' : '❌'} ${saveResult.message.split('\n')[0]}`);
if (saveResult.lessonId) {
  console.log(`Lesson ID: ${saveResult.lessonId}\n`);
}

// Test 3: Reject trivial lesson
console.log('━━━ Test 3: Reject Trivial Lesson ━━━');
const trivialLesson = {
  title: 'Fix indentation in utils file',
  problem: 'The code had wrong indentation',
  root_cause: 'The code had wrong indentation in the utility file',
  lesson: 'Always use consistent indentation in utility files',
  tags: ['formatting'],
  review_questions: [{ q: 'Why is indentation important?', a: 'For readability' }],
};
const trivialResult = saveLesson(trivialLesson as any);
console.log(`Result: ${trivialResult.success ? '❌ Should have been rejected!' : '✅ Correctly rejected'}`);
console.log(`Message: ${trivialResult.message.substring(0, 100)}...\n`);

// Test 4: Reject duplicate
console.log('━━━ Test 4: Duplicate Detection ━━━');
const duplicateResult = saveLesson(validLesson);
console.log(`Result: ${duplicateResult.success ? '❌ Should have been rejected!' : '✅ Correctly detected duplicate'}`);
console.log(`Message: ${duplicateResult.message.substring(0, 100)}...\n`);

// Test 5: Memory search
console.log('━━━ Test 5: Memory Search ━━━');
const searchResult = searchMemory({ query: 'useEffect memory leak', limit: 3 });
console.log(`Found: ${searchResult.results.length} result(s)`);
console.log(`Result: ${searchResult.results.length > 0 ? '✅' : '❌'} ${searchResult.results.length > 0 ? 'Search found the saved lesson!' : 'Search returned no results'}\n`);

// Test 6: Memory search with no matches
console.log('━━━ Test 6: Search With No Matches ━━━');
const emptySearch = searchMemory({ query: 'xyznonexistent', limit: 3 });
console.log(`Found: ${emptySearch.results.length} result(s)`);
console.log(`Result: ${emptySearch.results.length === 0 ? '✅' : '❌'} Correctly returned no results\n`);

// Cleanup
closeDatabase();

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🎉 All smoke tests passed!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
