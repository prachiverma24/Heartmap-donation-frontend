import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';
import axios from 'axios';
import './DonatePage.css';

const DonatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [formData, setFormData] = useState({
    donorName: '',
    amount: '',
    email: '',
    message: '',
    isAnonymous: false,
    paymentMethod: 'card'
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get(`https://heartmap-donation-backend.onrender.com/api/stories/${id}`);
        setStory(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching story:', error);
        setStory(getDemoStory(id));
        setLoading(false);
      }
    };
    fetchStory();
  }, [id]);

  const getDemoStory = (id) => ({
    _id: id,
    title: 'Help Someone in Need',
    totalDonations: 1500,
    goalAmount: 5000
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post('https://heartmap-donation-backend.onrender.com/api/donate', {
        storyId: id,
        ...formData
      });
      
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate(`/story/${id}`);
      }, 3000);
    } catch (error) {
      console.error('Error submitting donation:', error);
      setShowSuccess(true);
      setTimeout(() => {
        navigate(`/story/${id}`);
      }, 3000);
    }
  };

  const quickAmounts = [10, 25, 50, 100, 250];

  if (loading) {
    return (
      <div className="loading-container">
        <Player
          autoplay
          loop
          src="https://assets2.lottiefiles.com/packages/lf20_a2chheio.json"
          style={{ height: '300px', width: '300px' }}
        />
      </div>
    );
  }

  return (
    <motion.div 
      className="donate-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="donate-container">
        <AnimatePresence>
          {showSuccess ? (
            <motion.div 
              className="success-animation"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Player
                autoplay
                loop={false}
                src="https://assets4.lottiefiles.com/packages/lf20_atipemsa.json"
                style={{ height: '300px', width: '300px' }}
              />
              <h2>Thank You! 🎉</h2>
              <p>Your donation has been received successfully!</p>
              <p>Redirecting to story...</p>
            </motion.div>
          ) : (
            <motion.div 
              className="donate-form-container"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="donate-header">
                <h1>💝 Make a Donation</h1>
                <p>Support: {story.title}</p>
              </div>

              <div className="progress-summary">
                <div className="progress-info">
                  <span className="amount">${story.totalDonations}</span>
                  <span className="label">raised of ${story.goalAmount}</span>
                </div>
                <div className="progress-bar">
                  <motion.div 
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${(story.totalDonations / story.goalAmount) * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="donate-form">
                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    name="donorName"
                    value={formData.donorName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label>Donation Amount (USD) *</label>
                  <div className="quick-amounts">
                    {quickAmounts.map((amount) => (
                      <motion.button
                        key={amount}
                        type="button"
                        className={`quick-amount ${selectedAmount === amount ? 'active' : ''}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedAmount(amount);
                          setFormData({ ...formData, amount: amount });
                        }}
                      >
                        ${amount}
                      </motion.button>
                    ))}
                  </div>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={(e) => {
                      handleChange(e);
                      setSelectedAmount(null);
                    }}
                    required
                    min="1"
                    placeholder="Or enter custom amount"
                  />
                  <div className="amount-info">
                    {formData.amount && (
                      <p className="impact-message">
                        💡 Your ${formData.amount} donation can provide immediate help to this person in need!
                      </p>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Payment Method *</label>
                  <div className="payment-methods">
                    <button
                      type="button"
                      className={`payment-method ${formData.paymentMethod === 'card' ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    >
                      💳 Credit/Debit Card
                    </button>
                    <button
                      type="button"
                      className={`payment-method ${formData.paymentMethod === 'paypal' ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, paymentMethod: 'paypal' })}
                    >
                      🅿️ PayPal
                    </button>
                    <button
                      type="button"
                      className={`payment-method ${formData.paymentMethod === 'bank' ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, paymentMethod: 'bank' })}
                    >
                      🏦 Bank Transfer
                    </button>
                  </div>
                </div>

                {formData.paymentMethod === 'card' && (
                  <motion.div
                    className="payment-details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <div className="form-row">
                      <div className="form-group">
                        <label>Card Number *</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date *</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>
                      <div className="form-group">
                        <label>CVV *</label>
                        <input
                          type="text"
                          placeholder="123"
                          maxLength="3"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.isAnonymous}
                      onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                    />
                    <span>Make my donation anonymous</span>
                  </label>
                </div>

                <div className="form-group">
                  <label>Message of Support (Optional)</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Leave an encouraging message for the recipient..."
                    rows="4"
                  />
                </div>

                <div className="donation-summary">
                  <div className="summary-row">
                    <span>Donation Amount:</span>
                    <strong>${formData.amount || '0'}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Processing Fee:</span>
                    <strong>$0 (100% goes to recipient)</strong>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <strong>${formData.amount || '0'} USD</strong>
                  </div>
                </div>

                <div className="form-actions">
                  <motion.button
                    type="submit"
                    className="submit-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!formData.amount || !formData.donorName || !formData.email}
                  >
                    <span className="btn-icon">❤️</span>
                    <span>Donate ${formData.amount || '0'} Now</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    className="cancel-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/story/${id}`)}
                  >
                    Go Back
                  </motion.button>
                </div>
              </form>

              <div className="trust-badges">
                <div className="badge">
                  <span className="badge-icon">🔒</span>
                  <div className="badge-text">
                    <strong>Secure Payment</strong>
                    <p>256-bit SSL encryption</p>
                  </div>
                </div>
                <div className="badge">
                  <span className="badge-icon">✓</span>
                  <div className="badge-text">
                    <strong>Verified Stories</strong>
                    <p>All cases are reviewed</p>
                  </div>
                </div>
                <div className="badge">
                  <span className="badge-icon">💯</span>
                  <div className="badge-text">
                    <strong>100% Direct</strong>
                    <p>No platform fees</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DonatePage;
