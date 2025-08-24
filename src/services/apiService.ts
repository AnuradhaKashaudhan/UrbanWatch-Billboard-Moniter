export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    retryAfter?: number;
  };
}

export class APIError extends Error {
  constructor(
    public code: string,
    message: string,
    public retryAfter?: number,
    public isRetryable: boolean = false
  ) {
    super(message);
    this.name = 'APIError';
  }
}

class APIService {
  private baseURL = process.env.REACT_APP_API_URL || '/api';
  private retryAttempts = 3;
  private retryDelay = 1000; // 1 second

  async fetchAIResponse(prompt: string): Promise<APIResponse> {
    let lastError: APIError | null = null;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(`${this.baseURL}/ai`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });

        const data = await response.json();

        // Handle rate limiting
        if (data.code === 'rate-limited') {
          const retryAfter = data.retryAfter || 60; // Default 60 seconds
          lastError = new APIError(
            'rate-limited',
            `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
            retryAfter,
            true
          );

          if (attempt < this.retryAttempts) {
            console.warn(`⏳ Rate limited, retrying in ${this.retryDelay}ms (attempt ${attempt}/${this.retryAttempts})`);
            await this.delay(this.retryDelay);
            continue;
          }
          
          throw lastError;
        }

        // Handle other API errors
        if (!response.ok || data.error) {
          throw new APIError(
            data.code || 'api_error',
            data.message || 'API request failed',
            undefined,
            response.status >= 500 // Server errors are retryable
          );
        }

        return {
          success: true,
          data: data
        };

      } catch (error) {
        lastError = error instanceof APIError ? error : new APIError(
          'network_error',
          error instanceof Error ? error.message : 'Network request failed',
          undefined,
          true
        );

        if (attempt < this.retryAttempts && lastError.isRetryable) {
          console.warn(`🔄 Request failed, retrying in ${this.retryDelay}ms (attempt ${attempt}/${this.retryAttempts})`);
          await this.delay(this.retryDelay);
          continue;
        }

        break;
      }
    }

    console.error('❌ AI API error after all retries:', lastError);
    return {
      success: false,
      error: {
        code: lastError?.code || 'unknown_error',
        message: lastError?.message || 'Unknown error occurred',
        retryAfter: lastError?.retryAfter
      }
    };
  }

  async analyzeImage(imageData: string, location: { lat: number; lng: number }): Promise<APIResponse> {
    try {
      const response = await this.fetchAIResponse(`Analyze billboard image at location ${location.lat}, ${location.lng}`);
      
      if (!response.success) {
        return response;
      }

      // Mock AI analysis result for demo
      const analysisResult = {
        isUnauthorized: Math.random() > 0.6,
        confidence: Math.floor(Math.random() * 30) + 70,
        violations: [
          'Billboard exceeds permitted dimensions',
          'Missing license QR code',
          'Inappropriate content detected'
        ].slice(0, Math.floor(Math.random() * 3) + 1),
        structuralHazards: Math.random() > 0.7 ? ['Visible rust detected', 'Billboard appears tilted'] : [],
        location: location,
        timestamp: new Date().toISOString()
      };

      return {
        success: true,
        data: analysisResult
      };

    } catch (error) {
      console.error('Image analysis failed:', error);
      return {
        success: false,
        error: {
          code: 'analysis_failed',
          message: 'Failed to analyze image'
        }
      };
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Graceful degradation for offline scenarios
  async withFallback<T>(
    primaryFn: () => Promise<T>,
    fallbackFn: () => T,
    errorMessage: string = 'Service temporarily unavailable'
  ): Promise<T> {
    try {
      return await primaryFn();
    } catch (error) {
      console.warn(`⚠️ ${errorMessage}, using fallback:`, error);
      return fallbackFn();
    }
  }
}

export const apiService = new APIService();