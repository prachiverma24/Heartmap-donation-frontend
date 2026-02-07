import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Navigation.css';

const Navigation = () => {
  return (
    <motion.nav 
      className="navigation"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-container">
        <Link to="/" className="logo">
          <motion.span
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            ❤️ HeartMap
          </motion.span>
        </Link>
        
        <ul className="nav-links">
          <li>
            <Link to="/">
              <motion.span whileHover={{ scale: 1.1 }}>🏠 Home</motion.span>
            </Link>
          </li>
          <li>
            <Link to="/admin">
              <motion.span whileHover={{ scale: 1.1 }}>⚙️ Admin</motion.span>
            </Link>
          </li>
        </ul>
      </div>
    </motion.nav>
  );
};

export default Navigation;
