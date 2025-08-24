import fs from 'fs';
import path from 'path';

export interface APIError {
  code: string;
  message: string;
  providerLimitHit?: boolean;
  isRetryable?: boolean;
}

export function safeWrite(filePath: string, content: string): boolean {
  try {
    // Check if content is JSON error response
    const parsed = JSON.parse(content);
    if (parsed.code && (parsed.code === 'rate-limited' || parsed.message)) {
      console.error('⚠️ API error detected, not writing to source:', parsed);
      console.error('📁 Target file:', filePath);
      console.error('🔄 Suggestion: Try again later or check API limits');
      return false;
    }
  } catch {
    // Not JSON, safe to proceed with write
  }

  // Additional validation for React/TypeScript files
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    if (!isValidReactContent(content)) {
      console.error('⚠️ Invalid React/TypeScript content detected, not writing to:', filePath);
      return false;
    }
  }

  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('✅ Successfully wrote to:', filePath);
    return true;
  } catch (error) {
    console.error('❌ Failed to write file:', filePath, error);
    return false;
  }
}

function isValidReactContent(content: string): boolean {
  // Check for common React/TypeScript patterns
  const hasValidImports = content.includes('import') || content.includes('export');
  const hasValidSyntax = !content.startsWith('{') || content.includes('function') || content.includes('const');
  const isNotErrorJSON = !content.includes('"code":"rate-limited"');
  
  return hasValidImports && hasValidSyntax && isNotErrorJSON;
}

export function createBackup(filePath: string): string | null {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const backupPath = `${filePath}.backup.${Date.now()}`;
    fs.copyFileSync(filePath, backupPath);
    console.log('📋 Backup created:', backupPath);
    return backupPath;
  } catch (error) {
    console.error('❌ Failed to create backup:', error);
    return null;
  }
}

export function restoreFromBackup(filePath: string, backupPath: string): boolean {
  try {
    if (!fs.existsSync(backupPath)) {
      console.error('❌ Backup file not found:', backupPath);
      return false;
    }

    fs.copyFileSync(backupPath, filePath);
    console.log('🔄 Restored from backup:', backupPath);
    return true;
  } catch (error) {
    console.error('❌ Failed to restore from backup:', error);
    return false;
  }
}