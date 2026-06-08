import React, { useState } from 'react';
import { properties, LANGUAGES, CITIES } from './data';

const LANG_FLAGS = { 'עברית':'🇮🇱','אנגלית':'🇬🇧','רוסית':'🇷🇺','אוקראינית':'🇺🇦','ספרדית':'🇪🇸','צרפתית':'🇫🇷','אמהרית':'🇪🇹','ערבית':'🇸🇦' };

export default function SearchPage({ onNavigate, onSelectProperty, user }) {
  const [filters, setFilters] = useState({ city: '', minPrice: '', maxPrice: '', rooms: '', language: '', date: '' });
  const [saved, setSaved] = useState([]);
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    let filtered = properties;
    if (filters.city) filtered = filtered.filter(p => p.city === filters.city);
    if (filters.minPrice) filtered = filtered.filter(p => p.price >= Number(filters.minPrice));
    if (filters.maxPrice) filtered = filtered.filter(p => p.price <= Number(filters.maxPrice));
    if (filters.rooms) filtered = filtered.filter(p => p.rooms === Number(filters.rooms));
    if (filters.language) filtered = filtered.filter(p => p.languages.includes(filters.language));
    setResults(filtered);
    setSearched(true);
  };

  const toggleSave = (id) => setSaved(s => s.includes(id) ? s.filter(i => i !== id) : [...s, id]);

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      {/* כותרת */}
      <div style={{ background: 'linear-gradient(135deg, #0F1B2D, #1A2E45)', padding: '48px 24px 64px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{ color: '#fff', fontSize: '32px', marginBottom: '8px', fontFamily: 'Playfair Display, serif' }}>
            {user ? `שלום ${user.fullName?.split(' ')[0]} 👋` : 'חיפוש דירות'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px', fontSize: '16px' }}>
            {user?.languages?.length > 0
              ? `מחפש דירה עם בעל בית דובר ${user.languages.join(' / ')}`
              : 'מצא דירה בשפת האם שלך'}
          </p>

          {/* פילטרים */}
          <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '20px' }}>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#8A9BB0', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>עיר</label>
                <select className="input-field" value={filters.city} onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}>
                  <option value="">כל הערים</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#8A9BB0', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>שכ"ד מינ׳ (₪)</label>
                <input className="input-field" type="number" placeholder="0" value={filters.minPrice}
                  onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#8A9BB0', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>שכ"ד מקס׳ (₪)</label>
                <input className="input-field" type="number" placeholder="20,000" value={filters.maxPrice}
                  onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#8A9BB0', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>חדרים</label>
                <select className="input-field" value={filters.rooms} onChange={e => setFilters(f => ({ ...f, rooms: e.target.value }))}>
                  <option value="">הכל</option>
                  {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} חדרים</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#8A9BB0', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>שפת בעל הדירה</label>
                <select className="input-field" value={filters.language} onChange={e => setFilters(f => ({ ...f, language: e.target.value }))}>
                  <option value="">כל השפות</option>
                  {LANGUAGES.map(l => <option key={l} value={l}>{LANG_FLAGS[l]} {l}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#8A9BB0', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>תאריך כניסה</label>
                <input className="input-field" type="date" value={filters.date}
                  onChange={e => setFilters(f => ({ ...f, date: e.target.value }))} />
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%', fontSize: '16px', borderRadius: '12px' }} onClick={handleSearch}>
              🔍 חפש דירות
            </button>
          </div>
        </div>
      </div>

      {/* תוצאות */}
      <div style={{ maxWidth: '900px', margin: '-24px auto 0', padding: '0 24px 60px', position: 'relative', zIndex: 1 }}>
        {!searched && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#8A9BB0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
            <p style={{ fontSize: '18px' }}>הגדר פילטרים ולחץ על חיפוש</p>
          </div>
        )}

        {searched && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0 20px' }}>
              <p style={{ color: '#8A9BB0', fontSize: '15px' }}>
                {results.length === 0 ? 'לא נמצאו תוצאות' : `נמצאו ${results.length} נכסים`}
              </p>
              {saved.length > 0 && (
                <span style={{ background: 'rgba(29,95,138,0.1)', color: '#1D5F8A', padding: '6px 14px', borderRadius: '50px', fontSize: '13px', fontWeight: '600' }}>
                  ❤️ {saved.length} שמורים
                </span>
              )}
            </div>

            {results.length === 0 && (
              <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>😕</div>
                <h3 style={{ marginBottom: '8px' }}>לא נמצאו נכסים</h3>
                <p style={{ color: '#8A9BB0' }}>נסה לשנות את הפילטרים</p>
              </div>
            )}

            <div style={{ display: 'grid', gap: '20px' }}>
              {results.map(p => (
                <div key={p.id} className="card" style={{ display: 'flex', overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => { onSelectProperty(p); onNavigate('property'); }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img src={p.image} alt={p.title} style={{ width: '220px', height: '180px', objectFit: 'cover' }} />
                    {p.furnished && (
                      <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(15,27,45,0.8)', color: '#C9A84C', padding: '4px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: '600' }}>מרוהטת</span>
                    )}
                  </div>

                  <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '18px', color: '#0F1B2D' }}>{p.title}</h3>
                        <button onClick={e => { e.stopPropagation(); toggleSave(p.id); }} style={{
                          background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: saved.includes(p.id) ? '#E74C3C' : '#E8EDF4',
                        }}>♥</button>
                      </div>
                      <p style={{ color: '#8A9BB0', fontSize: '14px', marginBottom: '12px' }}>📍 {p.neighborhood}, {p.city}</p>

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        {p.languages.map(l => (
                          <span key={l} className="badge badge-blue">{LANG_FLAGS[l]} {l}</span>
                        ))}
                        {p.verified && <span className="badge badge-green">✓ מאומת</span>}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '20px', color: '#8A9BB0', fontSize: '14px' }}>
                        <span>🛏 {p.rooms} חדרים</span>
                        <span>📐 {p.size} מ"ר</span>
                        <span>📅 מ-{new Date(p.availableFrom).toLocaleDateString('he-IL')}</span>
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', color: '#0F1B2D', fontWeight: '700' }}>₪{p.price.toLocaleString()}</div>
                        <div style={{ fontSize: '12px', color: '#8A9BB0' }}>לחודש</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
