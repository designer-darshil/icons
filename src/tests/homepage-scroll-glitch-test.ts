/**
 * Test Suite: Homepage Scroll Architecture & Glitch Prevention
 * Validates unified single-owner document scroll, Lenis synchronization,
 * ScrollRestoration stability, and useScrollLock reference counting.
 */

import fs from 'fs';
import path from 'path';

function runTests() {
  console.log('🧪 Running Homepage Scroll Glitch & Architecture Test Suite...\n');
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

  // 1. Verify ScrollRestoration
  console.log('--- 1. Testing ScrollRestoration Stability ---');
  const scrollRestorationPath = path.resolve('./src/components/layout/ScrollRestoration.tsx');
  const scrollRestorationCode = fs.readFileSync(scrollRestorationPath, 'utf8');
  assert(
    scrollRestorationCode.includes('prevPathRef.current !== pathname'),
    'ScrollRestoration checks previous pathname and does not reset on Lenis mount state changes'
  );

  // 2. Verify useScrollLock
  console.log('\n--- 2. Testing useScrollLock Reference Counting & Lenis Sync ---');
  const scrollLockPath = path.resolve('./src/hooks/useScrollLock.ts');
  const scrollLockCode = fs.readFileSync(scrollLockPath, 'utf8');
  assert(scrollLockCode.includes('activeLockCount'), 'useScrollLock uses activeLockCount reference counter');
  assert(scrollLockCode.includes('lenis.stop()'), 'useScrollLock pauses Lenis during scroll lock');
  assert(scrollLockCode.includes('lenis.start()'), 'useScrollLock resumes Lenis when all locks release');

  // 3. Verify LenisProvider
  console.log('\n--- 3. Testing Lenis Configuration ---');
  const lenisProviderPath = path.resolve('./src/components/layout/LenisProvider.tsx');
  const lenisProviderCode = fs.readFileSync(lenisProviderPath, 'utf8');
  assert(lenisProviderCode.includes('syncTouch: false'), 'Lenis preserves native touch momentum scrolling');
  assert(lenisProviderCode.includes('cancelAnimationFrame'), 'Lenis cancels animation frame on cleanup');

  // 4. Verify SpecimenGrid Infinite Scroll Sentinel
  console.log('\n--- 4. Testing SpecimenGrid Infinite Scroll ---');
  const specimenGridPath = path.resolve('./src/features/icon-explorer/SpecimenGrid.tsx');
  const specimenGridCode = fs.readFileSync(specimenGridPath, 'utf8');
  assert(specimenGridCode.includes('isLoadingRef'), 'SpecimenGrid guards loadMore against duplicate frame triggers');
  assert(!specimenGridCode.includes('[hasMore, loadMore, renderedCount]'), 'IntersectionObserver does not tear down on renderedCount changes');

  // 5. Verify WorkspaceLayout Document Scroll Ownership
  console.log('\n--- 5. Testing Workspace Layout Scroll Ownership ---');
  const workspaceLayoutPath = path.resolve('./src/components/layout/WorkspaceLayout.tsx');
  const workspaceLayoutCode = fs.readFileSync(workspaceLayoutPath, 'utf8');
  assert(!workspaceLayoutCode.includes('overflow-y-auto pb-20'), 'WorkspaceLayout does not create an accidental nested vertical scroll container');

  // 6. Verify DetailPanel Unified Lock
  console.log('\n--- 6. Testing DetailPanel Scroll Lock ---');
  const detailPanelPath = path.resolve('./src/components/layout/DetailPanel.tsx');
  const detailPanelCode = fs.readFileSync(detailPanelPath, 'utf8');
  assert(detailPanelCode.includes('useScrollLock('), 'DetailPanel uses unified useScrollLock hook');

  console.log(`\n========================================`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
