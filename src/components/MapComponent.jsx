import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './MapComponent.css';

const MapComponent = ({ stories = [], onMarkerClick }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);

  console.log('🗺️ MapComponent rendering with stories:', stories.length);

  // Simple map visualization without Google Maps API dependency
  // You can replace this with actual Google Maps API integration
  
  const getMarkerColor = (story) => {
    const percentage = (story.totalDonations / story.goalAmount) * 100;
    if (percentage >= 75) return '#4caf50'; // Green - almost funded
    if (percentage >= 50) return '#ff9800'; // Orange - halfway
    if (percentage >= 25) return '#2196f3'; // Blue - quarter way
    return '#f44336'; // Red - needs help
  };

  const handleMarkerClick = (story) => {
    setSelectedMarker(story._id);
    if (onMarkerClick) {
      onMarkerClick(story._id);
    }
  };

  // Convert lat/lng to pixel coordinates
  const latLngToPixel = (lat, lng) => {
    // Simple mercator projection for visual representation
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  return (
    <div className="map-container">
      <div className="map-placeholder">
        {/* World map background image */}
        <div className="world-map-bg"></div>
        
        <div className="map-overlay">
          <h3>🌍 Global Stories Map</h3>
          <p>Click markers to view stories • Colors indicate funding progress</p>
        </div>
        
        {stories.length === 0 && (
          <div className="no-stories-message">
            <h3>🔄 Loading stories...</h3>
            <p>Please wait while we fetch stories from around the world</p>
          </div>
        )}
        
        <div className="markers-container">
          {stories.map((story, index) => {
            const position = story.location ? 
              latLngToPixel(story.location.lat, story.location.lng) : 
              { x: 20 + (index * 25), y: 30 + (index % 3) * 20 };
            
            return (
              <motion.div
                key={story._id}
                className="map-marker"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  backgroundColor: getMarkerColor(story)
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: selectedMarker === story._id ? 1.5 : 1, 
                  opacity: 1 
                }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.3 }}
                onClick={() => handleMarkerClick(story)}
              >
                <span className="marker-icon">📍</span>
                <motion.div 
                  className="marker-pulse"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 0, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div 
                  className="marker-tooltip"
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                >
                  <strong>{story.title}</strong>
                  <p>📍 {story.location.address}</p>
                  <p className="progress">💰 {Math.round((story.totalDonations / story.goalAmount) * 100)}% funded</p>
                  <p className="tooltip-amount">${story.totalDonations} of ${story.goalAmount}</p>
                  <button className="tooltip-btn">View Story →</button>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <div className="map-legend">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#f44336' }}></span>
            <span>Needs Help (0-25%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#2196f3' }}></span>
            <span>Quarter Way (25-50%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#ff9800' }}></span>
            <span>Halfway (50-75%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#4caf50' }}></span>
            <span>Almost Funded (75%+)</span>
          </div>
        </div>

        <div className="map-note">
          <p>💡 <strong>Note:</strong> To use real Google Maps, add your API key to the .env file</p>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
