import { createWorker } from 'tesseract.js';

export interface AIAnalysisResult {
  isUnauthorized: boolean;
  confidence: number;
  violations: string[];
  structuralHazards: string[];
  obsceneContent: string[];
  politicalContent: string[];
  qrCodeDetected: boolean;
  billboardInfo: {
    size: string;
    location: string;
    content: string;
    structuralCondition: 'good' | 'fair' | 'poor' | 'dangerous';
    estimatedAge: string;
  };
  privacyBlurred: boolean;
}

export interface DroneDetectionResult {
  totalBillboards: number;
  violations: Array<{
    id: string;
    coordinates: { lat: number; lng: number };
    violationType: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    imageUrl: string;
  }>;
  coverage: {
    areaScanned: number; // in sq km
    flightTime: number; // in minutes
    batteryUsed: number; // percentage
  };
}

class AIService {
  private obsceneWords = [
    'inappropriate', 'offensive', 'vulgar', 'explicit', 'adult',
    // Add more words based on local regulations
  ];

  private politicalKeywords = [
    'vote', 'election', 'party', 'candidate', 'political',
    'campaign', 'rally', 'minister', 'government'
  ];

  async analyzeImage(imageData: string, location: { lat: number; lng: number }): Promise<AIAnalysisResult> {
    try {
      // Simulate comprehensive AI analysis
      const analysis = await this.performMultiLayerAnalysis(imageData, location);
      
      // Apply privacy protection
      const privacyProtectedImage = await this.applyPrivacyProtection(imageData);
      
      return {
        ...analysis,
        privacyBlurred: privacyProtectedImage.facesBlurred || privacyProtectedImage.licensePlatesBlurred
      };
    } catch (error) {
      console.error('AI Analysis failed:', error);
      throw new Error('Failed to analyze image');
    }
  }

