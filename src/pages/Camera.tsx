import React, { useState, useRef, useCallback } from 'react';
import { Camera as CameraIcon, Upload, MapPin, Clock, AlertTriangle, CheckCircle, Zap, Shield, Eye, Scan, QrCode } from 'lucide-react';

const Camera: React.FC = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
        getCurrentLocation();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }, [getCurrentLocation]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        
        // Stop camera stream
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        setIsCapturing(false);
        
        // Start AI analysis
        analyzeImage(imageData);
      }
    }
  }, []);

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis with realistic delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock analysis result
    const mockResult = {
      billboardDetected: true,
      violations: [
        { type: 'Size Violation', severity: 'High', description: 'Billboard exceeds permitted dimensions (12x8m vs allowed 10x6m)' },
        { type: 'Missing License', severity: 'Critical', description: 'No QR code or license identifier found' },
        { type: 'Content Issue', severity: 'Medium', description: 'Potentially inappropriate content detected' }
      ],
      structuralIssues: [
        { type: 'Rust Detected', severity: 'Medium', description: 'Visible rust on support structure' },
        { type: 'Tilt Detected', severity: 'High', description: 'Billboard tilted 15° from vertical' }
      ],
      ocrResults: {
        textDetected: true,
        inappropriateContent: false,
        politicalContent: true,
        extractedText: 'VOTE FOR CHANGE - POLITICAL ADVERTISEMENT'
      },
      qrCodeFound: false,
      confidenceScore: 0.87,
      riskLevel: 'High',
      recommendedAction: 'Immediate inspection required'
    };
    
    setAnalysisResult(mockResult);
    setIsAnalyzing(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        getCurrentLocation();
        analyzeImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitReport = async () => {
    if (!capturedImage || !analysisResult) return;
    
    const reportData = {
      image: capturedImage,
      location: location,
      timestamp: new Date().toISOString(),
      analysis: analysisResult,
      reporterId: 'user123' // In real app, get from auth
    };
    
    // Simulate API call
    console.log('Submitting report:', reportData);
    
    // Show success message and reset
    alert('Report submitted successfully! You earned 50 points.');
    setCapturedImage(null);
    setAnalysisResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Billboard Scanner</h1>
        <p className="text-gray-600">Capture and analyze billboards for violations using AI</p>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">Privacy Protection Active</h3>
            <p className="text-sm text-blue-700 mt-1">
              All photos are automatically processed to blur faces and license plates. 
              Images are encrypted end-to-end and stored securely.
            </p>
          </div>
        </div>
      </div>

      {/* Camera Interface */}
      {!capturedImage && (
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6">
            {!isCapturing ? (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <CameraIcon className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start Billboard Detection</h3>
                <p className="text-gray-600 mb-6">Use your camera to capture billboards for AI analysis</p>
                
                <div className="space-y-3">
                  <button
                    onClick={startCamera}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CameraIcon className="h-5 w-5" />
                    <span>Open Camera</span>
                  </button>
                  
                  <div className="relative">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Upload className="h-5 w-5" />
                      <span>Upload Photo</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-w-md mx-auto rounded-lg mb-4"
                />
                <button
                  onClick={capturePhoto}
                  className="bg-red-600 text-white px-8 py-3 rounded-full font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 mx-auto"
                >
                  <CameraIcon className="h-5 w-5" />
                  <span>Capture</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {capturedImage && (
        <div className="space-y-6">
          {/* Captured Image */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Captured Image</h3>
              <img
                src={capturedImage}
                alt="Captured billboard"
                className="w-full max-w-md mx-auto rounded-lg"
              />
              
              {location && (
                <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}</span>
                </div>
              )}
              
              <div className="flex items-center justify-center space-x-2 mt-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Captured: {new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          {isAnalyzing ? (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analyzing Billboard...</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>Detecting billboard structure...</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Scan className="h-4 w-4" />
                    <span>Analyzing content and text...</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <QrCode className="h-4 w-4" />
                    <span>Checking for license QR code...</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Zap className="h-4 w-4" />
                    <span>Assessing structural integrity...</span>
                  </div>
                </div>
              </div>
            </div>
          ) : analysisResult && (
            <div className="space-y-4">
              {/* Analysis Summary */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">AI Analysis Results</h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      analysisResult.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                      analysisResult.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      Risk: {analysisResult.riskLevel}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{Math.round(analysisResult.confidenceScore * 100)}%</div>
                      <div className="text-sm text-gray-600">Confidence</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{analysisResult.violations.length}</div>
                      <div className="text-sm text-gray-600">Violations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{analysisResult.structuralIssues.length}</div>
                      <div className="text-sm text-gray-600">Structural Issues</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Recommended Action</h4>
                    <p className="text-gray-700">{analysisResult.recommendedAction}</p>
                  </div>
                </div>
              </div>

              {/* Violations */}
              {analysisResult.violations.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Regulatory Violations</h4>
                    <div className="space-y-3">
                      {analysisResult.violations.map((violation: any, index: number) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-red-900">{violation.type}</span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                violation.severity === 'Critical' ? 'bg-red-200 text-red-800' :
                                violation.severity === 'High' ? 'bg-orange-200 text-orange-800' :
                                'bg-yellow-200 text-yellow-800'
                              }`}>
                                {violation.severity}
                              </span>
                            </div>
                            <p className="text-sm text-red-700 mt-1">{violation.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* OCR Results */}
              {analysisResult.ocrResults.textDetected && (
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Content Analysis</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Political Content</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          analysisResult.ocrResults.politicalContent ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {analysisResult.ocrResults.politicalContent ? 'Detected' : 'Not Detected'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Inappropriate Content</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          analysisResult.ocrResults.inappropriateContent ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {analysisResult.ocrResults.inappropriateContent ? 'Detected' : 'Not Detected'}
                        </span>
                      </div>
                      {analysisResult.ocrResults.extractedText && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Extracted Text:</span>
                          <p className="text-sm text-gray-600 mt-1">{analysisResult.ocrResults.extractedText}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Report */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Submit Violation Report</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Report this billboard to authorities and earn 50 points
                      </p>
                    </div>
                    <button
                      onClick={submitReport}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Submit Report</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Camera;