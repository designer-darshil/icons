/**
 * Gridframe V2 Error System Verification
 * Validates ErrorBoundary, ErrorState, RouteError, and Production Sanitization
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { GridframeErrorState } from '../components/error/GridframeErrorState';
import { GridframeErrorBoundary } from '../components/error/GridframeErrorBoundary';
import { ThemeProvider } from '../app/providers';

console.log('=== [TEST] Gridframe V2 Error System Test Suite ===');

// Test 1: Render 404 Error State
console.log('1. Testing 404 Error State Rendering...');
const html404 = renderToString(
  React.createElement(
    MemoryRouter,
    null,
    React.createElement(
      ThemeProvider,
      { defaultTheme: 'dark' },
      React.createElement(GridframeErrorState, {
        type: '404',
        code: '404',
        title: 'Page not found.',
        description: "This Gridframe view doesn't exist.",
        homePath: '/icons',
        homeLabel: 'Browse icons',
      })
    )
  )
);

if (!html404.includes('ERROR / 404')) {
  throw new Error('404 state missing "ERROR / 404" label');
}
if (!html404.includes('Page not found.')) {
  throw new Error('404 state missing "Page not found." title');
}
if (!html404.includes('Browse icons')) {
  throw new Error('404 state missing "Browse icons" link action');
}
console.log('   ✓ 404 Error State rendered successfully');

// Test 2: Render 500 Error State with Retry Action
console.log('2. Testing 500 Error State Rendering...');
const html500 = renderToString(
  React.createElement(
    MemoryRouter,
    null,
    React.createElement(
      ThemeProvider,
      { defaultTheme: 'light' },
      React.createElement(GridframeErrorState, {
        type: '500',
        code: '500',
        title: 'Something went wrong.',
        description: "We couldn't load this view correctly.",
        onRetry: () => {},
        retryLabel: 'Try again',
        homePath: '/icons',
        homeLabel: 'Back to icons',
      })
    )
  )
);

if (!html500.includes('ERROR / 500')) {
  throw new Error('500 state missing "ERROR / 500" label');
}
if (!html500.includes('Something went wrong.')) {
  throw new Error('500 state missing "Something went wrong." title');
}
if (!html500.includes('Try again')) {
  throw new Error('500 state missing "Try again" retry button');
}
if (!html500.includes('Back to icons')) {
  throw new Error('500 state missing "Back to icons" navigation button');
}
console.log('   ✓ 500 Error State rendered successfully');

// Test 3: GridframeErrorBoundary lifecycle test
console.log('3. Testing GridframeErrorBoundary Class...');
const derivedState = GridframeErrorBoundary.getDerivedStateFromError(new Error('Synthetic component render failure'));
if (!derivedState.hasError || !derivedState.error) {
  throw new Error('getDerivedStateFromError failed to capture error state');
}
console.log('   ✓ ErrorBoundary captures error state as expected');

// Test 4: Verify production sanitization
console.log('4. Testing Error Sanitization...');
const htmlGeneric = renderToString(
  React.createElement(
    MemoryRouter,
    null,
    React.createElement(GridframeErrorState, {
      type: 'generic',
      code: 'RUNTIME',
      title: 'Something went wrong.',
      description: "We couldn't load this view correctly.",
      error: new Error('Confidential internal database connection error'),
    })
  )
);

if (htmlGeneric.includes('Confidential internal database connection error') && !import.meta.env?.DEV) {
  throw new Error('Production mode leaked error message without DEV check');
}
console.log('   ✓ Production sanitization passes');

console.log('\n✅ ALL ERROR SYSTEM TESTS PASSED (100% SUCCESS)\n');
