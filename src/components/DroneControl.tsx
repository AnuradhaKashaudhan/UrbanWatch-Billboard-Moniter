import React, { useState, useEffect } from 'react';
import { Bone as Drone, Play, Pause, Square, Battery, Signal, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { aiService, DroneDetectionResult } from '../services/aiService';

interface DroneControlProps {
  onSurveyComplete?: (results: DroneDetectionResult) => void;
}

const DroneControl: React.FC<DroneControlProps> = ({ onSurveyComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [missionId, setMissionId] = useState<string | null>(null);
  const [surveyArea, setSurveyArea] = useState({
    center: { lat: 12.9716, lng: 77.5946 },
    radius: 5, // km
    altitude: 100 // meters
  });
  const [droneStatus, setDroneStatus] = useState({
    battery: 85,
    signal: 95,
    altitude: 0,
    speed: 0,
    position: { lat: 0, lng: 0 }
  });
  const [surveyProgress, setSurveyProgress] = useState(0);
  const [results, setResults] = useState<DroneDetectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && missionId) {
      interval = setInterval(() => {
        updateDroneStatus();
        updateSurveyProgress();
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, missionId]);

  const updateDroneStatus = () => {
    setDroneStatus(prev => ({
      ...prev,
      battery: Math.max(20, prev.battery - 0.1),
      signal: 90 + Math.random() * 10,
      altitude: surveyArea.altitude + (Math.random() - 0.5) * 10,
      speed: isActive ? 15 + Math.random() * 5 : 0,
      position: {
        lat: surveyArea.center.lat + (Math.random() - 0.5) * 0.01,
        lng: surveyArea.center.lng + (Math.random() - 0.5) * 0.01
      }
    }));
  };

  const updateSurveyProgress = () => {
    setSurveyProgress(prev => {
      const newProgress = Math.min(100, prev + 0.5);
      
      if (newProgress >= 100 && isActive) {
        completeSurvey();
      }
      
      return newProgress;
    });
  };

  const startSurvey = async () => {
    try {
      setIsLoading(true);
      const id = await aiService.initiateDroneSurvey(surveyArea);
      setMissionId(id);
      setIsActive(true);
      setSurveyProgress(0);
      setResults(null);
    } catch (error) {
      console.error('Failed to start drone survey:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pauseSurvey = () => {
    setIsActive(false);
  };

  const resumeSurvey = () => {
    setIsActive(true);
  };

  const stopSurvey = () => {
    setIsActive(false);
    setMissionId(null);
    setSurveyProgress(0);
    setResults(null);
  };

  const completeSurvey = async () => {
    if (!missionId) return;

    try {
      setIsActive(false);
      setIsLoading(true);
      
      const surveyResults = await aiService.getDroneSurveyResults(missionId);
      setResults(surveyResults);
      
      if (onSurveyComplete) {
        onSurveyComplete(surveyResults);
      }
    } catch (error) {
      console.error('Failed to get survey results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSignalColor = (strength: number) => {
    if (strength > 80) return 'text-green-600';
    if (strength > 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Drone className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Drone Survey Control</h3>
            <p className="text-sm text-gray-600">Automated large-scale billboard detection</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Survey Area Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Survey Radius (km)
            </label>
            <input
              type="number"
              value={surveyArea.radius}
              onChange={(e) => setSurveyArea(prev => ({ ...prev, radius: Number(e.target.value) }))}
              min="1"
              max="20"
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isActive}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Altitude (meters)
            </label>
            <input
              type="number"
              value={surveyArea.altitude}
              onChange={(e) => setSurveyArea(prev => ({ ...prev, altitude: Number(e.target.value) }))}
              min="50"
              max="400"
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isActive}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Center Location
            </label>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{surveyArea.center.lat.toFixed(4)}, {surveyArea.center.lng.toFixed(4)}</span>
            </div>
          </div>
        </div>

        {/* Drone Status */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Drone Status</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Battery className={`h-4 w-4 ${getBatteryColor(droneStatus.battery)}`} />
              <span className="text-sm">
                <span className="font-medium">{droneStatus.battery.toFixed(0)}%</span>
                <span className="text-gray-500 ml-1">Battery</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Signal className={`h-4 w-4 ${getSignalColor(droneStatus.signal)}`} />
              <span className="text-sm">
                <span className="font-medium">{droneStatus.signal.toFixed(0)}%</span>
                <span className="text-gray-500 ml-1">Signal</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-sm">
                <span className="font-medium">{droneStatus.altitude.toFixed(0)}m</span>
                <span className="text-gray-500 ml-1">Altitude</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm">
                <span className="font-medium">{droneStatus.speed.toFixed(0)} km/h</span>
                <span className="text-gray-500 ml-1">Speed</span>
              </span>
            </div>
          </div>
        </div>

        {/* Survey Progress */}
        {missionId && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Survey Progress</h4>
              <span className="text-sm text-gray-600">{surveyProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${surveyProgress}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
              <span>Estimated time: {Math.max(0, Math.ceil((100 - surveyProgress) * 0.6))} minutes</span>
              <span>Area covered: {(surveyProgress * surveyArea.radius * surveyArea.radius * Math.PI / 100).toFixed(1)} km²</span>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex space-x-3">
          {!isActive && !missionId && (
            <button
              onClick={startSurvey}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="h-4 w-4" />
              <span>Start Survey</span>
            </button>
          )}
          
          {isActive && (
            <button
              onClick={pauseSurvey}
              className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
            >
              <Pause className="h-4 w-4" />
              <span>Pause</span>
            </button>
          )}
          
          {!isActive && missionId && surveyProgress < 100 && (
            <button
              onClick={resumeSurvey}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Play className="h-4 w-4" />
              <span>Resume</span>
            </button>
          )}
          
          {missionId && (
            <button
              onClick={stopSurvey}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              <Square className="h-4 w-4" />
              <span>Stop</span>
            </button>
          )}
        </div>

        {/* Survey Results */}
        {results && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-3">Survey Results</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{results.totalBillboards}</div>
                <div className="text-sm text-blue-700">Total Billboards</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{results.violations.length}</div>
                <div className="text-sm text-red-700">Violations Found</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{results.coverage.areaScanned}</div>
                <div className="text-sm text-green-700">Area Scanned (km²)</div>
              </div>
            </div>
            
            {results.violations.length > 0 && (
              <div>
                <h5 className="font-medium text-blue-900 mb-2">Critical Violations</h5>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {results.violations.filter(v => v.severity === 'critical').slice(0, 5).map((violation, index) => (
                    <div key={violation.id} className="flex items-center space-x-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <span className="text-red-800">
                        {violation.violationType} at {violation.coordinates.lat.toFixed(4)}, {violation.coordinates.lng.toFixed(4)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Safety Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900">Safety Notice</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Drone operations must comply with local aviation regulations. Ensure proper permissions 
                are obtained before conducting surveys in restricted airspace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DroneControl;