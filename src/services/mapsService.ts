export interface BillboardMarker {
  id: string;
  position: { lat: number; lng: number };
  status: 'authorized' | 'violation' | 'pending' | 'resolved';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  reportedAt: string;
  imageUrl?: string;
}

export interface HeatmapData {
  location: { lat: number; lng: number };
  weight: number;
}

class MapsService {
  private apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // In production, use environment variable

  async loadGoogleMaps(): Promise<void> {
    if (window.google && window.google.maps) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=visualization`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Maps'));
      document.head.appendChild(script);
    });
  }

  async initializeMap(containerId: string, center: { lat: number; lng: number }): Promise<google.maps.Map> {
    await this.loadGoogleMaps();

    const map = new google.maps.Map(document.getElementById(containerId)!, {
      zoom: 12,
      center,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    return map;
  }

  addBillboardMarkers(map: google.maps.Map, billboards: BillboardMarker[]): google.maps.Marker[] {
    const markers: google.maps.Marker[] = [];

    billboards.forEach(billboard => {
      const marker = new google.maps.Marker({
        position: billboard.position,
        map,
        title: billboard.title,
        icon: this.getMarkerIcon(billboard.status, billboard.severity)
      });

      const infoWindow = new google.maps.InfoWindow({
        content: this.createInfoWindowContent(billboard)
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      markers.push(marker);
    });

    return markers;
  }

  createHeatmap(map: google.maps.Map, data: HeatmapData[]): google.maps.visualization.HeatmapLayer {
    const heatmapData = data.map(point => ({
      location: new google.maps.LatLng(point.location.lat, point.location.lng),
      weight: point.weight
    }));

    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      map
    });

    heatmap.set('radius', 50);
    heatmap.set('opacity', 0.6);

    return heatmap;
  }

  private getMarkerIcon(status: string, severity?: string): string {
    const baseUrl = 'https://maps.google.com/mapfiles/ms/icons/';
    
    switch (status) {
      case 'violation':
        return severity === 'critical' ? `${baseUrl}red-dot.png` : `${baseUrl}orange-dot.png`;
      case 'pending':
        return `${baseUrl}yellow-dot.png`;
      case 'resolved':
        return `${baseUrl}green-dot.png`;
      case 'authorized':
        return `${baseUrl}blue-dot.png`;
      default:
        return `${baseUrl}red-dot.png`;
    }
  }

  private createInfoWindowContent(billboard: BillboardMarker): string {
    return `
      <div style="max-width: 300px;">
        <h3 style="margin: 0 0 10px 0; color: #1f2937;">${billboard.title}</h3>
        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">${billboard.description}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
          <span style="background: ${this.getStatusColor(billboard.status)}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
            ${billboard.status.toUpperCase()}
          </span>
          <span style="color: #9ca3af; font-size: 12px;">${billboard.reportedAt}</span>
        </div>
        ${billboard.imageUrl ? `<img src="${billboard.imageUrl}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-top: 10px;" />` : ''}
      </div>
    `;
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case 'violation': return '#ef4444';
      case 'pending': return '#f59e0b';
      case 'resolved': return '#10b981';
      case 'authorized': return '#3b82f6';
      default: return '#6b7280';
    }
  }

  async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
      await this.loadGoogleMaps();
      
      const geocoder = new google.maps.Geocoder();
      const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results) {
            resolve(results);
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        });
      });

      if (result.length > 0) {
        const location = result[0].geometry.location;
        return {
          lat: location.lat(),
          lng: location.lng()
        };
      }

      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(point2.lat - point1.lat);
    const dLng = this.toRadians(point2.lng - point1.lng);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(point1.lat)) * Math.cos(this.toRadians(point2.lat)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export const mapsService = new MapsService();