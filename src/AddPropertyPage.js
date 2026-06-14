import React, { useState } from 'react';
import { LANGUAGES, CITIES } from './data';

export default function AddPropertyPage({ onAddProperty, user, t, lang }) {
  const [form, setForm] = useState({
    title: '',
    city: '',
    neighborhood: '',
    price: '',
    rooms: '1',
    size: '',
    availableFrom: '',
    languages: [],
    description: '',
    phone: '',
    email: '',
    furnished: false,
  });
  const [errors, setErrors] = useState({});

  const toggleLanguage = (langValue) => {
    setForm((f) => ({
      ...f,
      languages: f.languages.includes(langValue)
        ? f.languages.filter((l) => l !== langValue)
        : [...f.languages, langValue],
    }));
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = true;
    if (!form.city) next.city = true;
    if (!form.neighborhood.trim()) next.neighborhood = true;
    if (!form.price) next.price = true;
    if (!form.availableFrom) next.availableFrom = true;
    if (form.languages.length === 0) next.languages = true;
    if (!form.description.trim()) next.description = true;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const newProperty = {
      id: Date.now(),
      title: form.title,
      city: form.city,
      neighborhood: form.neighborhood,
      price: Number(form.price),
      rooms: Number(form.rooms),
      floor: 1,
      size: Number(form.size || 50),
      availableFrom: form.availableFrom,
      languages: form.languages,
      landlordName: user?.fullName || 'בעל דירה',
      landlordPhoto: `https://i.pravatar.cc/80?u=${Date.now()}`,
      verified: false,
      furnished: form.furnished,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
      description: form.description,
      phone: form.phone || '050-0000000',
      email: form.email || 'landlord@example.com',
      amenities: ['מיזוג', 'אינטרנט', 'חניה'],
    };
    onAddProperty(newProperty);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', padding: '40px 24px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '32px', color: '#0F1B2D' }}>{t('addNewProperty')}</h1>
            <p style={{ color: '#8A9BB0' }}>
              {lang === 'he'
                ? 'הזן את פרטי הנכס שלך כדי להופיע בחיפוש של דיירים'
                : 'Enter your property details to appear in tenant searches.'}
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          <div style={{ display: 'grid', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{lang === 'he' ? 'כותרת הנכס' : 'Property title'}</label>
              <input className="input-field" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              {errors.title && <div style={{ color: '#E74C3C', fontSize: '12px' }}>{lang === 'he' ? 'שדה חובה' : 'Required field'}</div>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{lang === 'he' ? 'עיר' : 'City'}</label>
                <select className="input-field" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}>
                  <option value="">{lang === 'he' ? 'בחר עיר' : 'Choose city'}</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && <div style={{ color: '#E74C3C', fontSize: '12px' }}>{lang === 'he' ? 'שדה חובה' : 'Required field'}</div>}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{lang === 'he' ? 'שכונה' : 'Neighborhood'}</label>
                <input className="input-field" value={form.neighborhood} onChange={(e) => setForm((f) => ({ ...f, neighborhood: e.target.value }))} />
                {errors.neighborhood && <div style={{ color: '#E74C3C', fontSize: '12px' }}>{lang === 'he' ? 'שדה חובה' : 'Required field'}</div>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{lang === 'he' ? 'שכ"ד חודשי (₪)' : 'Monthly rent (₪)'}</label>
                <input className="input-field" type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
                {errors.price && <div style={{ color: '#E74C3C', fontSize: '12px' }}>{lang === 'he' ? 'שדה חובה' : 'Required field'}</div>}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{lang === 'he' ? 'חדרים' : 'Rooms'}</label>
                <select className="input-field" value={form.rooms} onChange={(e) => setForm((f) => ({ ...f, rooms: e.target.value }))}>
                  {[1, 2, 3, 4, 5].map((count) => (
                    <option key={count} value={count}>{count}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{lang === 'he' ? 'גודל (מ"ר)' : 'Size (sq.m)'}</label>
                <input className="input-field" type="number" value={form.size} onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{lang === 'he' ? 'תאריך כניסה' : 'Available from'}</label>
                <input className="input-field" type="date" value={form.availableFrom} onChange={(e) => setForm((f) => ({ ...f, availableFrom: e.target.value }))} />
                {errors.availableFrom && <div style={{ color: '#E74C3C', fontSize: '12px' }}>{lang === 'he' ? 'שדה חובה' : 'Required field'}</div>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{lang === 'he' ? 'מרוהט?' : 'Furnished?'}</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" checked={form.furnished} onChange={(e) => setForm((f) => ({ ...f, furnished: e.target.checked }))} />
                  {lang === 'he' ? 'כן' : 'Yes'}
                </label>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{lang === 'he' ? 'שפות דוברות על ידי בעל הבית' : 'Landlord languages'}</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {LANGUAGES.map((language) => (
                  <button key={language} type="button" onClick={() => toggleLanguage(language)} style={{
                    padding: '8px 14px', borderRadius: '999px', border: '1px solid',
                    borderColor: form.languages.includes(language) ? '#1D5F8A' : '#E8EDF4',
                    background: form.languages.includes(language) ? 'rgba(29,95,138,0.1)' : '#fff',
                    color: form.languages.includes(language) ? '#1D5F8A' : '#4A5568',
                    cursor: 'pointer', fontSize: '13px',
                  }}>
                    {language}
                  </button>
                ))}
              </div>
              {errors.languages && <div style={{ color: '#E74C3C', fontSize: '12px' }}>{lang === 'he' ? 'בחר לפחות שפה אחת' : 'Choose at least one language'}</div>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{lang === 'he' ? 'תיאור הנכס' : 'Property description'}</label>
              <textarea className="input-field" rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              {errors.description && <div style={{ color: '#E74C3C', fontSize: '12px' }}>{lang === 'he' ? 'שדה חובה' : 'Required field'}</div>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{lang === 'he' ? 'טלפון להגעה' : 'Contact phone'}</label>
                <input className="input-field" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{lang === 'he' ? 'אימייל' : 'Email'}</label>
                <input className="input-field" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              </div>
            </div>

            <button className="btn-primary" style={{ padding: '16px 24px', marginTop: '10px' }} onClick={handleSubmit}>
              {t('submitProperty')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
