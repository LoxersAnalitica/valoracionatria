import { useState, useEffect } from 'react'
import CookieConsent, { getCookieConsentValue } from 'react-cookie-consent'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import './index.css'
import ValuationWizard from './Wizard.jsx'
/* ─── Icons (Inline SVGs) ─────────────────────────────────── */

const KeyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
)

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const LeafIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
)

/* ─── Global Scroll to Contact Function ──────────────────────── */
const scrollToContact = () => {
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.scrollIntoView({ behavior: 'smooth' });
    // Focus the first input field slightly after scrolling
    setTimeout(() => {
      const firstInput = document.querySelector('input[name="name"]');
      if (firstInput) firstInput.focus();
    }, 500);
  }
}

/* ─── Header ─────────────────────────────────────────────── */

function Header({ onOpenDossier }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-content">
        <div className="logo" style={{ color: 'var(--accent-gold)' }}>
          Atria Real Estate
        </div>
        <div className="contact-nav">
          <a href="#mobile-contact-form" style={{
            color: 'var(--text-light)',
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            borderBottom: '1px solid var(--accent-gold)',
            paddingBottom: '4px'
          }}>
            Valorar Inmueble
          </a>
        </div>
      </div>
    </header>
  )
}

/* ─── Hero Section ───────────────────────────────────────── */

