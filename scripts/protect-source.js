#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files to protect from corruption
const PROTECTED_FILES = [
  'src/App.tsx',
  'src/pages/Camera.tsx',
  'src/pages/Dashboard.tsx',
  'src/pages/Home.tsx',
  'src/pages/Reports.tsx',
  'src/pages/Profile.tsx'
];

function isCorruptedFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Check for API error JSON
    if (content.startsWith('{"code":"rate-limited"') || 
        content.includes('"message":"You have hit the rate limit"')) {
      return true;
    }
    
    // Check for malformed React files
    if (filePath.endsWith('.tsx') && !content.includes('import') && content.startsWith('{')) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return false;
  }
}

function restoreFile(filePath) {
  const basePath = filePath.replace('.tsx', '.base.tsx');
  
  if (fs.existsSync(basePath)) {
    try {
      fs.copyFileSync(basePath, filePath);
      console.log(`✅ Restored ${filePath} from ${basePath}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to restore ${filePath}:`, error.message);
      return false;
    }
  } else {
    console.warn(`⚠️ No backup found for ${filePath}`);
    return false;
  }
}

function checkAndRepair() {
  console.log('🔍 Checking protected files for corruption...');
  
  let corruptedFiles = 0;
  let repairedFiles = 0;
  
  for (const filePath of PROTECTED_FILES) {
    if (fs.existsSync(filePath)) {
      if (isCorruptedFile(filePath)) {
        console.log(`🚨 Corrupted file detected: ${filePath}`);
        corruptedFiles++;
        
        if (restoreFile(filePath)) {
          repairedFiles++;
        }
      } else {
        console.log(`✅ ${filePath} is clean`);
      }
    } else {
      console.warn(`⚠️ Protected file not found: ${filePath}`);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Corrupted files: ${corruptedFiles}`);
  console.log(`   Repaired files: ${repairedFiles}`);
  
  if (corruptedFiles > 0 && repairedFiles === corruptedFiles) {
    console.log(`🎉 All corrupted files have been repaired!`);
  } else if (corruptedFiles > 0) {
    console.log(`⚠️ Some files could not be repaired. Check backups manually.`);
  }
}

// Git pre-commit hook function
function setupGitHook() {
  const hookPath = '.git/hooks/pre-commit';
  const hookContent = `#!/bin/sh
# Check for corrupted source files before commit
node scripts/protect-source.js

if [ $? -ne 0 ]; then
  echo "❌ Commit blocked: Corrupted source files detected"
  exit 1
fi
`;

  try {
    fs.writeFileSync(hookPath, hookContent, { mode: 0o755 });
    console.log('✅ Git pre-commit hook installed');
  } catch (error) {
    console.warn('⚠️ Could not install Git hook:', error.message);
  }
}

// Main execution
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'check':
      checkAndRepair();
      break;
    case 'setup-hook':
      setupGitHook();
      break;
    default:
      checkAndRepair();
      break;
  }
}

module.exports = { isCorruptedFile, restoreFile, checkAndRepair };