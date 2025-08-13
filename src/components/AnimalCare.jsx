import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Camera, AlertTriangle, MapPin, MessageCircle, Calendar, FileText, Star } from 'lucide-react'
import './AnimalCare.css'

const Badge = ({ icon: Icon, text }) => (
  <div className="ac-badge">
    <Icon size={16} />
    <span>{text}</span>
  </div>
)

const Card = ({ icon: Icon, title, desc }) => (
  <motion.div
    className="ac-card"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
  >
    <div className="ac-card-icon"><Icon size={18} /></div>
    <div className="ac-card-content">
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  </motion.div>
)

export default function AnimalCare() {
  return (
    <div className="ac-page">
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
      <section className="ac-hero">
        <div className="ac-hero-inner">
          <div className="ac-hero-left">
            <Badge icon={Camera} text="AI-Powered Pet Care" />
            <h1>
              Your Pet's Health,
              <br />
              <span className="accent">Our Priority</span>
            </h1>
            <p>
              Advanced AI diagnosis, instant health assessments, and direct access to veterinary experts. Get the care your beloved pets deserve, anytime, anywhere.
            </p>
            <div className="ac-hero-actions">
              <Link to="/auth" className="btn btn-primary">Start Diagnosis</Link>
              <Link to="/auth" className="btn btn-secondary">Call Expert</Link>
            </div>
            <div className="ac-hero-stats">
              <div><div className="num">98%</div><div className="label">Accuracy</div></div>
              <div><div className="num">24/7</div><div className="label">Available</div></div>
              <div><div className="num">5K+</div><div className="label">Pets Helped</div></div>
            </div>
          </div>
          <div className="ac-hero-right">
            <div className="ac-hero-card">
              <img src="/public/vite.svg" alt="Animal healthcare AI" />
              <div className="ac-hero-fab fab-top"><Camera size={16} /></div>
              <div className="ac-hero-fab fab-bottom"><Star size={16} /></div>
            </div>
          </div>
        </div>
      </section>

      {/* Suite */}
      <section className="ac-suite">
        <div className="ac-suite-header">
          <Badge icon={Star} text="Complete Care Suite" />
          <h3>Everything You Need for<br />Your Pet's Health</h3>
          <p>From AI-powered diagnosis to expert consultations, our comprehensive platform provides all the tools you need to keep your pets healthy and happy.</p>
        </div>
        <div className="ac-suite-grid">
          <Card icon={Camera} title="AI Photo Diagnosis" desc="Upload photos of injuries, skin conditions, or unusual symptoms. Our advanced AI analyzes the images instantly." />
          <Card icon={AlertTriangle} title="Severity Assessment" desc="Get immediate severity classification (minor, urgent, emergency) with personalized first-aid recommendations." />
          <Card icon={MapPin} title="Veterinary Network" desc="Connect with nearby veterinary clinics, specialists, and emergency services in your area." />
          <Card icon={MessageCircle} title="Expert Consultation" desc="Chat or video call with licensed veterinarians for professional advice and treatment plans." />
          <Card icon={Calendar} title="Appointment Booking" desc="Schedule appointments with local veterinarians directly through our integrated booking system." />
          <Card icon={FileText} title="Health Records" desc="Keep track of your pet's medical history, vaccinations, and treatment records in one place." />
        </div>
      </section>

      {/* CTA */}
      <section className="ac-cta">
        <div className="ac-cta-inner">
          <h3>Ready to Give Your Pet<br /><span className="accent">The Best Care?</span></h3>
          <p>Join thousands of pet owners who trust Petora for their pet's health and wellbeing.</p>
          <div className="ac-cta-actions">
            <Link to="/auth" className="btn btn-primary">Upload Photo Now</Link>
            <Link to="/auth" className="btn btn-secondary">Chat with Vet</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

