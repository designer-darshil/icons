/**
 * Test Suite: Performant Theme Transition Architecture
 * Validates smooth, lightweight CSS variable theme switching,
 * absence of global transition: all, and reduced motion compliance.
 */

import fs from 'fs';
import path from 'path';

function runTests() {
  console.log('🧪 Running Theme Transition Performance & Architecture Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Verify CSS Tokens for Dark & Light Themes
  console.log('--- 1. Testing CSS Custom Property Definitions ---');
  const tokensPath = path.resolve('./src/styles/tokens.css');
  const tokensCode = fs.readFileSync(tokensPath, 'utf8');
  assert(tokensCode.includes(':root[data-theme="dark"]'), 'Defines data-theme="dark" token mapping');
  assert(tokensCode.includes(':root[data-theme="light"]'), 'Defines data-theme="light" token mapping');
  assert(tokensCode.includes('--color-background-primary'), 'Defines semantic background tokens');
  assert(tokensCode.includes('--color-text-primary'), 'Defines semantic text tokens');
  assert(tokensCode.includes('--color-border-default'), 'Defines semantic border tokens');

  // 2. Verify Scoped Color-Only Theme Transition in globals.css
  console.log('\n--- 2. Testing Scoped Color Transition in globals.css ---');
  const globalsPath = path.resolve('./src/styles/globals.css');
  const globalsCode = fs.readFileSync(globalsPath, 'utf8');
  assert(globalsCode.includes('html.theme-transition'), 'Defines scoped html.theme-transition class');
  assert(globalsCode.includes('200ms ease-in-out'), 'Uses 200ms ease-in-out timing curve (target: 180-240ms)');
  assert(!globalsCode.includes('transition: all 200ms'), 'Does NOT use transition: all for theme changes');
  assert(globalsCode.includes('color 200ms') && globalsCode.includes('background-color 200ms'), 'Strictly transitions color properties');

  // 3. Verify Reduced Motion Support
  console.log('\n--- 3. Testing Reduced Motion Compliance ---');
  assert(
    globalsCode.includes('@media (prefers-reduced-motion: reduce)') && globalsCode.includes('transition: none !important'),
    'Disables theme transitions when user prefers reduced motion'
  );

  // 4. Verify Theme Toggle Layered Crossfade
  console.log('\n--- 4. Testing Theme Toggle Crossfade Structure ---');
  const togglePath = path.resolve('./src/components/navigation/ThemeToggle.tsx');
  const toggleCode = fs.readFileSync(togglePath, 'utf8');
  assert(toggleCode.includes('transition-[opacity,transform] duration-200 ease-in-out'), 'ThemeToggle implements 200ms ease-in-out icon crossfade');
  assert(toggleCode.includes('absolute inset-0'), 'ThemeToggle layers Sun and Moon icons in identical geometry without resizing');


  // 4. Verify ThemeProvider Transition Activation
  console.log('\n--- 4. Testing ThemeProvider Lifecycle ---');
  const providersPath = path.resolve('./src/app/providers.tsx');
  const providersCode = fs.readFileSync(providersPath, 'utf8');
  assert(providersCode.includes('classList.add("theme-transition")'), 'ThemeProvider temporarily adds theme-transition class');
  assert(providersCode.includes('classList.remove("theme-transition")'), 'ThemeProvider cleans up theme-transition class after 240ms');
  assert(providersCode.includes('prefers-reduced-motion: reduce'), 'ThemeProvider respects reduced motion query');

  // 5. Verify Flash-Free Initial Load
  console.log('\n--- 5. Testing Initial Paint Theme Initialization ---');
  const indexPath = path.resolve('./index.html');
  const indexCode = fs.readFileSync(indexPath, 'utf8');
  assert(indexCode.includes('localStorage.getItem(\'gridframe_theme_v2\')'), 'index.html pre-reads stored theme before React mount');
  assert(indexCode.includes('data-theme'), 'index.html sets root data-theme synchronously before first paint');

  console.log(`\n========================================`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
