import React, { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  Heart, 
  Stethoscope, 
  PawPrint, 
  User, 
  Camera, 
  MapPin, 
  MessageCircle, 
  Clock, 
  Shield, 
  Brain,
  Eye,
  TrendingUp,
  Smartphone,
  Zap,
  Sparkles,
  Star,
  ArrowRight,
  Play,
  CheckCircle
} from 'lucide-react'
import './LandingPage.css'
import VirusField from './VirusField'
import ModelHero from './ModelHero'

const LandingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [petoraHover, setPetoraHover] = useState(false)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, 200])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const animalFeatures = [
    {
      icon: <Camera className="feature-icon" />,
      title: "AI-Powered Symptom Detection",
      description: "Upload images of wounds, skin issues, and injuries. Our AI detects visible symptoms and identifies possible illnesses.",
      color: "#FF6B6B"
    },
    {
      icon: <Shield className="feature-icon" />,
      title: "Severity Assessment",
      description: "Instant severity classification (minor, urgent, emergency) with appropriate first-aid recommendations.",
      color: "#4ECDC4"
    },
    {
      icon: <MapPin className="feature-icon" />,
      title: "Veterinary Connect",
      description: "Find nearby veterinary clinics and professionals for consultation and treatment.",
      color: "#45B7D1"
    },
    {
      icon: <MessageCircle className="feature-icon" />,
      title: "Expert Consultation",
      description: "Connect with vets through chat or call for professional advice and medication suggestions.",
      color: "#96CEB4"
    }
  ]

  const humanFeatures = [
    {
      icon: <User className="feature-icon" />,
      title: "Doctor Recommendations",
      description: "Get personalized doctor suggestions based on your location and medical needs.",
      color: "#667eea"
    },
    {
      icon: <Eye className="feature-icon" />,
      title: "Skin Disease Detection",
      description: "Advanced AI analysis for skin conditions with instant diagnosis and treatment options.",
      color: "#764ba2"
    },
    {
      icon: <TrendingUp className="feature-icon" />,
      title: "Predictive Disease Detection",
      description: "Population surveillance and early warning systems for disease outbreaks.",
      color: "#f093fb"
    },
    {
      icon: <Smartphone className="feature-icon" />,
      title: "AR Wound Healing Timeline",
      description: "Virtual wound healing visualization with augmented reality for better understanding.",
      color: "#4facfe"
    }
  ]

  return (
    <div className="landing-page">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="floating-shapes">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="floating-shape"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hero-text"
          >
            <div className="hero-badge">
              <Sparkles className="sparkle-icon" />
              <span>AI-Powered Healthcare</span>
            </div>
            
            <h1 className="hero-title">
              Welcome to 
              <span 
                className="highlight petora-wrapper"
                onMouseEnter={() => setPetoraHover(true)}
                onMouseLeave={() => setPetoraHover(false)}
              >
                Petora
                <VirusField active={petoraHover} mouse={{ ...mousePosition, inside: petoraHover }} />
              </span>
            </h1>
            
            <p className="hero-subtitle">
              Revolutionary healthcare platform for both animals and humans. 
              Experience the future of medical care with cutting-edge AI technology.
            </p>
            
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Accuracy</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Users</div>
              </div>
            </div>
            
            <div className="hero-buttons">
              <motion.button 
                className="btn btn-primary"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get Started</span>
                <ArrowRight className="btn-icon" />
              </motion.button>
              <motion.button 
                className="btn btn-secondary"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="btn-icon" />
                <span>Watch Demo</span>
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: 15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="hero-visual hero-visual-3d"
          >
            <ModelHero />
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="scroll-indicator"
          style={{ opacity }}
        >
          <div className="scroll-line"></div>
          <span>Scroll to explore</span>
        </motion.div>
      </section>

      {/* Features Overview */}
      <section className="features-overview">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <div className="section-badge">
            <Star className="star-icon" />
            <span>Why Choose Petora?</span>
          </div>
          <h2>Cutting-edge technology meets compassionate healthcare</h2>
          <p>Experience the future of medical care with our revolutionary platform</p>
        </motion.div>
        
        <div className="features-grid">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="feature-card"
            whileHover={{ y: -15, scale: 1.02 }}
          >
            <div className="feature-icon-wrapper">
              <Brain className="feature-icon-large" />
            </div>
            <h3>AI-Powered Diagnosis</h3>
            <p>Advanced machine learning algorithms for accurate symptom detection and instant analysis</p>
            <div className="feature-highlight"></div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="feature-card"
            whileHover={{ y: -15, scale: 1.02 }}
          >
            <div className="feature-icon-wrapper">
              <Clock className="feature-icon-large" />
            </div>
            <h3>24/7 Availability</h3>
            <p>Round-the-clock healthcare support whenever you need it, no matter the time</p>
            <div className="feature-highlight"></div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="feature-card"
            whileHover={{ y: -15, scale: 1.02 }}
          >
            <div className="feature-icon-wrapper">
              <MapPin className="feature-icon-large" />
            </div>
            <h3>Local Expertise</h3>
            <p>Connect with nearby healthcare professionals in your area for personalized care</p>
            <div className="feature-highlight"></div>
          </motion.div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="main-services">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <div className="section-badge">
            <Sparkles className="sparkle-icon" />
            <span>Our Services</span>
          </div>
          <h2>Comprehensive healthcare solutions for every family member</h2>
          <p>From pets to humans, we've got everyone covered with cutting-edge technology</p>
        </motion.div>

        <div className="services-container">
          {/* Animal Healthcare Card */}
          <motion.div
            initial={{ opacity: 0, x: -100, rotateY: -15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            viewport={{ once: true }}
            className="service-card animal-card"
            whileHover={{ rotateY: 5, scale: 1.02 }}
          >
            <div className="card-glow"></div>
            <div className="card-header">
              <div className="card-icon">
                <PawPrint className="icon-large" />
              </div>
              <h3>Animal Healthcare</h3>
              <p>Comprehensive care for your beloved pets with AI-powered diagnosis</p>
            </div>
            
            <div className="card-features">
              {animalFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="feature-item"
                  style={{ '--accent-color': feature.color }}
                >
                  <div className="feature-icon-container">
                    {feature.icon}
                  </div>
                  <div>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.button 
              className="btn btn-animal"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Start Animal Care</span>
              <ArrowRight className="btn-icon" />
            </motion.button>
          </motion.div>

          {/* Human Healthcare Card */}
          <motion.div
            initial={{ opacity: 0, x: 100, rotateY: 15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="service-card human-card"
            whileHover={{ rotateY: -5, scale: 1.02 }}
          >
            <div className="card-glow"></div>
            <div className="card-header">
              <div className="card-icon">
                <User className="icon-large" />
              </div>
              <h3>Human Healthcare</h3>
              <p>Advanced medical solutions for you and your family with predictive AI</p>
            </div>
            
            <div className="card-features">
              {humanFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="feature-item"
                  style={{ '--accent-color': feature.color }}
                >
                  <div className="feature-icon-container">
                    {feature.icon}
                  </div>
                  <div>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.button 
              className="btn btn-human"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Start Human Care</span>
              <ArrowRight className="btn-icon" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-background">
          <div className="cta-particles">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="cta-particle"
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="cta-content"
        >
          <div className="cta-badge">
            <CheckCircle className="check-icon" />
            <span>Join the Future</span>
          </div>
          <h2>Ready to Experience the Future of Healthcare?</h2>
          <p>Join thousands of families who trust Petora for their healthcare needs. Start your journey today!</p>
          <motion.button 
            className="btn btn-primary btn-large"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Get Started Today</span>
            <ArrowRight className="btn-icon" />
          </motion.button>
        </motion.div>
      </section>
    </div>
  )
}

export default LandingPage 