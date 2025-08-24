import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Layers, Filter, Satellite, Navigation } from 'lucide-react';
import { mapsService, BillboardMarker, HeatmapData } from '../services/mapsService';

interface MapViewProps {
  center?: { lat: number; lng: number };
  billboards?: BillboardMarker[];
  showHeatmap?: boolean;
  height?: string;
  onMarkerClick?: (billboard: BillboardMarker) => void;
}

const MapView: React.FC<MapViewProps> = ({
  center = { lat: 12.9716, lng: 77.5946 }, // Default to Bangalore
  billboards = [],
  showHeatmap = false,
  height = '400px',
  onMarkerClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [heatmapLayer, setHeatmapLayer] = useState<google.maps.visualization.HeatmapLayer | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');
  const [filterStatus, setFilterStatus] = useState<'all' | 'violation' | 'pending' | 'resolved'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeMap();
  }, []);

  useEffect(() => {
    if (map) {
      updateMarkers();
    }
  }, [map, billboards, filterStatus]);

  useEffect(() => {
    if (map && showHeatmap) {
      updateHeatmap();
    }
  }, [map, showHeatmap, billboards]);

  const initializeMap = async () => {
    try {
      if (!mapRef.current) return;

      const googleMap = await mapsService.initializeMap('map-container', center);
      setMap(googleMap);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize map:', error);
      setIsLoading(false);
    }
  };

  const updateMarkers = () => {
    if (!map) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    // Filter billboards based on status
    const filteredBillboards = filterStatus === 'all' 
      ? billboards 
      : billboards.filter(b => b.status === filterStatus);

    // Add new markers
    const newMarkers = mapsService.addBillboardMarkers(map, filteredBillboards);
    
    // Add click listeners
    newMarkers.forEach((marker, index) => {
      marker.addListener('click', () => {
        if (onMarkerClick) {
          onMarkerClick(filteredBillboards[index]);
        }
      });
    });

    setMarkers(newMarkers);
  };

  const updateHeatmap = () => {
    if (!map) return;

    // Remove existing heatmap
    if (heatmapLayer) {
      heatmapLayer.setMap(null);
    }

    // Create heatmap data from violations
    const heatmapData: HeatmapData[] = billboards
      .filter(b => b.status === 'violation')
      .map(b => ({
        location: b.position,
        weight: b.severity === 'critical' ? 4 : b.severity === 'high' ? 3 : b.severity === 'medium' ? 2 : 1
      }));

    if (heatmapData.length > 0) {
      const newHeatmapLayer = mapsService.createHeatmap(map, heatmapData);
      setHeatmapLayer(newHeatmapLayer);
    }
  };

  const changeMapType = (type: 'roadmap' | 'satellite' | 'hybrid') => {
    if (map) {
      map.setMapTypeId(type);
      setMapType(type);
    }
  };

  const centerOnUserLocation = () => {
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          map.setCenter(userLocation);
          map.setZoom(15);
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg" style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
        {/* Map Type Selector */}
        <div className="bg-white rounded-lg shadow-md p-2">
          <div className="flex space-x-1">
            <button
              onClick={() => changeMapType('roadmap')}
              className={`p-2 rounded ${mapType === 'roadmap' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Road Map"
            >
              <MapPin className="h-4 w-4" />
            </button>
            <button
              onClick={() => changeMapType('satellite')}
              className={`p-2 rounded ${mapType === 'satellite' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Satellite View"
            >
              <Satellite className="h-4 w-4" />
            </button>
            <button
              onClick={() => changeMapType('hybrid')}
              className={`p-2 rounded ${mapType === 'hybrid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Hybrid View"
            >
              <Layers className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* User Location Button */}
        <button
          onClick={centerOnUserLocation}
          className="bg-white rounded-lg shadow-md p-2 text-gray-600 hover:bg-gray-100"
          title="Center on my location"
        >
          <Navigation className="h-4 w-4" />
        </button>
      </div>

      {/* Filter Controls */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white rounded-lg shadow-md p-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="text-sm border-none focus:ring-0 focus:outline-none"
          >
            <option value="all">All Billboards</option>
            <option value="violation">Violations Only</option>
            <option value="pending">Pending Review</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Heatmap Toggle */}
      {showHeatmap && (
        <div className="absolute bottom-4 left-4 z-10">
          <div className="bg-white rounded-lg shadow-md p-2">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={!!heatmapLayer}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateHeatmap();
                  } else if (heatmapLayer) {
                    heatmapLayer.setMap(null);
                    setHeatmapLayer(null);
                  }
                }}
                className="rounded"
              />
              <span>Show Heatmap</span>
            </label>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div
        id="map-container"
        ref={mapRef}
        style={{ height }}
        className="w-full"
      />

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-white rounded-lg shadow-md p-3">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Legend</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Critical Violations</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Violations</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Pending Review</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Resolved</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Authorized</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;