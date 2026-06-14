import React, { useState } from 'react';

const LANG_FLAGS = { 'עברית':'🇮🇱','אנגלית':'🇬🇧','רוסית':'🇷🇺','אוקראינית':'🇺🇦','ספרדית':'🇪🇸','צרפתית':'🇫🇷','אמהרית':'🇪🇹','ערבית':'🇸🇦' };

export default function PropertyPage({ property, onNavigate, user, t, lang }) {
  const [activeImg, setActiveImg] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const label = (he, en) => (lang === 'he' ? he : en);

  if (!property) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <p>{t('noPropertySelected')}</p>
        <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => onNavigate('search')}>
          {t('backToSearch')}
        </button>
      </div>
    );
  }

  const handleContact = () => {
    if (!user) {
      onNavigate('register');
      return;
    }
    setShowContact(true);
  };

  const handleSendMessage = () => {
    setShowContact(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  const availableLabel = lang === 'he'
    ? new Date(property.availableFrom).toLocaleDateString('he-IL')
    : new Date(property.availableFrom).toLocaleDateString('en-US');

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh', paddingBottom: '60px' }}>
      <div style={{ background: '#fff', padding: '16px 32px', borderBottom: '1px solid #E8EDF4' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '14px', color: '#8A9BB0' }}>
          <span style={{ cursor: 'pointer', color: '#1D5F8A' }} onClick={() => onNavigate('search')}>{label('חיפוש', 'Search')}</span>
          <span>›</span>
          <span style={{ cursor: 'pointer', color: '#1D5F8A' }}>{property.city}</span>
          <span>›</span>
          <span style={{ color: '#0F1B2D' }}>{property.title}</span>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '32px', position: 'relative' }}>
          <img src={property.images[activeImg]} alt={property.title} style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }} />
          {property.images.length > 1 && (
            <div style={{ position: 'absolute', bottom: '16px', right: '16px', display: 'flex', gap: '8px' }}>
              {property.images.map((_, i) => (
                <button key={i} onClick={() => setActiveImg(i)} style={{
                  width: '60px', height: '44px', borderRadius: '8px', overflow: 'hidden', border: `2px solid ${activeImg === i ? '#C9A84C' : 'transparent'}`,
                  cursor: 'pointer', padding: 0, background: 'none',
                }}>
                  <img src={property.images[i]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
          <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
            {property.verified && (
              <span style={{ background: 'rgba(39,174,96,0.9)', color: '#fff', padding: '6px 14px', borderRadius: '50px', fontSize: '13px', fontWeight: '600' }}>
                {label('✓ נכס מאומת', '✓ Verified property')}
              </span>
            )}
            {property.furnished && (
              <span style={{ background: 'rgba(15,27,45,0.8)', color: '#C9A84C', padding: '6px 14px', borderRadius: '50px', fontSize: '13px', fontWeight: '600' }}>
                {label('מרוהטת', 'Furnished')}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h1 style={{ fontSize: '28px', color: '#0F1B2D', marginBottom: '4px' }}>{property.title}</h1>
                <p style={{ color: '#8A9BB0', fontSize: '16px' }}>📍 {property.neighborhood}, {property.city}</p>
              </div>
              <button onClick={() => setSaved((s) => !s)} style={{
                background: saved ? '#FFF0F0' : '#fff', border: `2px solid ${saved ? '#E74C3C' : '#E8EDF4'}`,
                borderRadius: '50px', padding: '10px 18px', cursor: 'pointer', color: saved ? '#E74C3C' : '#8A9BB0',
                fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                {saved ? '♥' : '♡'} {saved ? label('שמור', 'Saved') : label('שמור דירה', 'Save property')}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {property.languages.map((l) => (
                <span key={l} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: 'rgba(29,95,138,0.08)', color: '#1D5F8A',
                  padding: '8px 16px', borderRadius: '50px', fontSize: '14px', fontWeight: '600',
                }}>
                  {LANG_FLAGS[l] || l} {label(`בעל הדירה דובר ${l}`, `Landlord speaks ${l}`)}
                </span>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
              {[
                { icon: '🛏', label: label('חדרים', 'Rooms'), value: property.rooms },
                { icon: '📐', label: label('שטח', 'Size'), value: lang === 'he' ? `${property.size} מ"ר` : `${property.size} sq.m` },
                { icon: '🏢', label: label('קומה', 'Floor'), value: property.floor },
                { icon: '📅', label: label('כניסה מ-', 'Available from'), value: availableLabel },
              ].map((d) => (
                <div key={d.label} style={{ background: '#fff', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #E8EDF4' }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>{d.icon}</div>
                  <div style={{ fontWeight: '700', fontSize: '16px', color: '#0F1B2D' }}>{d.value}</div>
                  <div style={{ fontSize: '12px', color: '#8A9BB0' }}>{d.label}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#0F1B2D' }}>{label('על הנכס', 'About the property')}</h3>
              <p style={{ color: '#4A5568', lineHeight: 1.8, fontSize: '15px' }}>{property.description}</p>
            </div>

            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#0F1B2D' }}>{label('מה יש בנכס', 'Amenities')}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {property.amenities.map((a) => (
                  <span key={a} style={{ background: '#F0F4F8', color: '#4A5568', padding: '8px 16px', borderRadius: '50px', fontSize: '14px' }}>✓ {a}</span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="card" style={{ padding: '28px', position: 'sticky', top: '90px' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', color: '#0F1B2D', fontWeight: '700' }}>₪{property.price.toLocaleString()}</div>
                <div style={{ color: '#8A9BB0', fontSize: '14px' }}>{label('לחודש', 'per month')}</div>
              </div>

              <div style={{ borderTop: '1px solid #E8EDF4', borderBottom: '1px solid #E8EDF4', padding: '16px 0', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={property.landlordPhoto} alt={property.landlordName} style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: '600', color: '#0F1B2D', marginBottom: '2px' }}>{property.landlordName}</div>
                    <div style={{ fontSize: '13px', color: '#8A9BB0' }}>{label('בעל הנכס', 'Landlord')}</div>
                    {property.verified && <div style={{ fontSize: '12px', color: '#27AE60', fontWeight: '600' }}>{label('✓ מאומת', '✓ Verified')}</div>}
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(39,174,96,0.08)', border: '1px solid rgba(39,174,96,0.2)', borderRadius: '10px', padding: '12px', marginBottom: '20px', fontSize: '13px', color: '#2D7A50', lineHeight: 1.5 }}>
                {label('💚 נכס זה עומד בתקציב הטיפוסי של סל הקליטה', '💚 This property fits the typical absorption budget')}
              </div>

              <button className="btn-primary" style={{ width: '100%', marginBottom: '12px', fontSize: '15px' }} onClick={handleContact}>
                {label('📞 צור קשר עם בעל הדירה', '📞 Contact landlord')}
              </button>
              <button onClick={() => setSaved((s) => !s)} style={{
                width: '100%', padding: '12px', borderRadius: '50px', border: '2px solid #E8EDF4',
                background: '#fff', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                fontWeight: '500', fontSize: '15px', color: '#4A5568',
              }}>
                {saved ? label('♥ שמור ברשימת המועדפים', '♥ Saved to favorites') : label('♡ הוסף למועדפים', '♡ Add to favorites')}
              </button>

              {!user && (
                <p style={{ textAlign: 'center', fontSize: '12px', color: '#8A9BB0', marginTop: '12px' }}>
                  {label('* נדרשת הרשמה לצפייה בפרטי קשר', '* Sign up to view contact details')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showContact && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,27,45,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '36px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#0F1B2D' }}>
              {label('צור קשר עם', 'Contact')} {property.landlordName}
            </h3>

            <div style={{ background: '#F8F9FA', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '20px' }}>📱</span>
                <div>
                  <div style={{ fontSize: '12px', color: '#8A9BB0' }}>{label('טלפון', 'Phone')}</div>
                  <div style={{ fontWeight: '600', color: '#0F1B2D' }}>{property.phone}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>📧</span>
                <div>
                  <div style={{ fontSize: '12px', color: '#8A9BB0' }}>{label('אימייל', 'Email')}</div>
                  <div style={{ fontWeight: '600', color: '#0F1B2D' }}>{property.email}</div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>{label('שלח הודעה ראשונית', 'Send a message')}</label>
              <textarea
                className="input-field"
                rows={4}
                defaultValue={lang === 'he'
                  ? `שלום ${property.landlordName.split(' ')[0]}, ראיתי את הנכס שלך ומעוניין לברר פרטים נוספים.`
                  : `Hello ${property.landlordName.split(' ')[0]}, I saw your listing and would like to ask for more details.`}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ flex: 1, padding: '14px', borderRadius: '50px', border: '2px solid #E8EDF4', background: '#fff', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }} onClick={() => setShowContact(false)}>
                {label('ביטול', 'Cancel')}
              </button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={handleSendMessage}>
                {label('שלח הודעה ←', 'Send message ←')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div style={{ position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)', background: '#0F1B2D', color: '#fff', padding: '16px 28px', borderRadius: '50px', display: 'flex', gap: '10px', alignItems: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.3)', zIndex: 1000 }}>
          <span style={{ color: '#27AE60', fontSize: '20px' }}>✓</span>
          <span>{label('ההודעה נשלחה! בעל הדירה יחזור אליך בקרוב.', 'Message sent! The landlord will contact you soon.')}</span>
        </div>
      )}
    </div>
  );
}
