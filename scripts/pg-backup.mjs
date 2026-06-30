#!/usr/bin/env node
/**
 * Phase 5/8 PostgreSQL backup helper.
 *
 * Requires pg_dump in PATH. This script never deletes or restores data.
 */
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('Set DATABASE_URL before running db:backup:pg.');
  process.exit(1);
}

const backupDir = process.env.PG_BACKUP_DIR || join(rootDir, 'database', 'backups');
const label = (process.env.PG_BACKUP_LABEL || 'caffeapp')
  .replace(/[^a-zA-Z0-9_-]+/g, '-')
  .replace(/^-|-$/g, '');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const outputFile = join(backupDir, `${label}-${timestamp}.dump`);

mkdirSync(backupDir, { recursive: true });

const args = ['--format=custom', '--no-owner', '--no-acl', '--file', outputFile, databaseUrl];

console.log('Starting PostgreSQL backup with pg_dump');
console.log(`Output: ${outputFile}`);

const child = spawn('pg_dump', args, { stdio: 'inherit' });

child.on('exit', (code) => {
  if (code === 0) {
    console.log(`Backup complete: ${outputFile}`);
  } else {
    console.error(`pg_dump failed with exit code ${code ?? 'unknown'}`);
    process.exitCode = code ?? 1;
  }
});
