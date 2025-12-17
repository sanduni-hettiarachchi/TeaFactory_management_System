import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different markers
const driverIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const destinationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance.toFixed(2);
};

// Calculate ETA based on distance and average speed
const calculateETA = (distanceKm, speedKmh = 40) => {
  const hours = distanceKm / speedKmh;
  const minutes = Math.round(hours * 60);
  const now = new Date();
  const eta = new Date(now.getTime() + minutes * 60000);
  return eta.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export default function LiveGPSTracking({ drivers, deliveries, onUpdateLocation }) {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [liveTracking, setLiveTracking] = useState({});
  const [autoUpdate, setAutoUpdate] = useState(true);
  const mapRef = useRef(null);

  // Default center (Colombo, Sri Lanka)
  const defaultCenter = [6.9271, 79.8612];

  // Initialize tracking for active deliveries
  useEffect(() => {
    const activeDeliveries = deliveries.filter(d => d.status === 'Out for Delivery' || d.status === 'Pending');
    const tracking = {};

    // Default locations in Colombo area
    const defaultLocations = [
      { lat: 6.9271, lng: 79.8612 }, // Colombo
      { lat: 6.8520, lng: 79.8630 }, // Dehiwala
      { lat: 6.8389, lng: 79.8630 }, // Mount Lavinia
      { lat: 6.8649, lng: 79.8997 }, // Nugegoda
      { lat: 6.8484, lng: 79.9267 }, // Maharagama
      { lat: 6.8905, lng: 79.9015 }, // Kotte
      { lat: 6.8986, lng: 79.9186 }, // Battaramulla
      { lat: 6.9089, lng: 79.8915 }, // Rajagiriya
    ];

    activeDeliveries.forEach((delivery, index) => {
      const driver = drivers.find(d => d._id === delivery.driverId || d.id === delivery.driverId);
      if (driver) {
        // Use existing locations or generate random ones
        const customerLoc = delivery.customerLocation || defaultLocations[index % defaultLocations.length];
        const driverLoc = delivery.driverLocation || {
          lat: customerLoc.lat + (Math.random() - 0.5) * 0.02,
          lng: customerLoc.lng + (Math.random() - 0.5) * 0.02
        };

        tracking[driver._id || driver.id] = {
          driverId: driver._id || driver.id,
          driverName: driver.name,
          currentLocation: driverLoc,
          destination: customerLoc,
          customerName: delivery.customerName,
          deliveryId: delivery._id || delivery.id,
          speed: 45, // Fixed speed for consistent ETA
          lastUpdate: new Date().toISOString()
        };
      }
    });

    setLiveTracking(tracking);
  }, [deliveries, drivers]);

  // Auto-update driver locations (simulate GPS updates)
  useEffect(() => {
    if (!autoUpdate) return;

    const interval = setInterval(() => {
      setLiveTracking(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(driverId => {
          const tracking = updated[driverId];
          const { currentLocation, destination } = tracking;

          // Calculate direction to destination
          const latDiff = destination.lat - currentLocation.lat;
          const lngDiff = destination.lng - currentLocation.lng;
          const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

          // Move driver closer to destination (simulate movement)
          if (distance > 0.001) {
            const step = 0.0005; // Movement step
            const newLat = currentLocation.lat + (latDiff / distance) * step;
            const newLng = currentLocation.lng + (lngDiff / distance) * step;

            updated[driverId] = {
              ...tracking,
              currentLocation: { lat: newLat, lng: newLng },
              lastUpdate: new Date().toISOString()
            };

            // Notify parent component
            if (onUpdateLocation) {
              onUpdateLocation(driverId, { lat: newLat, lng: newLng });
            }
          }
        });
        return updated;
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [autoUpdate, onUpdateLocation]);

  const trackingArray = Object.values(liveTracking);

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Live GPS Tracking</h2>
            <p className="text-gray-600">Real-time driver locations and delivery tracking</p>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoUpdate}
                onChange={(e) => setAutoUpdate(e.target.checked)}
                className="w-5 h-5"
              />
              <span className="text-sm font-medium">Auto-update</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">{trackingArray.length} Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-[600px]">
            <MapContainer
              center={defaultCenter}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Driver markers and routes */}
              {trackingArray.map(tracking => {
                const distance = calculateDistance(
                  tracking.currentLocation.lat,
                  tracking.currentLocation.lng,
                  tracking.destination.lat,
                  tracking.destination.lng
                );
                const eta = calculateETA(distance, tracking.speed);

                return (
                  <div key={tracking.driverId}>
                    {/* Driver marker */}
                    <Marker
                      position={[tracking.currentLocation.lat, tracking.currentLocation.lng]}
                      icon={driverIcon}
                      eventHandlers={{
                        click: () => setSelectedDriver(tracking.driverId)
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-bold text-lg">{tracking.driverName}</h3>
                          <p className="text-sm">Speed: {tracking.speed} km/h</p>
                          <p className="text-sm">Distance: {distance} km</p>
                          <p className="text-sm">ETA: {eta}</p>
                          <p className="text-xs text-gray-500">
                            Last update: {new Date(tracking.lastUpdate).toLocaleTimeString()}
                          </p>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Destination marker */}
                    <Marker
                      position={[tracking.destination.lat, tracking.destination.lng]}
                      icon={destinationIcon}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-bold">{tracking.customerName}</h3>
                          <p className="text-sm">Delivery destination</p>
                          <p className="text-sm">Distance: {distance} km away</p>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Route line */}
                    <Polyline
                      positions={[
                        [tracking.currentLocation.lat, tracking.currentLocation.lng],
                        [tracking.destination.lat, tracking.destination.lng]
                      ]}
                      color={selectedDriver === tracking.driverId ? '#22c55e' : '#3b82f6'}
                      weight={3}
                      opacity={0.7}
                      dashArray="10, 10"
                    />

                    {/* Proximity circle around destination */}
                    <Circle
                      center={[tracking.destination.lat, tracking.destination.lng]}
                      radius={500}
                      pathOptions={{
                        color: '#ef4444',
                        fillColor: '#fecaca',
                        fillOpacity: 0.2
                      }}
                    />
                  </div>
                );
              })}
            </MapContainer>
          </div>
        </div>

        {/* Driver List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Active Drivers ({trackingArray.length})</h3>
          <div className="space-y-4 max-h-[550px] overflow-y-auto">
            {trackingArray.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📍</div>
                <p>No active deliveries</p>
              </div>
            ) : (
              trackingArray.map(tracking => {
                const distance = calculateDistance(
                  tracking.currentLocation.lat,
                  tracking.currentLocation.lng,
                  tracking.destination.lat,
                  tracking.destination.lng
                );
                const eta = calculateETA(distance, tracking.speed);
                const progress = Math.max(0, Math.min(100, (1 - distance / 10) * 100));

                return (
                  <div
                    key={tracking.driverId}
                    onClick={() => setSelectedDriver(tracking.driverId)}
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${
                      selectedDriver === tracking.driverId
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-lg">{tracking.driverName}</h4>
                        <p className="text-sm text-gray-600">→ {tracking.customerName}</p>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Distance:</span>
                        <span className="font-semibold">{distance} km</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Speed:</span>
                        <span className="font-semibold">{tracking.speed} km/h</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">ETA:</span>
                        <span className="font-semibold text-green-600">{eta}</span>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{progress.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mt-2">
                        Updated: {new Date(tracking.lastUpdate).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{trackingArray.length}</div>
          <div className="text-sm text-gray-600">Active Drivers</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-3xl font-bold text-green-600">
            {trackingArray.reduce((sum, t) => sum + parseFloat(calculateDistance(
              t.currentLocation.lat, t.currentLocation.lng,
              t.destination.lat, t.destination.lng
            )), 0).toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Total Distance (km)</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-3xl font-bold text-purple-600">
            {trackingArray.length > 0
              ? Math.round(trackingArray.reduce((sum, t) => sum + t.speed, 0) / trackingArray.length)
              : 0}
          </div>
          <div className="text-sm text-gray-600">Avg Speed (km/h)</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-3xl font-bold text-orange-600">
            {trackingArray.filter(t => {
              const dist = calculateDistance(
                t.currentLocation.lat, t.currentLocation.lng,
                t.destination.lat, t.destination.lng
              );
              return dist < 1;
            }).length}
          </div>
          <div className="text-sm text-gray-600">Near Destination</div>
        </div>
      </div>
    </div>
  );
}