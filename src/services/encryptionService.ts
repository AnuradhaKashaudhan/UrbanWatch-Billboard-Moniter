import CryptoJS from 'crypto-js';

class EncryptionService {
  private readonly secretKey = 'URBANWATCH_SECRET_KEY_2024'; // In production, use environment variable

  encryptData(data: any): string {
    try {
      const jsonString = JSON.stringify(data);
      const encrypted = CryptoJS.AES.encrypt(jsonString, this.secretKey).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  decryptData(encryptedData: string): any {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
      const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  hashData(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }

  generateSecureId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2);
    const combined = timestamp + random;
    return this.hashData(combined).substring(0, 16);
  }

  encryptFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
          const encrypted = CryptoJS.AES.encrypt(wordArray, this.secretKey).toString();
          resolve(encrypted);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  validateDataIntegrity(data: any, hash: string): boolean {
    const computedHash = this.hashData(JSON.stringify(data));
    return computedHash === hash;
  }

  createSecureToken(userId: string, expirationHours: number = 24): string {
    const payload = {
      userId,
      timestamp: Date.now(),
      expiresAt: Date.now() + (expirationHours * 60 * 60 * 1000)
    };
    
    return this.encryptData(payload);
  }

  validateSecureToken(token: string): { valid: boolean; userId?: string; expired?: boolean } {
    try {
      const payload = this.decryptData(token);
      const now = Date.now();
      
      if (now > payload.expiresAt) {
        return { valid: false, expired: true };
      }
      
      return { valid: true, userId: payload.userId };
    } catch (error) {
      return { valid: false };
    }
  }
}

export const encryptionService = new EncryptionService();