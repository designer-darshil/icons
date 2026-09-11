/**
 * Automated Icon System Linter for GRIDFRAME
 * Validates canvas viewBox, 2px stroke system, geometry safe zones, naming, and metadata.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { Icon } from '../src/types/icon';
import { lintIconRecord, type IconLintResult } from '../src/lib/svg/validateIconSystem';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATALOG_JSON_PATH = path.resolve(__dirname, '../src/data/icons/catalog.json');

function runIconLinter() {
  console.log('🔍 Starting GRIDFRAME Icon System Linter...\n');

  if (!fs.existsSync(CATALOG_JSON_PATH)) {
    console.error('❌ Error: catalog.json not found. Run scripts/import-all-icons.ts first.');
    process.exit(1);
  }

  const catalog: Icon[] = JSON.parse(fs.readFileSync(CATALOG_JSON_PATH, 'utf-8'));
  const isFullAudit = process.argv.includes('--all');

  const iconsToAudit = isFullAudit ? catalog : catalog.slice(0, 500);
  console.log(`Auditing ${iconsToAudit.length} icons (Mode: ${isFullAudit ? 'Full Catalog' : 'Quick Developer Sample'})...\n`);

  let totalErrors = 0;
  let totalWarnings = 0;
  let perfectCount = 0;
  const flaggedResults: IconLintResult[] = [];

  for (const icon of iconsToAudit) {
    const result = lintIconRecord(icon);
    totalErrors += result.errors.length;
    totalWarnings += result.warnings.length;

    if (result.isValid && result.warnings.length === 0) {
      perfectCount++;
    } else if (result.errors.length > 0 || result.warnings.length > 0) {
      flaggedResults.push(result);
    }
  }

  // Display top diagnostics
  if (flaggedResults.length > 0) {
    console.log('📋 Diagnostic Findings:');
    const sample = flaggedResults.slice(0, 15);
    for (const res of sample) {
      for (const err of res.errors) {
        console.error(`  [ERROR] ${res.slug}: ${err.message}`);
      }
      for (const warn of res.warnings) {
        console.warn(`  [WARNING] ${res.slug}: ${warn.message}`);
      }
    }

    if (flaggedResults.length > 15) {
      console.log(`  ... and ${flaggedResults.length - 15} more flagged icons.\n`);
    }
  }

  console.log('\n======================================================');
  console.log('          GRIDFRAME ICON LINT REPORT');
  console.log('======================================================');
  console.log(`Total Icons Audited:   ${iconsToAudit.length.toLocaleString()}`);
  console.log(`100% Compliant Icons:  ${perfectCount.toLocaleString()} (${((perfectCount / iconsToAudit.length) * 100).toFixed(1)}%)`);
  console.log(`Total Hard Errors:     ${totalErrors}`);
  console.log(`Total Warnings:        ${totalWarnings}`);
  console.log('======================================================\n');

  if (totalErrors > 0) {
    console.error('❌ Icon linting failed with hard errors.');
    process.exit(1);
  } else {
    console.log('✅ ICON SYSTEM LINT PASSED: All audited icons adhere to GRIDFRAME standards!');
  }
}

runIconLinter();
