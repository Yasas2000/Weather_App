import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';

const RealGlobe = ({ coordinates, locationName, darkMode, onLocationSelect }) => {
  const globeEl = useRef();
  const [globeReady, setGlobeReady] = useState(false);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (coordinates && globeReady) {
      const [lat, lng] = coordinates;
      setMarkers([{
        lat: lat,
        lng: lng,
        size: 0.8,
        color: '#ff4444',
        label: locationName || 'Selected Location'
      }]);

      // Auto-rotate to show the location
      if (globeEl.current) {
        globeEl.current.pointOfView({ lat: lat, lng: lng, altitude: 2 }, 2000);
      }
    }
  }, [coordinates, globeReady, locationName]);

  const handleGlobeReady = () => {
    setGlobeReady(true);

    // Set initial view
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: 0, lng: 0, altitude: 2.5 });

      // Enable auto-rotation
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  };

  const handleGlobeClick = (event) => {
    if (!globeEl.current || !onLocationSelect) return;

    // Pause auto-rotation when user clicks
    globeEl.current.controls().autoRotate = false;

    if (event) {
      const { lat, lng } = event;
      console.log('Globe clicked at:', lat, lng);

      // Call the parent component's callback with coordinates
      onLocationSelect(lat, lng);

      // Resume auto-rotation after 3 seconds
      setTimeout(() => {
        if (globeEl.current) {
          globeEl.current.controls().autoRotate = true;
        }
      }, 3000);
    }
  };

  const handleMarkerClick = (marker) => {
    if (globeEl.current) {
      globeEl.current.pointOfView({
        lat: marker.lat,
        lng: marker.lng,
        altitude: 1.5
      }, 1500);
    }
  };

  return (
    <div className="real-globe-container">
      <h3>🌍 {locationName || 'Click on globe to select location'}</h3>

      <div className="globe-wrapper">
        <Globe
          ref={globeEl}
          width={320}
          height={320}
          backgroundColor={darkMode ? '#1a1a2e' : '#000011'}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl={darkMode ?
            "//unpkg.com/three-globe/example/img/night-sky.png" :
            "//unpkg.com/three-globe/example/img/night-sky.png"
          }

          // Points layer for markers
          pointsData={markers}
          pointAltitude={0.02}
          pointRadius={0.8}
          pointColor="color"
          pointLabel="label"
          onPointClick={handleMarkerClick}

          // Globe click handler for location selection
          onGlobeClick={handleGlobeClick}

          // Atmosphere
          showAtmosphere={true}
          atmosphereColor={darkMode ? '#4a90e2' : '#87ceeb'}
          atmosphereAltitude={0.2}

          // Events
          onGlobeReady={handleGlobeReady}

          // Animation controls
          animateIn={true}
          waitForGlobeReady={true}
        />
      </div>

      <div className="globe-controls">
        <p className="globe-caption">
          🌍 Interactive 3D Earth Globe
        </p>
        {coordinates && (
          <div className="coordinates-display">
            <small>
              📍 Lat: {coordinates[0].toFixed(4)}°, Lng: {coordinates[1].toFixed(4)}°
            </small>
          </div>
        )}
        <div className="globe-instructions">
          <small>
            • Click anywhere on globe to select location<br />
            • Drag to rotate • Scroll to zoom • Click marker to focus
          </small>
        </div>
      </div>
    </div>
  );
};

export default RealGlobe;