const KommoStyles = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
    .amoforms-code-container input[type="text"],
    .amoforms-code-container input[type="tel"],
    .amoforms-code-container input[type="email"] {
      background-color: #ffffff !important;
      border: 1px solid rgba(0,0,0,0.1) !important;
      color: #333 !important;
      border-radius: 2px !important;
      padding: 14px 10px !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 14px !important;
      width: 100% !important;
      margin-bottom: 15px !important;
    }
    .amoforms-code-container input:focus {
      border: 1px solid #C5A880 !important;
      outline: none !important;
    }
    .PhoneInput {
      background-color: #ffffff !important;
      border: 1px solid rgba(0,0,0,0.1) !important;
      border-radius: 2px !important;
      padding: 0 10px !important;
      margin-bottom: 15px !important;
      display: flex;
      align-items: center;
      transition: border 0.3s ease;
    }
    .PhoneInput:focus-within {
      border: 1px solid #C5A880 !important;
    }
    .PhoneInputInput {
      border: none !important;
      background: transparent !important;
      padding: 14px 0 !important;
      margin-bottom: 0 !important;
      color: #333 !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 14px !important;
      width: 100% !important;
      outline: none !important;
    }
    .amoforms-label {
      color: #333 !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 11px !important;
      text-transform: uppercase !important;
      margin-bottom: 6px !important;
      display: block !important;
    }
    .amoforms-action-btn {
      background-color: #C5A880 !important;
      border: none !important;
      color: #fff !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 14px !important;
      text-transform: uppercase !important;
      letter-spacing: 2px !important;
      border-radius: 2px !important;
      padding: 18px 30px !important;
      width: 100% !important;
      cursor: pointer !important;
      transition: background-color 0.3s ease !important;
    }
    .amoforms-action-btn:hover {
      background-color: #b39770 !important;
    }
  `}} />
)
/* ─── Hero Section ───────────────────────────────────────── */

function Hero() {
  return (
    <>
      <section className="hero" id="hero">
        <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600" alt="Atria Real Estate Luxury Interior" className="hero-bg" />
        <div className="hero-overlay" style={{ background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.5) 70%, var(--bg-dark) 100%)' }}></div>

        <div className="container hero-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          <div className="hero-text-area">
            <h1 className="hero-h1" style={{ marginBottom: '1.5rem', lineHeight: '1.2' }}>
              Descubre el valor real de tu propiedad en Madrid en el mercado actual
            </h1>
            <p className="hero-subtitle desktop-only">
              Obtén un Análisis Comparativo de Mercado detallado y profesional en minutos. Expertos en zonas prime de Madrid (Chamberí, Recoletos, Barrio de Salamanca, Lista).
            </p>
          </div>

          <div style={{ marginTop: '1rem' }}>
             <ValuationWizard />
          </div>
        </div>
      </section>

      {/* Removing redundant mobile-only wizard tunnel */}
    </>
  )
}

/* ─── Benefits Section ───────────────────────────────────── */

function Benefits() {
  return (
    <section className="benefits">
      <div className="container" style={{ textAlign: 'center' }}>
        <p className="value-add-subtitle">Por qué valorar con nosotros</p>
        <h2 className="value-add-title" style={{ marginBottom: '3rem', textAlign: 'center' }}>Nuestra Metodología</h2>

        <div className="benefits-grid" style={{ marginBottom: '0' }}>
          <div className="benefit-card">
            <div className="benefit-icon"><KeyIcon /></div>
            <h3 className="benefit-title">Big Data Inmobiliario</h3>
            <p className="benefit-desc">Valoración paramétrica basada en datos reales de transacciones recientes en el mercado de lujo.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon"><ShieldIcon /></div>
            <h3 className="benefit-title">Discreción Absoluta</h3>
            <p className="benefit-desc">Asesoramiento totalmente confidencial protegiendo la identidad de la propiedad en operaciones off-market.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon"><LeafIcon /></div>
            <h3 className="benefit-title">Estrategia Personalizada</h3>
            <p className="benefit-desc">Plan de venta a medida para maximizar el retorno de tu inmueble con las mejores herramientas del sector.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* Removed sections for Layout optimization */
/* ─── Footer ─────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="footer" style={{ paddingBottom: '3rem' }}>
      <div className="container">
        <p className="footer-text" style={{ marginBottom: '1rem' }}>
          Atria Real Estate - Expertos en Valoración de Inmuebles.
        </p>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <a
            href="/politica-de-privacidad"
            style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.8rem',
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
              transition: 'color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.color = 'var(--text-light)'}
            onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  )
}

/* ─── Privacy Policy Page ────────────────────────────────── */

function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', fontSize: '2.5rem', marginBottom: '2rem' }}>
          Privacy Policy
        </h1>

        <div style={{ fontFamily: 'var(--font-sans)', lineHeight: '1.8', fontSize: '0.95rem' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            En <strong>Atria Real Estate</strong>, la discreción y la protección de los datos de nuestros clientes son fundamentales. Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos la información personal que obtenemos a través de nuestra plataforma para procesos de valoración y captación.
          </p>

          <h3 style={{ fontSize: '1.2rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: 500 }}>
            1. Information we collect
          </h3>
          <p style={{ marginBottom: '1.5rem' }}>
            By requesting access to our portfolio, we collect the strictly necessary data to verify your suitability and to be able to contact you: Full Name, Phone, and Email address.
          </p>

          <h3 style={{ fontSize: '1.2rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: 500 }}>
            2. Use of information
          </h3>
          <div style={{ marginBottom: '1.5rem' }}>
            The data provided is used exclusively for the following purposes:
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '0.5rem' }}>
              <li>Initial evaluation of your profile.</li>
              <li>Direct communication for the presentation of available assets.</li>
              <li>Management of the commercial relationship in strict confidentiality.</li>
            </ul>
          </div>

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Last updated: March 17, 2026.
            </p>
            <a href="/" style={{ display: 'inline-block', marginTop: '1.5rem', color: 'var(--accent-gold)', textDecoration: 'none', borderBottom: '1px solid var(--accent-gold)', paddingBottom: '2px' }}>
              &larr; Return to Home
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Dossier Modal Component ───────────────────────────── */

function DossierModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('idle')

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !phone) {
      alert("Please provide both email and phone number to receive the dossier.")
      return
    }

    setStatus('submitting')

    try {
      const response = await fetch('/api/kommo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Dossier Request (Atanaus)',
          phone: phone,
          email: email
        })
      })

      if (response.ok) {
        setStatus('success')
        if (window.fbq) {
          window.fbq('track', 'Lead');
        }
        setTimeout(() => {
          onClose()
          setStatus('idle')
        }, 3000)
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
      zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: '#fff', padding: '40px 30px', borderRadius: '4px',
        maxWidth: '450px', width: '90%', position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '15px', right: '15px',
          fontSize: '1.5rem', color: '#999', cursor: 'pointer'
        }}>
          &times;
        </button>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '10px', textAlign: 'center' }}>
          Access the Full Dossier
        </h3>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '25px', textAlign: 'center' }}>
          Please enter your details to receive the complete Atanaus Suites dossier.
        </p>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ color: 'var(--accent-gold)', fontSize: '1.2rem', fontFamily: 'var(--font-serif)' }}>
              Request sent successfully.<br />Check your inbox shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <PhoneInput
                international
                defaultCountry="ES"
                value={phone}
                onChange={setPhone}
                required
                disabled={status === 'submitting'}
                style={{
                  width: '100%', padding: '5px',
                  border: '1px solid #ccc', borderRadius: '2px',
                  fontFamily: 'var(--font-sans)', fontSize: '1rem',
                  backgroundColor: '#fff'
                }}
              />
              <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '6px', fontStyle: 'italic', lineHeight: '1.2', textAlign: 'left' }}>
                * We will send an immediate WhatsApp message to verify this number before sending the dossier.
              </p>
            </div>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Your email address"
              style={{
                width: '100%', padding: '15px', marginBottom: '20px',
                border: '1px solid #ccc', borderRadius: '2px',
                fontFamily: 'var(--font-sans)', fontSize: '1rem'
              }}
              disabled={status === 'submitting'}
            />
            {status === 'error' && (
              <p style={{ color: 'red', fontSize: '0.85rem', marginBottom: '15px', textAlign: 'center' }}>
                Error sending request. Please try again.
              </p>
            )}
            <button
              type="submit"
              disabled={status === 'submitting'}
              style={{
                width: '100%', padding: '16px', backgroundColor: 'var(--accent-gold)',
                color: '#fff', border: 'none', borderRadius: '2px',
                textTransform: 'uppercase', letterSpacing: '2px',
                cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500',
                transition: 'background-color 0.3s'
              }}
            >
              {status === 'submitting' ? 'Sending...' : 'Get Dossier'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

/* ─── Location & Trust ───────────────────────────────────── */
function LocationTrust() {
  return (
    <section className="location-trust" style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-darker)', borderTop: '1px solid var(--border-color)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <p className="value-add-subtitle">Nuestra Ubicación</p>
          <h2 className="value-add-title" style={{ marginBottom: '2rem' }}>El Corazón del Barrio de Salamanca</h2>
          <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '3rem' }}>
            Nuestra sede se encuentra ubicada en <strong>Calle Don Ramón de la Cruz, 38</strong>, en pleno núcleo de la zona prime de Madrid. 
            Esta posición estratégica nos permite tener un pulso constante del mercado de lujo, ofreciendo a nuestros clientes 
            un conocimiento táctil y directo sobre las operaciones off-market más recientes del Barrio de Salamanca, Recoletos y Chamberí.
          </p>
          <div style={{ border: '1px solid var(--border-color)', padding: '2rem', backgroundColor: 'var(--bg-dark)', display: 'inline-block' }}>
            <h4 style={{ color: 'var(--accent-gold)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>Atria Real Estate Headquarters</h4>
            <p style={{ color: 'var(--text-main)', fontSize: '1.2rem', fontFamily: 'var(--font-serif)' }}>C. de Don Ramón de la Cruz, 38</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '5px' }}>28001 Madrid, España</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── About Us ───────────────────────────────────────────── */
function AboutUs() {
  return (
    <section className="about-us" style={{ padding: '6rem 1.5rem', backgroundColor: 'var(--bg-dark)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, border: '1px solid var(--accent-gold)', transform: 'translate(-15px, 15px)', zIndex: 0 }}></div>
          <img src="/assets/fernando-lebrija.png" alt="Fernando Lebrija" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'relative', zIndex: 1, filter: 'grayscale(100%) contrast(120%) brightness(95%)', backgroundColor: '#111' }} />
        </div>
        <div>
          <p className="value-add-subtitle">Quiénes Somos</p>
          <h2 className="value-add-title" style={{ marginBottom: '1.5rem' }}>Liderazgo y Experiencia Prime</h2>
          <h3 style={{ color: 'var(--text-main)', fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>Fernando Lebrija</h3>
          <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Como experto reconocido en la valoración y venta de viviendas <strong>off-market</strong> en el Barrio de Salamanca y zonas nobles de Madrid, Fernando dirige personalmente las estrategias de comercialización de los activos más exclusivos de nuestra cartera.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', color: 'var(--text-main)', fontFamily: 'var(--font-sans)', fontSize: '0.95rem' }}>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <span style={{ color: 'var(--accent-gold)', marginRight: '10px' }}>▪</span> Más de 12 años de experiencia en el sector Prime.
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <span style={{ color: 'var(--accent-gold)', marginRight: '10px' }}>▪</span> Amplia red de contactos institucionales y family offices.
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <span style={{ color: 'var(--accent-gold)', marginRight: '10px' }}>▪</span> Discreción absoluta en carteras Off-Market.
            </li>
          </ul>
          <button
                onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
                className="amoforms-action-btn"
                style={{
                  display: 'inline-block', padding: '12px 28px', width: 'auto'
                }}>
                Solicitar Valoración
           </button>
        </div>
      </div>
    </section>
  )
}

/* ─── App ─────────────────────────────────────────────────── */
export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [isDossierOpen, setIsDossierOpen] = useState(false)

  const grantGoogleConsent = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag('consent', 'update', {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted',
        'analytics_storage': 'granted'
      });
    }
  }

  useEffect(() => {
    if (getCookieConsentValue("atria-cookie-consent") === "true") {
      grantGoogleConsent();
    }

    const handleLocationChange = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', handleLocationChange)
    return () => window.removeEventListener('popstate', handleLocationChange)
  }, [])

  if (currentPath === '/politica-de-privacidad') {
    return (
      <>
        <Header onOpenDossier={() => setIsDossierOpen(true)} />
        <main>
          <PrivacyPolicy />
        </main>
        <Footer />
        <DossierModal isOpen={isDossierOpen} onClose={() => setIsDossierOpen(false)} />
      </>
    )
  }

  return (
    <>
      <CookieConsent
        location="bottom"
        buttonText="Entendido"
        cookieName="atria-cookie-consent"
        onAccept={grantGoogleConsent}
        style={{ background: "#0a0a0a", color: "#F9F8F6", fontFamily: "var(--font-sans)", fontSize: "14px", borderTop: "1px solid var(--border-color)" }}
        buttonStyle={{ backgroundColor: "#C5A880", color: "#fff", fontSize: "12px", borderRadius: "2px", fontWeight: "bold", textTransform: "uppercase", padding: "10px 20px" }}
        expires={150}
      >
        Utilizamos cookies para mejorar su experiencia de navegación, ofrecer anuncios o contenidos personalizados y analizar nuestro tráfico. Al hacer clic en "Entendido", acepta nuestro uso de cookies.
      </CookieConsent>
      <Header />
      <main>
        <Hero />
        <Benefits />
        <LocationTrust />
        <AboutUs />
      </main>
      <Footer />
    </>
  )
}
