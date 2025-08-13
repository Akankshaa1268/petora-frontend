import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { User, Mail, Lock, ArrowRight, PawPrint, Heart, Shield, Stethoscope, KeyRound } from 'lucide-react'
import './LandingPage.css'

function AuthPage() {
  const [isSignup, setIsSignup] = useState(false)

  const leftItems = useMemo(() => ([
    { icon: <Lock />, hue: 150, size: 52, x: 10, y: 18, drift: 30, delay: 0.1 },
    { icon: <Shield />, hue: 120, size: 44, x: 22, y: 60, drift: 40, delay: 0.4 },
    { icon: <Stethoscope />, hue: 145, size: 56, x: 6, y: 78, drift: 25, delay: 0.8 },
  ]), [])

  const rightItems = useMemo(() => ([
    { icon: <Heart />, hue: 95, size: 50, x: 75, y: 22, drift: 35, delay: 0.2 },
    { icon: <KeyRound />, hue: 110, size: 42, x: 88, y: 58, drift: 28, delay: 0.6 },
    { icon: <Mail />, hue: 140, size: 46, x: 70, y: 80, drift: 33, delay: 1.0 },
  ]), [])

  return (
    <div className="auth-page-wrapper">
      <header className="navbar">
        <div className="nav-inner">
          <div className="nav-brand">
            <Link to="/" className="brand-link">Petora</Link>
          </div>
          <div className="nav-actions">
            <Link to="/auth" className="btn nav-auth-btn">
              <span>Login / Sign Up</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Animated background elements */}
      <div className="auth-background">
        {[...leftItems, ...rightItems].map((item, idx) => (
          <motion.div
            key={idx}
            className={`bg-item ${idx < leftItems.length ? 'left' : 'right'}`}
            style={{
              '--h': item.hue,
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: item.size,
              height: item.size,
            }}
            initial={{ x: 0, y: 0, rotateZ: 0 }}
            animate={{
              x: [0, -item.drift * 0.4, 0, item.drift * 0.4, 0],
              y: [0, -item.drift, 0, item.drift, 0],
              rotateZ: [0, 3, 0, -3, 0],
            }}
            transition={{ duration: 9 + (idx % 4), repeat: Infinity, delay: item.delay, ease: 'easeInOut' }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      <div className="auth-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="auth-card"
        >
          <div className="auth-header">
            <div className="auth-logo">
              <PawPrint className="auth-logo-icon" />
            </div>
            <h1>{isSignup ? 'Create your account' : 'Welcome back'}</h1>
            <p>{isSignup ? 'Join Petora to get AI-powered care for everyone you love.' : 'Login to continue your care journey with Petora.'}</p>
          </div>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            {isSignup && (
              <div className="form-group">
                <User className="form-icon" />
                <input type="text" placeholder="Full name" required />
              </div>
            )}
            <div className="form-group">
              <Mail className="form-icon" />
              <input type="email" placeholder="Email address" required />
            </div>
            <div className="form-group">
              <Lock className="form-icon" />
              <input type="password" placeholder="Password" required />
            </div>

            {isSignup && (
              <div className="form-hint">By creating an account, you agree to our Terms and Privacy policy.</div>
            )}

            <motion.button
              type="submit"
              className="btn btn-primary auth-submit"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{isSignup ? 'Create Account' : 'Login'}</span>
              <ArrowRight className="btn-icon" />
            </motion.button>
          </form>

          <div className="auth-switch">
            {isSignup ? (
              <span>Already have an account? <button className="link-btn" onClick={() => setIsSignup(false)}>Login</button></span>
            ) : (
              <span>New to Petora? <button className="link-btn" onClick={() => setIsSignup(true)}>Create an account</button></span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AuthPage

