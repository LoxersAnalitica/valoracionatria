import { useState } from 'react';
import PhoneInput from 'react-phone-number-input';

export default function ValuationWizard() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('idle');
  const [formData, setFormData] = useState({
    operation: 'Venta', propertyType: 'Piso/Apartamento', surface: '', address: '',
    rooms: '1', bathrooms: '1', floor: 'Bajo', condition: 'Buen estado', buildYear: '',
    energyCert: 'En trámite', features: [], views: [], sunExposure: 'No lo sé',
    name: '', phone: '', email: ''
  });

  const handleInput = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleTag = (field, val) => {
    const list = formData[field];
    if (list.includes(val)) setFormData({ ...formData, [field]: list.filter(v => v !== val) });
    else setFormData({ ...formData, [field]: [...list, val] });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const resp = await fetch('/api/kommo', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
      });
      if (resp.ok) {
        setStatus('success');
        if (window.fbq) window.fbq('track', 'Lead');
      } else setStatus('error');
    } catch(err) {
      console.error('Submission error:', err);
      setStatus('error');
    }
  };

  if (status === 'success') return (
    <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
      <h3 style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '1rem' }}>¡Solicitud enviada!</h3>
      <p style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>Nuestro equipo analizará los datos y se pondrá en contacto contigo en breve con la valoración.</p>
    </div>
  );

  return (
    <div className="glass-box" style={{ padding: '0' }}>
      {/* Removed step indicators to reduce friction */}
      <div style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit} className="amoforms-code-container">
          {step === 1 && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <label className="amoforms-label">Operación</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                {['Venta', 'Alquiler'].map(op => (
                  <button type="button" key={op} onClick={() => setFormData({...formData, operation: op})} style={{ flex: 1, padding: '12px', border: formData.operation === op ? '1px solid var(--accent-gold)' : '1px solid var(--border-color)', backgroundColor: formData.operation === op ? 'rgba(197, 168, 128, 0.1)' : 'transparent', color: 'var(--text-main)', borderRadius: '4px' }}>{op}</button>
                ))}
              </div>
              <label className="amoforms-label">Tipo de Inmueble</label>
              <select name="propertyType" value={formData.propertyType} onChange={handleInput} style={{ width: '100%', padding: '14px 10px', marginBottom: '15px', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '2px' }}>
                <option value="Piso/Apartamento">Piso / Apartamento</option>
                <option value="Casa/Chalet">Casa / Chalet</option>
                <option value="Ático">Ático</option>
                <option value="Dúplex">Dúplex</option>
                <option value="Terreno/Parcela">Terreno / Parcela</option>
              </select>
              <label className="amoforms-label">Superficie (m²)</label>
              <input type="number" name="surface" value={formData.surface} onChange={handleInput} required placeholder="Ej: 120" style={{ width: '100%', padding: '14px 10px', marginBottom: '15px', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }} />
              <label className="amoforms-label">Dirección exacta <span style={{ color: '#e74c3c' }}>*</span></label>
              <input type="text" name="address" value={formData.address} onChange={handleInput} required placeholder="Calle, Número, Barrio, Madrid..." style={{ width: '100%', padding: '14px 10px', marginBottom: '6px', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }} />
              <p style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', marginBottom: '20px', lineHeight: '1.4', opacity: 0.85 }}>
                📍 Solo se valorarán viviendas en zonas prime del centro de Madrid: Barrio Salamanca, Chamberí, Recoletos, Retiro, Lista, Guindalera, Ibiza y alrededores.
              </p>
              <button type="button" onClick={() => { if(formData.surface && formData.address) nextStep(); else alert('Completa la superficie y dirección.'); }} className="amoforms-action-btn">Continuar</button>
            </div>
          )}
          {step === 2 && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label className="amoforms-label">Habitaciones</label>
                  <select name="rooms" value={formData.rooms} onChange={handleInput} style={{ width: '100%', padding: '14px 10px', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                    {[1,2,3,4,5,'6+'].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="amoforms-label">Baños</label>
                  <select name="bathrooms" value={formData.bathrooms} onChange={handleInput} style={{ width: '100%', padding: '14px 10px', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                    {[1,2,3,'4+'].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <label className="amoforms-label">Planta</label>
              <select name="floor" value={formData.floor} onChange={handleInput} style={{ width: '100%', padding: '14px 10px', marginBottom: '15px', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                <option value="Bajo">Bajo</option><option value="Intermedia">Intermedia</option><option value="Última planta">Última planta</option>
              </select>
              <label className="amoforms-label">Estado</label>
              <select name="condition" value={formData.condition} onChange={handleInput} style={{ width: '100%', padding: '14px 10px', marginBottom: '15px', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                <option value="A reformar">A reformar</option><option value="Buen estado">Buen estado</option><option value="Reformado">Reformado / Nuevo</option>
              </select>
              <label className="amoforms-label">Año de Construcción (Aprox)</label>
              <input type="number" name="buildYear" value={formData.buildYear} onChange={handleInput} placeholder="Ej: 2005" style={{ width: '100%', padding: '14px 10px', marginBottom: '25px', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={prevStep} className="amoforms-action-btn back-btn" style={{ flex: 0.3 }}>Atrás</button>
                <button type="button" onClick={nextStep} className="amoforms-action-btn" style={{ flex: 0.7 }}>Continuar</button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <label className="amoforms-label">Extras Principales</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {['Ascensor', 'Garaje', 'Trastero', 'Piscina', 'Terraza', 'Jardín'].map(tag => (
                  <button type="button" key={tag} onClick={() => handleTag('features', tag)} style={{ padding: '8px 14px', borderRadius: '50px', fontSize: '0.8rem', border: formData.features.includes(tag) ? '1px solid var(--accent-gold)' : '1px solid var(--border-color)', backgroundColor: formData.features.includes(tag) ? 'rgba(197, 168, 128, 0.2)' : 'var(--bg-darker)', color: 'var(--text-main)' }}>{tag}</button>
                ))}
              </div>
              <label className="amoforms-label">Vistas</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {['Marítima', 'Montaña', 'Ciudad', 'Despejadas'].map(tag => (
                  <button type="button" key={tag} onClick={() => handleTag('views', tag)} style={{ padding: '8px 14px', borderRadius: '50px', fontSize: '0.8rem', border: formData.views.includes(tag) ? '1px solid var(--accent-gold)' : '1px solid var(--border-color)', backgroundColor: formData.views.includes(tag) ? 'rgba(197, 168, 128, 0.2)' : 'var(--bg-darker)', color: 'var(--text-main)' }}>{tag}</button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
                <button type="button" onClick={prevStep} className="amoforms-action-btn back-btn" style={{ flex: 0.3 }}>Atrás</button>
                <button type="button" onClick={nextStep} className="amoforms-action-btn" style={{ flex: 0.7 }}>Continuar</button>
              </div>
            </div>
          )}
          {step === 4 && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <label className="amoforms-label">Nombre Completo</label>
              <input type="text" name="name" value={formData.name} onChange={handleInput} required placeholder="Introduce tu nombre" style={{ width: '100%', padding: '14px 10px', marginBottom: '15px', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }} />
              <label className="amoforms-label">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleInput} required placeholder="tu@email.com" style={{ width: '100%', padding: '14px 10px', marginBottom: '15px', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }} />
              <label className="amoforms-label">Teléfono Móvil</label>
              <div style={{ marginBottom: '25px' }}>
                <PhoneInput international defaultCountry="ES" value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} required style={{ '--PhoneInput-color--focus': 'var(--accent-gold)' }} />
              </div>
              {status === 'error' && <p style={{ color: '#e74c3c', fontSize: '0.85rem', marginBottom: '15px' }}>Error al enviar la solicitud.</p>}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={prevStep} className="amoforms-action-btn back-btn" disabled={status==='submitting'} style={{ flex: 0.3 }}>Atrás</button>
                <button type="submit" className="amoforms-action-btn" disabled={status==='submitting'} style={{ flex: 0.7 }}>{status==='submitting' ? 'Enviando...' : 'Obtener Valoración'}</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
