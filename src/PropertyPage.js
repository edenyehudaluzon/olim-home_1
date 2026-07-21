import React, { useState, useEffect } from 'react';
import { LANG_FLAGS, LANGUAGE_MAP, CITY_MAP } from './data';

function getChats(propertyId) {
  try { return JSON.parse(localStorage.getItem(`chat_${propertyId}`) || '[]'); } catch { return []; }
}
function saveChats(propertyId, msgs) {
  localStorage.setItem(`chat_${propertyId}`, JSON.stringify(msgs));
}

export default function PropertyPage({ property, onNavigate, user, t, lang, savedIds, onToggleSaved, onContractClose, onToggleAvailability }) {
  const [activeImg, setActiveImg] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showContract, setShowContract] = useState(false);
  const [contractDone, setContractDone] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const label = (he, en) => lang === 'he' ? he : en;
  const translateCity = (city) => lang === 'en' ? (CITY_MAP[city] || city) : city;
  const translateLang = (l) => lang === 'en' ? (LANGUAGE_MAP[l] || l) : l;

  useEffect(() => {
    if (property) setChatMessages(getChats(property.id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property?.id]);

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

  const isSaved = savedIds?.includes(property.id);
  const isLandlord = user?.role === 'landlord';
  const isTenant = user?.role === 'tenant';
  const isUnavailable = property.available === false;

  const handleContact = () => {
    if (!user) { onNavigate('register'); return; }
    setShowContact(true);
  };

  const handleSendMessage = () => {
    setShowContact(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const msg = {
      id: Date.now(),
      from: user?.fullName || label('אנונימי', 'Anonymous'),
      role: user?.role || 'tenant',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString(lang === 'he' ? 'he-IL' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = [...chatMessages, msg];
    setChatMessages(updated);
    saveChats(property.id, updated);
    setChatInput('');
  };

  const handleConfirmContract = () => {
    onContractClose?.(property.id);
    setShowContract(false);
    setContractDone(true);
    setTimeout(() => setContractDone(false), 5000);
  };

  const availableLabel = lang === 'he'
    ? new Date(property.availableFrom).toLocaleDateString('he-IL')
    : new Date(property.availableFrom).toLocaleDateString('en-US');

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Breadcrumb */}
      <div style={{ background: '#fff', padding: '14px 32px', borderBottom: '1px solid #E8EDF4' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '14px', color: '#8A9BB0' }}>
          <span style={{ cursor: 'pointer', color: '#1D5F8A' }} onClick={() => onNavigate('search')}>{label('חיפוש', 'Search')}</span>
          <span>›</span>
          <span style={{ color: '#1D5F8A' }}>{translateCity(property.city)}</span>
          <span>›</span>
          <span style={{ color: '#0F1B2D' }}>{property.title}</span>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Unavailability banner */}
        {isUnavailable && (
          <div style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: '12px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🔒</span>
            <span style={{ color: '#C0392B', fontWeight: '600' }}>
              {label('נכס זה אינו זמין כרגע — חוזה נסגר', 'This property is currently unavailable — contract signed')}
            </span>
          </div>
        )}

        {/* Contract done banner */}
        {contractDone && (
          <div style={{ background: 'rgba(39,174,96,0.1)', border: '1px solid rgba(39,174,96,0.3)', borderRadius: '12px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🎉</span>
            <span style={{ color: '#1E8449', fontWeight: '600' }}>
              {label('מזל טוב! החוזה נסגר בהצלחה.', 'Congratulations! Contract signed successfully.')}
            </span>
          </div>
        )}

        {/* Images */}
        <div style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '32px', position: 'relative' }}>
          <img src={property.images[activeImg]} alt={property.title} style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }} />
          {property.images.length > 1 && (
            <div style={{ position: 'absolute', bottom: '16px', right: '16px', display: 'flex', gap: '8px' }}>
              {property.images.map((_, i) => (
                <button key={i} onClick={() => setActiveImg(i)} style={{ width: '60px', height: '44px', borderRadius: '8px', overflow: 'hidden', border: `2px solid ${activeImg === i ? '#C9A84C' : 'transparent'}`, cursor: 'pointer', padding: 0, background: 'none' }}>
                  <img src={property.images[i]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
          <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {property.verified && (
              <span style={{ background: 'rgba(39,174,96,0.9)', color: '#fff', padding: '6px 14px', borderRadius: '50px', fontSize: '13px', fontWeight: '600' }}>
                ✓ {label('נכס מאומת', 'Verified')}
              </span>
            )}
            {property.furnished && (
              <span style={{ background: 'rgba(15,27,45,0.8)', color: '#C9A84C', padding: '6px 14px', borderRadius: '50px', fontSize: '13px', fontWeight: '600' }}>
                {label('מרוהטת', 'Furnished')}
              </span>
            )}
            {property.tabu && (
              <span style={{ background: 'rgba(29,95,138,0.85)', color: '#fff', padding: '6px 14px', borderRadius: '50px', fontSize: '13px', fontWeight: '600' }}>
                📋 {label('טאבו', 'Tabu')}
              </span>
            )}
            <span style={{ background: isUnavailable ? 'rgba(231,76,60,0.85)' : 'rgba(39,174,96,0.85)', color: '#fff', padding: '6px 14px', borderRadius: '50px', fontSize: '13px', fontWeight: '600' }}>
              {isUnavailable ? label('לא זמין', 'Unavailable') : label('זמין', 'Available')}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h1 style={{ fontSize: '28px', color: '#0F1B2D', marginBottom: '4px' }}>{property.title}</h1>
                <p style={{ color: '#8A9BB0', fontSize: '16px' }}>📍 {property.neighborhood}, {translateCity(property.city)}</p>
              </div>
              <button
                onClick={() => onToggleSaved?.(property.id)}
                style={{ background: isSaved ? '#FFF0F0' : '#fff', border: `2px solid ${isSaved ? '#E74C3C' : '#E8EDF4'}`, borderRadius: '50px', padding: '10px 18px', cursor: 'pointer', color: isSaved ? '#E74C3C' : '#8A9BB0', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Heebo', sans-serif" }}
              >
                {isSaved ? '♥' : '♡'} {isSaved ? label('שמור', 'Saved') : label('שמור דירה', 'Save')}
              </button>
            </div>

            {/* Language badges */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {property.languages.map(l => (
                <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(29,95,138,0.08)', color: '#1D5F8A', padding: '8px 16px', borderRadius: '50px', fontSize: '14px', fontWeight: '600' }}>
                  {LANG_FLAGS[l] || ''} {label(`בעל הדירה דובר ${l}`, `Landlord speaks ${translateLang(l)}`)}
                </span>
              ))}
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
              {[
                { icon: '🛏', label: label('חדרים', 'Rooms'), value: property.rooms },
                { icon: '📐', label: label('שטח', 'Size'), value: lang === 'he' ? `${property.size} מ"ר` : `${property.size} sq.m` },
                { icon: '🏢', label: label('קומה', 'Floor'), value: property.floor },
                { icon: '📅', label: label('כניסה מ-', 'From'), value: availableLabel },
              ].map(d => (
                <div key={d.label} style={{ background: '#fff', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #E8EDF4' }}>
                  <div style={{ fontSize: '22px', marginBottom: '4px' }}>{d.icon}</div>
                  <div style={{ fontWeight: '700', fontSize: '15px', color: '#0F1B2D' }}>{d.value}</div>
                  <div style={{ fontSize: '11px', color: '#8A9BB0' }}>{d.label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#0F1B2D' }}>{label('על הנכס', 'About the property')}</h3>
              <p style={{ color: '#4A5568', lineHeight: 1.8, fontSize: '15px' }}>{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#0F1B2D' }}>{label('מה יש בנכס', 'Amenities')}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {property.amenities.map(a => (
                    <span key={a} style={{ background: '#F0F4F8', color: '#4A5568', padding: '8px 16px', borderRadius: '50px', fontSize: '14px' }}>✓ {a}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Landlord availability toggle */}
            {isLandlord && (
              <div style={{ background: '#F8F9FA', borderRadius: '14px', padding: '20px', border: '1px solid #E8EDF4' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#0F1B2D' }}>{label('ניהול נכס', 'Property management')}</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => onToggleAvailability?.(property.id, true)}
                    style={{ flex: 1, padding: '12px', borderRadius: '10px', border: `2px solid ${!isUnavailable ? '#27AE60' : '#E8EDF4'}`, background: !isUnavailable ? 'rgba(39,174,96,0.1)' : '#fff', color: !isUnavailable ? '#27AE60' : '#8A9BB0', fontWeight: '600', cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }}
                  >
                    ✓ {label('הנכס זמין', 'Mark available')}
                  </button>
                  <button
                    onClick={() => onToggleAvailability?.(property.id, false)}
                    style={{ flex: 1, padding: '12px', borderRadius: '10px', border: `2px solid ${isUnavailable ? '#E74C3C' : '#E8EDF4'}`, background: isUnavailable ? 'rgba(231,76,60,0.08)' : '#fff', color: isUnavailable ? '#E74C3C' : '#8A9BB0', fontWeight: '600', cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }}
                  >
                    🔒 {label('לא זמין', 'Mark unavailable')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="card" style={{ padding: '28px', position: 'sticky', top: '90px' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: '36px', color: '#0F1B2D', fontWeight: '700' }}>₪{property.price.toLocaleString()}</div>
                <div style={{ color: '#8A9BB0', fontSize: '13px' }}>{label('לחודש', 'per month')}</div>
              </div>

              <div style={{ borderTop: '1px solid #E8EDF4', borderBottom: '1px solid #E8EDF4', padding: '16px 0', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={property.landlordPhoto} alt={property.landlordName} style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: '600', color: '#0F1B2D', marginBottom: '2px' }}>{property.landlordName}</div>
                    <div style={{ fontSize: '13px', color: '#8A9BB0' }}>{label('בעל הנכס', 'Landlord')}</div>
                    {property.verified && <div style={{ fontSize: '12px', color: '#27AE60', fontWeight: '600' }}>✓ {label('מאומת', 'Verified')}</div>}
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(39,174,96,0.08)', border: '1px solid rgba(39,174,96,0.2)', borderRadius: '10px', padding: '12px', marginBottom: '16px', fontSize: '13px', color: '#2D7A50', lineHeight: 1.5 }}>
                {label('💚 נכס זה עומד בתקציב הטיפוסי של סל הקליטה', '💚 This property fits the typical absorption budget')}
              </div>

              {!isUnavailable && (
                <>
                  <button className="btn-primary" style={{ width: '100%', marginBottom: '10px', fontSize: '15px' }} onClick={handleContact}>
                    📞 {label('צור קשר', 'Contact landlord')}
                  </button>

                  {user && (
                    <button
                      onClick={() => setShowChat(true)}
                      style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '2px solid #1D5F8A', background: 'rgba(29,95,138,0.06)', cursor: 'pointer', fontFamily: "'Heebo', sans-serif", fontWeight: '600', fontSize: '14px', color: '#1D5F8A', marginBottom: '10px' }}
                    >
                      💬 {t('chat')} {chatMessages.length > 0 ? `(${chatMessages.length})` : ''}
                    </button>
                  )}

                  {isTenant && (
                    <button
                      onClick={() => setShowContract(true)}
                      style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '2px solid #C9A84C', background: 'rgba(201,168,76,0.08)', cursor: 'pointer', fontFamily: "'Heebo', sans-serif", fontWeight: '600', fontSize: '14px', color: '#8B6914', marginBottom: '10px' }}
                    >
                      📝 {t('signContract')}
                    </button>
                  )}
                </>
              )}

              <button
                onClick={() => onToggleSaved?.(property.id)}
                style={{ width: '100%', padding: '12px', borderRadius: '50px', border: '2px solid #E8EDF4', background: '#fff', cursor: 'pointer', fontFamily: "'Heebo', sans-serif", fontWeight: '500', fontSize: '14px', color: '#4A5568' }}
              >
                {isSaved ? label('♥ שמור במועדפים', '♥ Saved to favorites') : label('♡ הוסף למועדפים', '♡ Add to favorites')}
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

      {/* Contact modal */}
      {showContact && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,27,45,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }} onClick={() => setShowContact(false)}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '36px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#0F1B2D' }}>
              {label('צור קשר עם', 'Contact')} {property.landlordName}
            </h3>
            <div style={{ background: '#F8F9FA', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <span>📱</span>
                <div>
                  <div style={{ fontSize: '12px', color: '#8A9BB0' }}>{label('טלפון', 'Phone')}</div>
                  <div style={{ fontWeight: '600', color: '#0F1B2D' }}>{property.phone}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span>📧</span>
                <div>
                  <div style={{ fontSize: '12px', color: '#8A9BB0' }}>{label('אימייל', 'Email')}</div>
                  <div style={{ fontWeight: '600', color: '#0F1B2D' }}>{property.email}</div>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>{label('שלח הודעה', 'Send a message')}</label>
              <textarea className="input-field" rows={4} style={{ resize: 'vertical' }}
                defaultValue={lang === 'he'
                  ? `שלום ${property.landlordName.split(' ')[0]}, ראיתי את הנכס שלך ומעוניין לברר פרטים.`
                  : `Hello ${property.landlordName.split(' ')[0]}, I saw your listing and would like to learn more.`}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ flex: 1, padding: '14px', borderRadius: '50px', border: '2px solid #E8EDF4', background: '#fff', cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }} onClick={() => setShowContact(false)}>{label('ביטול', 'Cancel')}</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={handleSendMessage}>{label('שלח הודעה ←', 'Send →')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Chat modal */}
      {showChat && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,27,45,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }} onClick={() => setShowChat(false)}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '80vh' }} onClick={e => e.stopPropagation()}>
            <div style={{ background: '#0F1B2D', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#fff', fontWeight: '600' }}>💬 {t('chat')}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{property.landlordName}</div>
              </div>
              <button onClick={() => setShowChat(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '22px' }}>×</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '200px' }}>
              {chatMessages.length === 0 && (
                <div style={{ textAlign: 'center', color: '#8A9BB0', padding: '32px 0' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
                  <p>{label('התחל שיחה עם בעל הדירה', 'Start a conversation with the landlord')}</p>
                </div>
              )}
              {chatMessages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'tenant' ? (lang === 'he' ? 'flex-end' : 'flex-start') : (lang === 'he' ? 'flex-start' : 'flex-end') }}>
                  <div style={{ fontSize: '11px', color: '#8A9BB0', marginBottom: '4px' }}>{msg.from} · {msg.time}</div>
                  <div style={{
                    background: msg.role === 'tenant' ? '#1D5F8A' : '#F0F4F8',
                    color: msg.role === 'tenant' ? '#fff' : '#0F1B2D',
                    padding: '10px 14px', borderRadius: '12px', fontSize: '14px', lineHeight: 1.5, maxWidth: '80%',
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '12px 16px', borderTop: '1px solid #E8EDF4', display: 'flex', gap: '10px' }}>
              <input
                className="input-field"
                style={{ flex: 1 }}
                placeholder={label('כתוב הודעה...', 'Type a message...')}
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSendChat(); }}
              />
              <button className="btn-primary" style={{ padding: '12px 20px', flexShrink: 0 }} onClick={handleSendChat}>
                {label('שלח', 'Send')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contract confirmation modal */}
      {showContract && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,27,45,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }} onClick={() => setShowContract(false)}>
          <div className="card" style={{ width: '100%', maxWidth: '460px', padding: '36px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>📝</div>
            <h3 style={{ fontSize: '22px', marginBottom: '10px', color: '#0F1B2D' }}>{t('signContract')}</h3>
            <p style={{ color: '#8A9BB0', lineHeight: 1.6, marginBottom: '24px' }}>
              {label(
                `אתה עומד לסגור חוזה על הנכס "${property.title}". הנכס יסומן כלא זמין ומונה החוזים יתעדכן בזמן אמת.`,
                `You are about to sign a contract for "${property.title}". The property will be marked as unavailable and the live contracts counter will update.`
              )}
            </p>
            <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '10px', padding: '12px', marginBottom: '24px', fontSize: '14px', color: '#8B6914' }}>
              📍 {property.neighborhood}, {translateCity(property.city)} · ₪{property.price.toLocaleString()} {label('לחודש', '/mo')}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ flex: 1, padding: '14px', borderRadius: '50px', border: '2px solid #E8EDF4', background: '#fff', cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }} onClick={() => setShowContract(false)}>
                {label('ביטול', 'Cancel')}
              </button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={handleConfirmContract}>
                {label('✓ אשר וסגור חוזה', '✓ Confirm & sign')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success toast */}
      {showSuccess && (
        <div style={{ position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)', background: '#0F1B2D', color: '#fff', padding: '16px 28px', borderRadius: '50px', display: 'flex', gap: '10px', alignItems: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.3)', zIndex: 1000, animation: 'fadeIn 0.3s ease' }}>
          <span style={{ color: '#27AE60', fontSize: '20px' }}>✓</span>
          <span>{label('ההודעה נשלחה! בעל הדירה יחזור אליך בקרוב.', 'Message sent! The landlord will contact you soon.')}</span>
        </div>
      )}
    </div>
  );
}
