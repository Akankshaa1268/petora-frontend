import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Shield, Activity, Star, User, Calendar, FileText, Camera } from 'lucide-react'
import './HumanCare.css'

const Badge = ({ icon: Icon, text }) => (
  <div className="hc-badge">
    <Icon size={16} />
    <span>{text}</span>
  </div>
)

const Card = ({ icon: Icon, title, desc }) => (
  <motion.div
    className="hc-card"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
  >
    <div className="hc-card-icon"><Icon size={18} /></div>
    <div className="hc-card-content">
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  </motion.div>
)

export default function HumanCare() {
  return (
    <div className="hc-page">
      <header className="navbar">
        <div className="nav-inner">
          <div className="nav-brand">
            <Link to="/" className="brand-link">Petora</Link>
          </div>
          <div className="nav-actions">
            <Link to="/auth" className="btn nav-auth-btn">Login / Sign Up</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hc-hero">
        <div className="hc-hero-inner">
          <div className="hc-hero-left">
            <Badge icon={Activity} text="AI-Powered Healthcare" />
            <h1>
              Your Health,
              <br />
              <span className="accent">Redefined</span>
            </h1>
            <p>
              Experience the future of healthcare with AI-powered diagnostics, predictive analytics, and personalized treatment recommendations tailored just for you.
            </p>
            <div className="hc-hero-actions">
              <Link to="/auth" className="btn btn-primary">Start Health Check</Link>
              <Link to="/auth" className="btn btn-secondary">Consult Doctor</Link>
            </div>
            <div className="hc-hero-stats">
              <div><div className="num">99%</div><div className="label">Accuracy</div></div>
              <div><div className="num">24/7</div><div className="label">Available</div></div>
              <div><div className="num">50K+</div><div className="label">Patients</div></div>
            </div>
          </div>
          <div className="hc-hero-right">
            <div className="hc-hero-card">
              <img src="/public/vite.svg" alt="Human healthcare AI" />
              <div className="hc-hero-fab fab-top"><Brain size={16} /></div>
              <div className="hc-hero-fab fab-bottom"><Star size={16} /></div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Services */}
      <section className="hc-quick">
        <div className="hc-quick-header">
          <h3>Quick AI Health Services</h3>
          <p>Get instant health insights with our AI-powered tools</p>
        </div>
        <div className="hc-quick-grid">
          <Card icon={Brain} title="Symptom Analysis" desc="AI-powered analysis of your symptoms with preliminary health assessments." />
          <Card icon={Activity} title="Health Monitoring" desc="Continuous tracking of health metrics with personalized insights and recommendations." />
          <Card icon={Shield} title="Risk Assessment" desc="Early detection of potential health risks based on your personal health profile." />
        </div>
      </section>

      {/* Suite */}
      <section className="hc-suite">
        <div className="hc-suite-header">
          <Badge icon={Shield} text="Advanced Healthcare Platform" />
          <h3>Comprehensive Health<br />Management Suite</h3>
          <p>From AI diagnostics to personalized treatment plans, our platform provides everything you need for optimal health management and preventive care.</p>
        </div>
        <div className="hc-suite-grid">
          <Card icon={User} title="Doctor Recommendations" desc="Get personalized doctor suggestions based on your symptoms, location, and medical history." />
          <Card icon={Camera} title="Skin Disease Detection" desc="Advanced AI analysis for skin conditions with instant diagnosis and treatment recommendations." />
          <Card icon={Activity} title="Predictive Analytics" desc="Early warning systems for health risks based on symptoms, lifestyle, and medical history." />
          <Card icon={Camera} title="AR Health Visualization" desc="Augmented reality tools for better understanding of health conditions and treatment progress." />
          <Card icon={Calendar} title="Appointment Scheduling" desc="Book appointments with healthcare providers directly through our integrated platform." />
          <Card icon={FileText} title="Health Records" desc="Secure digital health records with easy sharing capabilities for healthcare providers." />
        </div>
      </section>

      {/* CTA */}
      <section className="hc-cta">
        <div className="hc-cta-inner">
          <h3>Take Control of<br /><span className="accent">Your Health Today</span></h3>
          <p>Join millions who trust Petora for comprehensive, AI-powered healthcare solutions.</p>
          <div className="hc-cta-actions">
            <Link to="/auth" className="btn btn-primary">Start Health Assessment</Link>
            <Link to="/auth" className="btn btn-secondary">Book Consultation</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

