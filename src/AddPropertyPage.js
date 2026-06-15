import React, { useState } from 'react';
import { LANGUAGES, CITIES, CITY_MAP } from './data';

export default function AddPropertyPage({ onAddProperty, user, t, lang }) {
  const [form, setForm] = useState({
    title: '', city: '', neighborhood: '', price: '', rooms: '1', size: '',
    availableFrom: '', languages: [], description: '', phone: '', email: '',
    furnished: false, available: true, imageUploaded: false, tabu: null,
  });
  const [errors, setErrors] = useState({});

  const label = (he, en) => lang === 'he' ? he : en;

  const toggleLanguage = (langValue) => {
    setForm(f => ({
      ...f,
      languages: f.languages.includes(langValue)
        ? f.languages.filter(l => l !== langValue)
        : [...f.languages, langValue],
    }));
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = true;
    if (!form.city) next.city = true;
    if (!form.neighborhood.trim()) next.neighborhood = true;
    if (!form.price) next.price = true;
    if (!form.size) next.size = true;
    if (!form.availableFrom) next.availableFrom = true;
    if (form.languages.length === 0) next.languages = true;
    if (!form.description.trim()) next.description = true;
    if (!form.phone.trim()) next.phone = true;
    if (!form.email.trim()) next.email = true;
    if (!form.imageUploaded) next.imageUploaded = true;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const imageToUse = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80';
    const newProperty = {
      id: Date.now(),
      title: form.title,
      city: form.city,
      neighborhood: form.neighborhood,
      price: Number(form.price),
      rooms: Number(form.rooms),
      floor: 1,
      size: Number(form.size),
      availableFrom: form.availableFrom,
      languages: form.languages,
      landlordName: user?.fullName || label('בעל דירה', 'Landlord'),
      landlordPhoto: `https://i.pravatar.cc/80?u=${Date.now()}`,
      verified: false,
      furnished: form.furnished,
      available: form.available,
      image: imageToUse,
      images: [imageToUse],
      description: form.description,
      phone: form.phone,
      email: form.email,
      amenities: [],
      tabu: form.tabu,
    };
    onAddProperty(newProperty);
  };

  const required = label('שדה חובה', 'Required');
  const errorStyle = { color: '#E74C3C', fontSize: '12px', marginTop: '4px' };
  const fieldStyle = (key) => ({ borderColor: errors[key] ? '#E74C3C' : undefined });

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', padding: '40px 24px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '30px', color: '#0F1B2D' }}>{t('addNewProperty')}</h1>
          <p style={{ color: '#8A9BB0', marginTop: '6px' }}>
            {label('הזן את פרטי הנכס שלך כדי להופיע בחיפוש של דיירים', 'Enter your property details to appear in tenant searches')}
          </p>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          <div style={{ display: 'grid', gap: '20px' }}>

            {/* Title */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{label('כותרת הנכס *', 'Property title *')}</label>
              <input className="input-field" style={fieldStyle('title')} placeholder={label('לדוג׳ דירת 3 חדרים מרוהטת', 'e.g. Furnished 3-room apartment')} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              {errors.title && <div style={errorStyle}>{required}</div>}
            </div>

            {/* City & Neighborhood */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{label('עיר *', 'City *')}</label>
                <select className="input-field" style={fieldStyle('city')} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}>
                  <option value="">{label('בחר עיר', 'Choose city')}</option>
                  {CITIES.map(city => (
                    <option key={city} value={city}>{lang === 'en' ? (CITY_MAP[city] || city) : city}</option>
                  ))}
                </select>
                {errors.city && <div style={errorStyle}>{required}</div>}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{label('שכונה *', 'Neighborhood *')}</label>
                <input className="input-field" style={fieldStyle('neighborhood')} value={form.neighborhood} onChange={e => setForm(f => ({ ...f, neighborhood: e.target.value }))} />
                {errors.neighborhood && <div style={errorStyle}>{required}</div>}
              </div>
            </div>

            {/* Price, Rooms, Size */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{label('שכ"ד חודשי (₪) *', 'Monthly rent (₪) *')}</label>
                <input className="input-field" style={fieldStyle('price')} type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                {errors.price && <div style={errorStyle}>{required}</div>}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{label('חדרים', 'Rooms')}</label>
                <select className="input-field" value={form.rooms} onChange={e => setForm(f => ({ ...f, rooms: e.target.value }))}>
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{label('גודל (מ"ר) *', 'Size (sq.m) *')}</label>
                <input className="input-field" style={fieldStyle('size')} type="number" min="0" value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} />
                {errors.size && <div style={errorStyle}>{required}</div>}
              </div>
            </div>

            {/* Available from, Furnished, Available */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{label('תאריך כניסה *', 'Available from *')}</label>
                <input className="input-field" style={fieldStyle('availableFrom')} type="date" value={form.availableFrom} onChange={e => setForm(f => ({ ...f, availableFrom: e.target.value }))} />
                {errors.availableFrom && <div style={errorStyle}>{required}</div>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{label('מרוהט?', 'Furnished?')}</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '2px' }}>
                  <input type="checkbox" checked={form.furnished} onChange={e => setForm(f => ({ ...f, furnished: e.target.checked }))} />
                  {label('כן', 'Yes')}
                </label>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{label('סטטוס', 'Status')}</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[true, false].map(v => (
                    <button
                      key={String(v)}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, available: v }))}
                      style={{
                        flex: 1, padding: '8px 4px', borderRadius: '8px', border: '2px solid', cursor: 'pointer', fontSize: '12px', fontFamily: "'Heebo', sans-serif", fontWeight: '600',
                        borderColor: form.available === v ? (v ? '#27AE60' : '#E74C3C') : '#E8EDF4',
                        background: form.available === v ? (v ? 'rgba(39,174,96,0.1)' : 'rgba(231,76,60,0.08)') : '#fff',
                        color: form.available === v ? (v ? '#27AE60' : '#E74C3C') : '#8A9BB0',
                      }}
                    >
                      {v ? label('זמין', 'Available') : label('לא זמין', 'Unavailable')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Languages */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{label('שפות בעל הבית *', 'Landlord languages *')}</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {LANGUAGES.map(language => (
                  <button key={language} type="button" onClick={() => toggleLanguage(language)} style={{
                    padding: '8px 14px', borderRadius: '999px', border: '2px solid', cursor: 'pointer', fontSize: '13px', fontFamily: "'Heebo', sans-serif",
                    borderColor: form.languages.includes(language) ? '#1D5F8A' : '#E8EDF4',
                    background: form.languages.includes(language) ? 'rgba(29,95,138,0.1)' : '#fff',
                    color: form.languages.includes(language) ? '#1D5F8A' : '#4A5568',
                    fontWeight: form.languages.includes(language) ? '600' : '400',
                  }}>
                    {language}
                  </button>
                ))}
              </div>
              {errors.languages && <div style={errorStyle}>{label('בחר לפחות שפה אחת', 'Choose at least one language')}</div>}
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{label('תיאור הנכס *', 'Property description *')}</label>
              <textarea className="input-field" style={{ ...fieldStyle('description'), resize: 'vertical' }} rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              {errors.description && <div style={errorStyle}>{required}</div>}
            </div>

            {/* Image upload (simulated) */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{label('תמונה ראשית *', 'Main photo *')}</label>
              <div
                style={{
                  border: `2px dashed ${errors.imageUploaded ? '#E74C3C' : form.imageUploaded ? '#27AE60' : '#E8EDF4'}`,
                  borderRadius: '12px', padding: '32px', textAlign: 'center', cursor: 'pointer',
                  background: form.imageUploaded ? 'rgba(39,174,96,0.05)' : '#fff',
                  transition: 'border-color 0.2s',
                }}
                onClick={() => setForm(f => ({ ...f, imageUploaded: !f.imageUploaded }))}
              >
                {form.imageUploaded ? (
                  <div style={{ color: '#27AE60' }}>
                    <div style={{ fontSize: '32px' }}>🖼️</div>
                    <div style={{ fontWeight: '600', marginTop: '8px' }}>{label('התמונה הועלתה בהצלחה', 'Photo uploaded successfully')}</div>
                    <div style={{ fontSize: '12px', color: '#8A9BB0', marginTop: '4px' }}>{label('לחץ להסרה', 'Click to remove')}</div>
                  </div>
                ) : (
                  <div style={{ color: '#8A9BB0' }}>
                    <div style={{ fontSize: '32px' }}>📷</div>
                    <div style={{ marginTop: '8px' }}>{label('לחץ להעלאת תמונה', 'Click to upload photo')}</div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>JPG, PNG, HEIC</div>
                  </div>
                )}
              </div>
              {errors.imageUploaded && <div style={errorStyle}>{label('נדרשת לפחות תמונה אחת', 'At least one photo is required')}</div>}
            </div>

            {/* Tabu document */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{label('מסמך טאבו (אופציונלי)', 'Tabu document (optional)')}</label>
              <div style={{
                border: `2px dashed ${form.tabu ? '#1D5F8A' : '#E8EDF4'}`,
                borderRadius: '12px', padding: '24px', textAlign: 'center', cursor: 'pointer',
                background: form.tabu ? 'rgba(29,95,138,0.05)' : '#fff',
                transition: 'border-color 0.2s',
              }} onClick={() => setForm(f => ({ ...f, tabu: f.tabu ? null : 'uploaded' }))}>
                {form.tabu ? (
                  <div style={{ color: '#1D5F8A' }}>
                    <div style={{ fontSize: '28px' }}>📋</div>
                    <div style={{ fontWeight: '600', marginTop: '6px' }}>{label('מסמך טאבו הועלה', 'Tabu document uploaded')}</div>
                    <div style={{ fontSize: '12px', color: '#8A9BB0', marginTop: '4px' }}>{label('לחץ להסרה', 'Click to remove')}</div>
                  </div>
                ) : (
                  <div style={{ color: '#8A9BB0' }}>
                    <div style={{ fontSize: '28px' }}>📋</div>
                    <div style={{ marginTop: '6px' }}>{label('העלאת נסח טאבו', 'Upload Tabu extract')}</div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>PDF, JPG, PNG</div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{label('טלפון *', 'Phone *')}</label>
                <input className="input-field" style={fieldStyle('phone')} placeholder="+972..." value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                {errors.phone && <div style={errorStyle}>{required}</div>}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{label('אימייל *', 'Email *')}</label>
                <input className="input-field" style={fieldStyle('email')} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                {errors.email && <div style={errorStyle}>{required}</div>}
              </div>
            </div>

            <button className="btn-primary" style={{ padding: '16px 24px', marginTop: '8px', fontSize: '16px' }} onClick={handleSubmit}>
              {t('submitProperty')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
