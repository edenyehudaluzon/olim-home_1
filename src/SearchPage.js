import React, { useState } from 'react';
import { LANGUAGES, CITIES, CITY_MAP, LANGUAGE_MAP, LANG_FLAGS } from './data';

export default function SearchPage({ onNavigate, onSelectProperty, user, properties, t, lang, onAddTenant, savedIds, onToggleSaved }) {
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [tenantForm, setTenantForm] = useState({ fullName: '', phone: '', email: '', languages: [] });
  const [tenantSaved, setTenantSaved] = useState(false);
  const [filters, setFilters] = useState({ city: '', minPrice: '', maxPrice: '', rooms: '', language: '', date: '', available: '' });
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState([]);

  const label = (he, en) => lang === 'he' ? he : en;

  const translateCity = (city) => lang === 'en' ? (CITY_MAP[city] || city) : city;
  const translateLang = (l) => lang === 'en' ? (LANGUAGE_MAP[l] || l) : l;

  const handleSearch = () => {
    let filtered = properties;
    if (filters.city) filtered = filtered.filter(p => p.city === filters.city);
    if (filters.minPrice) filtered = filtered.filter(p => p.price >= Number(filters.minPrice));
    if (filters.maxPrice) filtered = filtered.filter(p => p.price <= Number(filters.maxPrice));
    if (filters.rooms) filtered = filtered.filter(p => p.rooms === Number(filters.rooms));
    if (filters.language) filtered = filtered.filter(p => p.languages.includes(filters.language));
    if (filters.date) filtered = filtered.filter(p => p.availableFrom <= filters.date);
    if (filters.available === 'available') filtered = filtered.filter(p => p.available !== false);
    if (filters.available === 'unavailable') filtered = filtered.filter(p => p.available === false);
    setResults(filtered);
    setSearched(true);
  };

  const toggleTenantLanguage = (langValue) => {
    setTenantForm(f => ({
      ...f,
      languages: f.languages.includes(langValue) ? f.languages.filter(l => l !== langValue) : [...f.languages, langValue],
    }));
  };

  const handleAddTenantSubmit = () => {
    if (!tenantForm.fullName.trim()) return;
    const newTenant = {
      id: Date.now(), fullName: tenantForm.fullName,
      phone: tenantForm.phone, email: tenantForm.email,
      languages: tenantForm.languages, createdAt: new Date().toISOString(),
    };
    onAddTenant?.(newTenant);
    setTenantSaved(true);
    setTimeout(() => {
      setTenantSaved(false);
      setShowAddTenant(false);
      setTenantForm({ fullName: '', phone: '', email: '', languages: [] });
    }, 1400);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0F1B2D, #1A2E45)', padding: '48px 24px 64px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h1 style={{ color: '#fff', fontSize: '30px', fontFamily: "'Frank Ruhl Libre', serif" }}>
              {user
                ? (label(`שלום ${user.fullName?.split(' ')[0]} 👋`, `Hi ${user.fullName?.split(' ')[0]} 👋`))
                : label('חיפוש דירות', 'Search listings')}
            </h1>
            <div style={{ display: 'flex', gap: '10px' }}>
              {user?.role === 'landlord' && (
                <>
                  <button className="btn-primary" style={{ padding: '10px 16px', fontSize: '13px' }} onClick={() => onNavigate('addProperty')}>
                    {label('➕ הוסף דירה', '➕ Add property')}
                  </button>
                  <button style={{ padding: '10px 16px', fontSize: '13px', borderRadius: '10px', border: '1px solid #E8EDF4', background: '#fff', cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }} onClick={() => setShowAddTenant(true)}>
                    {label('➕ הוסף דייר', '➕ Add tenant')}
                  </button>
                </>
              )}
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px', fontSize: '15px' }}>
            {label('מצא דירה בשפת האם שלך', 'Find a home in your language')}
          </p>

          {/* Filters */}
          <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', marginBottom: '20px' }}>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#8A9BB0', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label('עיר', 'City')}</label>
                <select className="input-field" value={filters.city} onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}>
                  <option value="">{label('כל הערים', 'All cities')}</option>
                  {CITIES.map(c => <option key={c} value={c}>{translateCity(c)}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#8A9BB0', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label('שכ"ד מינ׳', 'Min rent')}</label>
                <input className="input-field" type="number" placeholder="₪0" value={filters.minPrice} onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#8A9BB0', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label('שכ"ד מקס׳', 'Max rent')}</label>
                <input className="input-field" type="number" placeholder="₪20,000" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#8A9BB0', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label('חדרים', 'Rooms')}</label>
                <select className="input-field" value={filters.rooms} onChange={e => setFilters(f => ({ ...f, rooms: e.target.value }))}>
                  <option value="">{label('הכל', 'Any')}</option>
                  {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#8A9BB0', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label('שפת בעל הדירה', 'Landlord lang')}</label>
                <select className="input-field" value={filters.language} onChange={e => setFilters(f => ({ ...f, language: e.target.value }))}>
                  <option value="">{label('כל השפות', 'All')}</option>
                  {LANGUAGES.map(l => <option key={l} value={l}>{(LANG_FLAGS[l] || '') + ' ' + translateLang(l)}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#8A9BB0', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label('זמינות', 'Availability')}</label>
                <select className="input-field" value={filters.available} onChange={e => setFilters(f => ({ ...f, available: e.target.value }))}>
                  <option value="">{label('הכל', 'All')}</option>
                  <option value="available">{label('זמין', 'Available')}</option>
                  <option value="unavailable">{label('לא זמין', 'Unavailable')}</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#8A9BB0', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label('תאריך כניסה', 'Available from')}</label>
                <input className="input-field" type="date" value={filters.date} onChange={e => setFilters(f => ({ ...f, date: e.target.value }))} />
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%', fontSize: '16px', borderRadius: '12px' }} onClick={handleSearch}>
              {label('🔍 חפש דירות', '🔍 Search listings')}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: '900px', margin: '-24px auto 0', padding: '0 24px 60px', position: 'relative', zIndex: 1 }}>
        {!searched && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#8A9BB0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
            <p style={{ fontSize: '18px' }}>{label('הגדר פילטרים ולחץ על חיפוש', 'Set filters and click search')}</p>
          </div>
        )}

        {searched && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0 20px' }}>
              <p style={{ color: '#8A9BB0', fontSize: '14px' }}>
                {results.length === 0
                  ? label('לא נמצאו תוצאות', 'No results found')
                  : lang === 'he' ? `נמצאו ${results.length} נכסים` : `${results.length} properties found`}
              </p>
              {savedIds?.length > 0 && (
                <span style={{ background: 'rgba(29,95,138,0.1)', color: '#1D5F8A', padding: '6px 14px', borderRadius: '50px', fontSize: '13px', fontWeight: '600' }}>
                  ❤️ {savedIds.length} {label('שמורים', 'saved')}
                </span>
              )}
            </div>

            {results.length === 0 && (
              <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>😕</div>
                <h3 style={{ marginBottom: '8px' }}>{label('לא נמצאו נכסים', 'No properties found')}</h3>
                <p style={{ color: '#8A9BB0' }}>{label('נסה לשנות את הפילטרים', 'Try changing the filters')}</p>
              </div>
            )}

            <div style={{ display: 'grid', gap: '20px' }}>
              {results.map(p => {
                const isSaved = savedIds?.includes(p.id);
                return (
                  <div
                    key={p.id}
                    className="card"
                    style={{ display: 'flex', overflow: 'hidden', cursor: 'pointer', opacity: p.available === false ? 0.75 : 1 }}
                    onClick={() => { onSelectProperty(p.id); onNavigate('property'); }}
                  >
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img src={p.image} alt={p.title} style={{ width: '220px', height: '180px', objectFit: 'cover' }} />
                      {p.furnished && (
                        <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(15,27,45,0.8)', color: '#C9A84C', padding: '4px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: '600' }}>
                          {label('מרוהטת', 'Furnished')}
                        </span>
                      )}
                      {p.available === false && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,27,45,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ background: '#E74C3C', color: '#fff', padding: '6px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: '700' }}>
                            {label('לא זמין', 'Unavailable')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <div>
                            <h3 style={{ fontSize: '17px', color: '#0F1B2D', marginBottom: '2px' }}>{p.title}</h3>
                            <p style={{ color: '#8A9BB0', fontSize: '13px' }}>📍 {p.neighborhood}, {translateCity(p.city)}</p>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            {p.available !== false && (
                              <span style={{ background: 'rgba(39,174,96,0.1)', color: '#27AE60', padding: '4px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: '600' }}>
                                ● {label('זמין', 'Available')}
                              </span>
                            )}
                            <button
                              onClick={e => { e.stopPropagation(); onToggleSaved?.(p.id); }}
                              style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: isSaved ? '#E74C3C' : '#E8EDF4', lineHeight: 1 }}
                            >♥</button>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                          {p.languages.map(l => (
                            <span key={l} className="badge badge-blue">
                              {(LANG_FLAGS[l] || '') + ' ' + translateLang(l)}
                            </span>
                          ))}
                          {p.verified && <span className="badge badge-green">✓ {label('מאומת', 'Verified')}</span>}
                          {p.tabu && <span className="badge badge-gold">📋 {label('טאבו', 'Tabu')}</span>}
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                        <div style={{ display: 'flex', gap: '16px', color: '#8A9BB0', fontSize: '13px' }}>
                          <span>🛏 {p.rooms}</span>
                          <span>📐 {p.size} {label('מ"ר', 'sq.m')}</span>
                          <span>📅 {lang === 'en' ? new Date(p.availableFrom).toLocaleDateString('en-US') : new Date(p.availableFrom).toLocaleDateString('he-IL')}</span>
                        </div>
                        <div style={{ textAlign: lang === 'he' ? 'left' : 'right' }}>
                          <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: '22px', color: '#0F1B2D', fontWeight: '700' }}>₪{p.price.toLocaleString()}</div>
                          <div style={{ fontSize: '11px', color: '#8A9BB0' }}>{label('לחודש', 'per month')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Add Tenant Modal */}
        {showAddTenant && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,27,45,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }} onClick={() => setShowAddTenant(false)}>
            <div className="card" style={{ width: '100%', maxWidth: '520px', padding: '28px' }} onClick={e => e.stopPropagation()}>
              <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>{label('הוספת דייר חדש', 'Add new tenant')}</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <input className="input-field" placeholder={label('שם מלא *', 'Full name *')} value={tenantForm.fullName} onChange={e => setTenantForm(f => ({ ...f, fullName: e.target.value }))} />
                <input className="input-field" placeholder={label('טלפון', 'Phone')} value={tenantForm.phone} onChange={e => setTenantForm(f => ({ ...f, phone: e.target.value }))} />
                <input className="input-field" placeholder={label('אימייל', 'Email')} value={tenantForm.email} onChange={e => setTenantForm(f => ({ ...f, email: e.target.value }))} />
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {LANGUAGES.map(l => (
                    <button key={l} type="button" onClick={() => toggleTenantLanguage(l)} style={{ padding: '7px 12px', borderRadius: '999px', border: '1px solid', fontSize: '13px', fontFamily: "'Heebo', sans-serif", cursor: 'pointer', borderColor: tenantForm.languages.includes(l) ? '#1D5F8A' : '#E8EDF4', background: tenantForm.languages.includes(l) ? 'rgba(29,95,138,0.08)' : '#fff', color: tenantForm.languages.includes(l) ? '#1D5F8A' : '#4A5568' }}>{l}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-primary" style={{ flex: 1 }} onClick={handleAddTenantSubmit}>{label('שמור דייר', 'Save tenant')}</button>
                  <button style={{ flex: 1, borderRadius: '10px', border: '1px solid #E8EDF4', background: '#fff', cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }} onClick={() => setShowAddTenant(false)}>{label('ביטול', 'Cancel')}</button>
                </div>
                {tenantSaved && <div style={{ textAlign: 'center', color: '#27AE60', fontWeight: 600 }}>{label('הדייר נוסף!', 'Tenant added!')}</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
