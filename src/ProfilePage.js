import React, { useState } from 'react';
import { LANGUAGES, COUNTRIES, COUNTRY_MAP, CITY_MAP, LANGUAGE_MAP, LANG_FLAGS } from './data';

const CONTRACT_STEPS_HE = ['פנייה ראשונית', 'ביקור בנכס', 'במשא ומתן', 'חוזה נחתם'];
const CONTRACT_STEPS_EN = ['Contacted', 'Property visited', 'Negotiating', 'Contract signed'];
const CONTRACT_ICONS = ['📞', '🏠', '🤝', '📝'];

export default function ProfilePage({ user, setUser, onNavigate, t, lang, savedIds, properties, onToggleSaved, onSelectProperty, contractStatuses = {}, onUpdateContractStatus }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user });
  const [saved, setSaved] = useState(false);

  const label = (he, en) => lang === 'he' ? he : en;
  const translateCity = (city) => lang === 'en' ? (CITY_MAP[city] || city) : city;
  const translateLang = (l) => lang === 'en' ? (LANGUAGE_MAP[l] || l) : l;

  const savedProperties = properties.filter(p => savedIds?.includes(p.id));

  const toggleLanguage = (l) => {
    setForm(f => ({
      ...f,
      languages: f.languages?.includes(l) ? f.languages.filter(x => x !== l) : [...(f.languages || []), l],
    }));
  };

  const handleSave = () => {
    if (!form.fullName?.trim()) return;
    setUser(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const roleLabel = user?.role === 'landlord'
    ? label('בעל דירה', 'Landlord')
    : label('דייר', 'Tenant');

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0F1B2D, #1A2E45)', padding: '48px 24px 64px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #C9A84C, #F0C96B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '700', color: '#0F1B2D', flexShrink: 0 }}>
            {user?.fullName?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: '26px', marginBottom: '4px' }}>{user?.fullName}</h1>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(201,168,76,0.2)', color: '#F0C96B', padding: '4px 12px', borderRadius: '50px', fontSize: '13px', fontWeight: '600' }}>{roleLabel}</span>
              {user?.country && (
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  🌍 {lang === 'en' ? (COUNTRY_MAP[user.country] || user.country) : user.country}
                </span>
              )}
              {user?.languages?.length > 0 && user.languages.map(l => (
                <span key={l} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{LANG_FLAGS[l] || ''} {translateLang(l)}</span>
              ))}
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            style={{ marginInlineStart: 'auto', padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', fontFamily: "'Heebo', sans-serif", fontWeight: '500', fontSize: '14px' }}
          >
            ✏️ {t('editProfile')}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '-24px auto 0', padding: '0 24px', position: 'relative', zIndex: 1 }}>

        {/* Save confirmation */}
        {saved && (
          <div style={{ background: '#27AE60', color: '#fff', borderRadius: '12px', padding: '14px 20px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', animation: 'fadeIn 0.3s ease' }}>
            <span>✓</span>
            <span>{label('הפרופיל עודכן בהצלחה', 'Profile updated successfully')}</span>
          </div>
        )}

        {/* Edit profile form */}
        {editing && (
          <div className="card" style={{ padding: '28px', marginBottom: '28px', animation: 'fadeIn 0.3s ease' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '24px', color: '#0F1B2D' }}>{t('editProfile')}</h2>
            <div style={{ display: 'grid', gap: '16px' }}>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>{label('שם מלא *', 'Full name *')}</label>
                  <input className="input-field" value={form.fullName || ''} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>{label('טלפון', 'Phone')}</label>
                  <input className="input-field" placeholder="+972..." value={form.phone || ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>{label('אימייל', 'Email')}</label>
                <input className="input-field" type="email" value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>{label('ארץ מוצא', 'Country of origin')}</label>
                <select className="input-field" value={form.country || ''} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}>
                  <option value="">{label('בחר ארץ', 'Select country')}</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{lang === 'en' ? (COUNTRY_MAP[c] || c) : c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>{label('שפות מדוברות', 'Spoken languages')}</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {LANGUAGES.map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => toggleLanguage(l)}
                      style={{
                        padding: '7px 14px', borderRadius: '50px', border: '2px solid', cursor: 'pointer', fontSize: '13px', fontFamily: "'Heebo', sans-serif",
                        borderColor: form.languages?.includes(l) ? '#1D5F8A' : '#E8EDF4',
                        background: form.languages?.includes(l) ? 'rgba(29,95,138,0.1)' : '#fff',
                        color: form.languages?.includes(l) ? '#1D5F8A' : '#8A9BB0',
                        fontWeight: form.languages?.includes(l) ? '600' : '400',
                      }}
                    >{LANG_FLAGS[l] || ''} {l}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button className="btn-primary" style={{ flex: 2 }} onClick={handleSave}>{label('שמור שינויים', 'Save changes')}</button>
                <button style={{ flex: 1, padding: '14px', borderRadius: '50px', border: '2px solid #E8EDF4', background: '#fff', cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }} onClick={() => { setEditing(false); setForm({ ...user }); }}>
                  {label('ביטול', 'Cancel')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile info card */}
        {!editing && (
          <div className="card" style={{ padding: '24px', marginBottom: '28px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '20px', color: '#0F1B2D' }}>{label('פרטי חשבון', 'Account details')}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: label('שם מלא', 'Full name'), value: user?.fullName },
                { label: label('סוג משתמש', 'Role'), value: roleLabel },
                { label: label('טלפון', 'Phone'), value: user?.phone || label('לא הוזן', 'Not set') },
                { label: label('אימייל', 'Email'), value: user?.email || label('לא הוזן', 'Not set') },
                { label: label('ארץ מוצא', 'Country'), value: user?.country ? (lang === 'en' ? (COUNTRY_MAP[user.country] || user.country) : user.country) : label('לא הוזן', 'Not set') },
                { label: label('תאריך לידה', 'Birth date'), value: user?.birthDate || label('לא הוזן', 'Not set') },
              ].map(row => (
                <div key={row.label}>
                  <div style={{ fontSize: '12px', color: '#8A9BB0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{row.label}</div>
                  <div style={{ fontSize: '15px', color: '#0F1B2D', fontWeight: '500' }}>{row.value}</div>
                </div>
              ))}
            </div>
            {user?.languages?.length > 0 && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E8EDF4' }}>
                <div style={{ fontSize: '12px', color: '#8A9BB0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>{label('שפות', 'Languages')}</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {user.languages.map(l => (
                    <span key={l} className="badge badge-blue">{LANG_FLAGS[l] || ''} {translateLang(l)}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Saved Properties */}
        <div>
          <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#0F1B2D' }}>
            ❤️ {t('savedProperties')} {savedProperties.length > 0 ? `(${savedProperties.length})` : ''}
          </h2>

          {savedProperties.length === 0 ? (
            <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
              <h3 style={{ marginBottom: '8px', color: '#0F1B2D' }}>{label('אין דירות שמורות', 'No saved properties')}</h3>
              <p style={{ color: '#8A9BB0', marginBottom: '24px' }}>{label('שמור דירות שאהבת לצפייה מאוחרת יותר', 'Save properties you like to view them later')}</p>
              <button className="btn-primary" onClick={() => onNavigate('search')}>{label('חפש דירות', 'Browse listings')}</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {savedProperties.map(p => {
                const steps = lang === 'he' ? CONTRACT_STEPS_HE : CONTRACT_STEPS_EN;
                const currentStep = contractStatuses[p.id] ?? -1;
                return (
                  <div key={p.id} className="card" style={{ overflow: 'hidden', opacity: p.available === false ? 0.8 : 1 }}>
                    {/* Property row */}
                    <div
                      style={{ display: 'flex', cursor: 'pointer' }}
                      onClick={() => onSelectProperty(p.id)}
                    >
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <img src={p.image} alt={p.title} style={{ width: '180px', height: '140px', objectFit: 'cover' }} />
                        {p.available === false && (
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,27,45,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ background: '#E74C3C', color: '#fff', padding: '4px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: '700' }}>{label('לא זמין', 'Unavailable')}</span>
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h3 style={{ fontSize: '16px', color: '#0F1B2D', marginBottom: '2px' }}>{p.title}</h3>
                              <p style={{ color: '#8A9BB0', fontSize: '13px' }}>📍 {p.neighborhood}, {translateCity(p.city)}</p>
                            </div>
                            <button
                              onClick={e => { e.stopPropagation(); onToggleSaved?.(p.id); }}
                              style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#E74C3C', lineHeight: 1, flexShrink: 0 }}
                              title={label('הסר ממועדפים', 'Remove from favorites')}
                            >♥</button>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                            {p.languages.map(l => <span key={l} className="badge badge-blue" style={{ fontSize: '11px' }}>{LANG_FLAGS[l] || ''} {translateLang(l)}</span>)}
                            {p.available !== false && <span className="badge badge-green" style={{ fontSize: '11px' }}>● {label('זמין', 'Available')}</span>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                          <span style={{ color: '#8A9BB0', fontSize: '13px' }}>🛏 {p.rooms} · 📐 {p.size} {label('מ"ר', 'sq.m')}</span>
                          <span style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: '18px', fontWeight: '700', color: '#0F1B2D' }}>₪{p.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contract progress tracker */}
                    <div style={{ borderTop: '1px solid #E8EDF4', padding: '16px 20px', background: '#FAFBFC' }}>
                      <div style={{ fontSize: '12px', color: '#8A9BB0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                        {label('סטטוס התקדמות', 'Progress status')}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                        {steps.map((step, i) => {
                          const done = i <= currentStep;
                          const active = i === currentStep;
                          return (
                            <React.Fragment key={i}>
                              <button
                                onClick={() => onUpdateContractStatus?.(p.id, i === currentStep ? i - 1 : i)}
                                title={step}
                                style={{
                                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                                  background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px', minWidth: '60px',
                                }}
                              >
                                <div style={{
                                  width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '16px',
                                  background: done ? (active ? '#1D5F8A' : 'rgba(29,95,138,0.15)') : '#F0F4F8',
                                  border: `2px solid ${done ? '#1D5F8A' : '#E8EDF4'}`,
                                  transition: 'all 0.2s',
                                  boxShadow: active ? '0 0 0 3px rgba(29,95,138,0.2)' : 'none',
                                }}>
                                  {done && !active ? '✓' : CONTRACT_ICONS[i]}
                                </div>
                                <span style={{ fontSize: '10px', color: done ? '#1D5F8A' : '#8A9BB0', fontWeight: done ? '600' : '400', textAlign: 'center', lineHeight: 1.3, maxWidth: '60px' }}>
                                  {step}
                                </span>
                              </button>
                              {i < steps.length - 1 && (
                                <div style={{ flex: 1, height: '2px', background: i < currentStep ? '#1D5F8A' : '#E8EDF4', transition: 'background 0.3s', marginBottom: '20px' }} />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
