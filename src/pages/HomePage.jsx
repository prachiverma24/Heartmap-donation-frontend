import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import MapComponent from '../components/MapComponent';
import ChatBox from '../components/ChatBox';
import './HomePage.css';

const HomePage = () => {
  const [stories, setStories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get('https://heartmap-backend.onrender.com/api/stories');
        console.log('✅ Fetched stories from backend:', response.data);
        if (response.data && response.data.length > 0) {
          setStories(response.data);
        } else {
          console.warn('⚠️ No stories returned, using demo data');
          setStories(getDemoStories());
        }
      } catch (error) {
        console.error('❌ Error fetching stories:', error);
        console.log('🔄 Using demo data instead');
        // Use demo data if backend is not available
        setStories(getDemoStories());
      }
    };
    fetchStories();
  }, []);

  const getDemoStories = () => [
    {
      _id: '1',
      title: 'Help Sarah Rebuild Her Home',
      description: 'After the floods destroyed her house, Sarah needs help to rebuild.',
      location: { lat: 40.7128, lng: -74.0060, address: 'New York, USA' },
      verified: true,
      totalDonations: 1500,
      goalAmount: 5000,
      media: 'https://via.placeholder.com/400x300?text=Sarah+Story'
    },
    {
      _id: '2',
      title: 'Medical Support for Ahmed',
      description: 'Ahmed needs urgent medical treatment but cannot afford it.',
      location: { lat: 51.5074, lng: -0.1278, address: 'London, UK' },
      verified: true,
      totalDonations: 800,
      goalAmount: 3000,
      media: 'https://via.placeholder.com/400x300?text=Ahmed+Story'
    },
    {
      _id: '3',
      title: 'Education Fund for Maria',
      description: 'Maria dreams of becoming a doctor but needs support for tuition.',
      location: { lat: 19.4326, lng: -99.1332, address: 'Mexico City, Mexico' },
      verified: true,
      totalDonations: 2000,
      goalAmount: 4000,
      media: 'https://via.placeholder.com/400x300?text=Maria+Story'
    }
  ];

  const handleMarkerClick = (storyId) => {
    navigate(`/story/${storyId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="home-page">
      <motion.div 
        className="hero-section"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>🌍 Connect Hearts, Change Lives</h1>
        <p>Explore stories of people in need and make a difference today</p>
      </motion.div>

      <div className="map-section">
        <h2>📍 Interactive Story Map</h2>
        <MapComponent stories={stories} onMarkerClick={handleMarkerClick} />
      </div>

      <motion.div 
        className="stories-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2>Featured Stories</h2>
        <div className="grid">
          {stories.map((story) => (
            <motion.div 
              key={story._id}
              className="story-card"
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/story/${story._id}`)}
            >
              {story.media && (
                <div className="story-image">
                  <img 
                    src={story.media} 
                    alt={story.title}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.height = '0';
                    }}
                  />
                </div>
              )}
              <div className="story-content">
                {story.verified && (
                  <span className="verified-badge">✓ Verified</span>
                )}
                {story.urgency && (
                  <span className={`urgency-badge urgency-${story.urgency}`}>
                    {story.urgency === 'critical' && '🚨 CRITICAL'}
                    {story.urgency === 'high' && '⚠️ HIGH'}
                    {story.urgency === 'medium' && '📊 MEDIUM'}
                    {story.urgency === 'low' && '✓ LOW'}
                  </span>
                )}
                <h3>{story.title}</h3>
                <p>{story.description}</p>
                {story.organization && (
                  <p className="organization">🏢 {story.organization}</p>
                )}
                {story.beneficiaries && (
                  <p className="beneficiaries">👥 Helping {story.beneficiaries} people</p>
                )}
                <div className="progress-section">
                  <div className="progress-bar">
                    <motion.div 
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${(story.totalDonations / story.goalAmount) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <div className="progress-text">
                    <span>${story.totalDonations} raised</span>
                    <span>Goal: ${story.goalAmount}</span>
                  </div>
                </div>
                <motion.button 
                  className="donate-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/donate/${story._id}`);
                  }}
                >
                  💝 Donate Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <ChatBox />
    </div>
  );
};

export default HomePage;