  private async performMultiLayerAnalysis(imageData: string, location: { lat: number; lng: number }): Promise<Omit<AIAnalysisResult, 'privacyBlurred'>> {
    // Simulate OCR text extraction
    const extractedText = await this.performOCR(imageData);
    
    // Analyze for obscene content
    const obsceneContent = this.detectObsceneContent(extractedText);
    
    // Analyze for political content
    const politicalContent = this.detectPoliticalContent(extractedText);
    
    // Structural hazard detection
    const structuralHazards = await this.detectStructuralHazards(imageData);
    
    // QR code detection
    const qrCodeDetected = await this.detectQRCode(imageData);
    
    // Size and placement analysis
    const sizeViolations = this.analyzeSizeCompliance(imageData, location);
    
    // Combine all violations
    const violations = [
      ...obsceneContent.map(word => `Inappropriate content detected: "${word}"`),
      ...politicalContent.map(word => `Political content detected: "${word}"`),
      ...sizeViolations,
      ...(qrCodeDetected ? [] : ['Missing required QR code with license information']),
      ...this.checkPlacementViolations(location)
    ];

    const isUnauthorized = violations.length > 0 || structuralHazards.length > 0;
    
    return {
      isUnauthorized,
      confidence: Math.floor(Math.random() * 30) + 70,
      violations,
      structuralHazards,
      obsceneContent,
      politicalContent,
      qrCodeDetected,
      billboardInfo: {
        size: `${Math.floor(Math.random() * 20) + 30}x${Math.floor(Math.random() * 10) + 15} ft`,
        location: `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
        content: extractedText.substring(0, 100) || 'Commercial Advertisement',
        structuralCondition: this.assessStructuralCondition(structuralHazards),
        estimatedAge: `${Math.floor(Math.random() * 5) + 1} years`
      }
    };
  }

  private async performOCR(imageData: string): Promise<string> {
    try {
      // Simulate OCR processing
      const sampleTexts = [
        'MEGA SALE - 50% OFF',
        'New Restaurant Opening Soon',
        'Vote for Change - Election 2024',
        'Premium Quality Products',
        'Contact: 9876543210'
      ];
      
      return sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    } catch (error) {
      console.error('OCR failed:', error);
      return '';
    }
  }

  private detectObsceneContent(text: string): string[] {
    const foundWords: string[] = [];
    const lowerText = text.toLowerCase();
    
    this.obsceneWords.forEach(word => {
      if (lowerText.includes(word.toLowerCase())) {
        foundWords.push(word);
      }
    });
    
    return foundWords;
  }

  private detectPoliticalContent(text: string): string[] {
    const foundWords: string[] = [];
    const lowerText = text.toLowerCase();
    
    this.politicalKeywords.forEach(word => {
      if (lowerText.includes(word.toLowerCase())) {
        foundWords.push(word);
      }
    });
    
    return foundWords;
  }

  private async detectStructuralHazards(imageData: string): Promise<string[]> {
    // Simulate structural analysis
    const hazards: string[] = [];
    const random = Math.random();
    
    if (random > 0.7) {
      hazards.push('Visible rust and corrosion detected');
    }
    if (random > 0.8) {
      hazards.push('Billboard appears tilted or unstable');
    }
    if (random > 0.85) {
      hazards.push('Structural cracks visible in support frame');
    }
    if (random > 0.9) {
      hazards.push('Loose or damaged panels detected');
    }
    
    return hazards;
  }

  private async detectQRCode(imageData: string): Promise<boolean> {
    // Simulate QR code detection
    return Math.random() > 0.4; // 60% chance of QR code being present
  }

  private analyzeSizeCompliance(imageData: string, location: { lat: number; lng: number }): string[] {
    const violations: string[] = [];
    
    // Simulate size analysis
    const estimatedWidth = Math.floor(Math.random() * 30) + 20;
    const estimatedHeight = Math.floor(Math.random() * 20) + 10;
    
    if (estimatedWidth > 40) {
      violations.push(`Billboard width (${estimatedWidth}ft) exceeds maximum limit of 40ft`);
    }
    
    if (estimatedHeight > 20) {
      violations.push(`Billboard height (${estimatedHeight}ft) exceeds maximum limit of 20ft`);
    }
    
    return violations;
  }

  private checkPlacementViolations(location: { lat: number; lng: number }): string[] {
    const violations: string[] = [];
    
    // Simulate proximity checks
    if (Math.random() > 0.6) {
      violations.push('Billboard placed within 200m of traffic signal');
    }
    
    if (Math.random() > 0.7) {
      violations.push('Billboard blocking visibility of road signs');
    }
    
    if (Math.random() > 0.8) {
      violations.push('Billboard placed in no-advertising zone near school/hospital');
    }
    
    return violations;
  }

  private assessStructuralCondition(hazards: string[]): 'good' | 'fair' | 'poor' | 'dangerous' {
    if (hazards.length === 0) return 'good';
    if (hazards.length === 1) return 'fair';
    if (hazards.length === 2) return 'poor';
    return 'dangerous';
  }

  private async applyPrivacyProtection(imageData: string): Promise<{ facesBlurred: boolean; licensePlatesBlurred: boolean }> {
    // Simulate privacy protection processing
    return {
      facesBlurred: Math.random() > 0.7, // 30% chance faces were detected and blurred
      licensePlatesBlurred: Math.random() > 0.8 // 20% chance license plates were detected and blurred
    };
  }

  // Drone Integration Methods
  async initiateDroneSurvey(area: { 
    center: { lat: number; lng: number }; 
    radius: number; // in km
    altitude: number; // in meters
  }): Promise<string> {
    // Simulate drone mission initialization
    const missionId = `DRONE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`Initiating drone survey for area: ${area.center.lat}, ${area.center.lng}`);
    console.log(`Coverage radius: ${area.radius}km at ${area.altitude}m altitude`);
    
    return missionId;
  }

  async getDroneSurveyResults(missionId: string): Promise<DroneDetectionResult> {
    // Simulate drone survey results
    const violations = [];
    const numViolations = Math.floor(Math.random() * 15) + 5;
    
    for (let i = 0; i < numViolations; i++) {
      violations.push({
        id: `VIOLATION_${i + 1}`,
        coordinates: {
          lat: 12.9716 + (Math.random() - 0.5) * 0.1,
          lng: 77.5946 + (Math.random() - 0.5) * 0.1
        },
        violationType: ['Oversized', 'Unauthorized Placement', 'Missing License', 'Structural Hazard'][Math.floor(Math.random() * 4)],
        severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical',
        imageUrl: 'https://images.pexels.com/photos/1666073/pexels-photo-1666073.jpeg'
      });
    }

    return {
      totalBillboards: numViolations + Math.floor(Math.random() * 20) + 10,
      violations,
      coverage: {
        areaScanned: Math.floor(Math.random() * 50) + 25,
        flightTime: Math.floor(Math.random() * 120) + 60,
        batteryUsed: Math.floor(Math.random() * 40) + 60
      }
    };
  }
}

export const aiService = new AIService();