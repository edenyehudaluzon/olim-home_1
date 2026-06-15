import React, { useState } from 'react';
import { LANGUAGES, COUNTRIES, COUNTRY_MAP } from './data';

export default function RegisterPage({ onNavigate, onRegister, t, lang }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: '', birthDate: '', country: '', role: 'tenant',
    languages: [], phone: '', email: '', photo: null, certificate: null,
  });
  const [errors, setErrors] = useState({});

  const label = (he, en) => (lang === 'he' ? he : en);

  const toggleLanguage = (language) => {
    setForm(f => ({
      ...f,
      languages: f.languages.includes(language)
        ? f.languages.filter(l => l !== language)
        : [...f.languages, language],
    }));
  };

  const validate1 = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = label('שדה חובה', 'Required');
    if (!form.birthDate) e.birthDate = label('שדה חובה', 'Required');
    if (!form.country) e.country = label('שדה חובה', 'Required');
    if (!form.phone.trim()) e.phone = label('שדה חובה', 'Required');
    if (!form.email.trim()) e.email = label('שדה חובה', 'Required');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validate2 = () => {
    const e = {};
    if (form.languages.length === 0) e.languages = label('בחר לפחות שפה אחת', 'Choose at least one language');
    if (!form.certificate) e.certificate = label('נדרש אישור זכאות', 'Certificate required');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validate1()) setStep(2);
    else if (step === 2 && validate2()) setStep(3);
  };

  const handleFinish = () => {
    onRegister(form);
  };

  const inputStyle = (field) => ({
    borderColor: errors[field] ? '#E74C3C' : undefined,
  });

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: '540px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '30px', color: '#0F1B2D', marginBottom: '8px' }}>{label('הצטרף לפלטפורמה', 'Join the platform')}</h1>
          <p style={{ color: '#8A9BB0' }}>{label('ההרשמה לוקחת פחות מ-3 דקות', 'Registration takes less than 3 minutes')}</p>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', gap: '8px' }}>
          {[1, 2, 3].map((s, i) => (
            <React.Fragment key={s}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step >= s ? '#1D5F8A' : '#E8EDF4',
                color: step >= s ? '#fff' : '#8A9BB0',
                fontWeight: '600', fontSize: '14px', flexShrink: 0, transition: 'all 0.3s',
              }}>{step > s ? '✓' : s}</div>
              {i < 2 && <div style={{ flex: 1, height: '2px', background: step > s ? '#1D5F8A' : '#E8EDF4', transition: 'background 0.3s' }} />}
            </React.Fragment>
          ))}
        </div>

        <div className="card" style={{ padding: '40px' }}>
          {step === 1 && (
            <div className="animate-fadeUp">
              <h2 style={{ fontSize: '20px', marginBottom: '28px', color: '#0F1B2D' }}>{label('פרטים אישיים', 'Personal details')}</h2>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px', color: '#0F1B2D' }}>{label('שם מלא *', 'Full name *')}</label>
                <input className="input-field" style={inputStyle('fullName')} placeholder={label('הכנס שם מלא', 'Enter full name')} value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
                {errors.fullName && <div style={{ color: '#E74C3C', fontSize: '12px', marginTop: '4px' }}>{errors.fullName}</div>}
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px', color: '#0F1B2D' }}>{label('תאריך לידה *', 'Birth date *')}</label>
                <input className="input-field" style={inputStyle('birthDate')} type="date" value={form.birthDate} onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))} />
                {errors.birthDate && <div style={{ color: '#E74C3C', fontSize: '12px', marginTop: '4px' }}>{errors.birthDate}</div>}
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px', color: '#0F1B2D' }}>{label('ארץ מוצא *', 'Country of origin *')}</label>
                <select className="input-field" style={inputStyle('country')} value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}>
                  <option value="">{label('בחר ארץ', 'Select country')}</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{lang === 'en' ? (COUNTRY_MAP[c] || c) : c}</option>)}
                </select>
                {errors.country && <div style={{ color: '#E74C3C', fontSize: '12px', marginTop: '4px' }}>{errors.country}</div>}
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px', color: '#0F1B2D' }}>{label('סוג משתמש *', 'User type *')}</label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {['tenant', 'landlord'].map(r => (
                    <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1, padding: '12px', borderRadius: '10px', border: `2px solid ${form.role === r ? '#1D5F8A' : '#E8EDF4'}`, background: form.role === r ? 'rgba(29,95,138,0.06)' : '#fff' }}>
                      <input type="radio" name="role" value={r} checked={form.role === r} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
                      <span style={{ color: form.role === r ? '#1D5F8A' : '#4A5568', fontWeight: form.role === r ? '600' : '400' }}>
                        {r === 'tenant' ? label('דייר', 'Tenant') : label('בעל דירה', 'Landlord')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px', color: '#0F1B2D' }}>{label('טלפון *', 'Phone *')}</label>
                  <input className="input-field" style={inputStyle('phone')} placeholder="+972..." value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  {errors.phone && <div style={{ color: '#E74C3C', fontSize: '12px', marginTop: '4px' }}>{errors.phone}</div>}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px', color: '#0F1B2D' }}>{label('אימייל *', 'Email *')}</label>
                  <input className="input-field" style={inputStyle('email')} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  {errors.email && <div style={{ color: '#E74C3C', fontSize: '12px', marginTop: '4px' }}>{errors.email}</div>}
                </div>
              </div>

              <button className="btn-primary" style={{ width: '100%' }} onClick={handleNext}>
                {label('המשך ←', 'Continue →')}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fadeUp">
              <h2 style={{ fontSize: '20px', marginBottom: '8px', color: '#0F1B2D' }}>{label('שפות ומסמכים', 'Languages & documents')}</h2>
              <p style={{ color: '#8A9BB0', fontSize: '14px', marginBottom: '28px' }}>{label('המידע הזה יעזור לנו למצוא בעלי דירות שמדברים אליך', 'This helps us find landlords who speak your language')}</p>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500', fontSize: '14px', color: '#0F1B2D' }}>{label('שפות מדוברות *', 'Spoken languages *')}</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {LANGUAGES.map(language => (
                    <button key={language} onClick={() => toggleLanguage(language)} type="button" style={{
                      padding: '8px 18px', borderRadius: '50px', border: '2px solid',
                      borderColor: form.languages.includes(language) ? '#1D5F8A' : '#E8EDF4',
                      background: form.languages.includes(language) ? 'rgba(29,95,138,0.1)' : '#fff',
                      color: form.languages.includes(language) ? '#1D5F8A' : '#8A9BB0',
                      fontWeight: form.languages.includes(language) ? '600' : '400',
                      cursor: 'pointer', fontSize: '14px', fontFamily: "'Heebo', sans-serif",
                    }}>{language}</button>
                  ))}
                </div>
                {errors.languages && <div style={{ color: '#E74C3C', fontSize: '12px', marginTop: '8px' }}>{errors.languages}</div>}
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500', fontSize: '14px', color: '#0F1B2D' }}>{label('אישור זכאות ממשרד הקליטה *', 'Absorption Ministry eligibility certificate *')}</label>
                <div style={{
                  border: '2px dashed', borderRadius: '12px', padding: '32px', textAlign: 'center', cursor: 'pointer',
                  borderColor: form.certificate ? '#27AE60' : errors.certificate ? '#E74C3C' : '#E8EDF4',
                  background: form.certificate ? 'rgba(39,174,96,0.05)' : '#fff',
                  transition: 'border-color 0.2s',
                }} onClick={() => setForm(f => ({ ...f, certificate: 'uploaded' }))}>
                  {form.certificate ? (
                    <div style={{ color: '#27AE60' }}>
                      <div style={{ fontSize: '32px' }}>✓</div>
                      <div style={{ fontWeight: '600', marginTop: '8px' }}>{label('המסמך הועלה', 'Document uploaded')}</div>
                    </div>
                  ) : (
                    <div style={{ color: '#8A9BB0' }}>
                      <div style={{ fontSize: '32px' }}>📄</div>
                      <div style={{ marginTop: '8px' }}>{label('לחץ להעלאת מסמך', 'Click to upload')}</div>
                      <div style={{ fontSize: '12px', marginTop: '4px' }}>PDF, JPG, PNG</div>
                    </div>
                  )}
                </div>
                {errors.certificate && <div style={{ color: '#E74C3C', fontSize: '12px', marginTop: '4px' }}>{errors.certificate}</div>}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{ flex: 1, padding: '14px', borderRadius: '50px', border: '2px solid #E8EDF4', background: '#fff', cursor: 'pointer', fontFamily: "'Heebo', sans-serif", fontWeight: '500' }} onClick={() => setStep(1)}>
                  {label('← חזור', '← Back')}
                </button>
                <button className="btn-primary" style={{ flex: 2 }} onClick={handleNext}>
                  {label('המשך ←', 'Continue →')}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fadeUp" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
              <h2 style={{ fontSize: '24px', marginBottom: '12px', color: '#0F1B2D' }}>
                {label('ברוך הבא,', 'Welcome,')} {form.fullName.split(' ')[0]}!
              </h2>
              <p style={{ color: '#8A9BB0', lineHeight: 1.7, marginBottom: '32px' }}>
                {label('הפרופיל שלך נוצר בהצלחה.', 'Your profile was created successfully.')}
                <br />
                {label('עכשיו אפשר להתחיל לחפש דירה בשפתך.', 'Now you can start searching for a home in your language.')}
              </p>

              <div style={{ background: 'rgba(39,174,96,0.08)', border: '1px solid rgba(39,174,96,0.2)', borderRadius: '12px', padding: '16px', marginBottom: '32px' }}>
                <div style={{ color: '#27AE60', fontWeight: '600', marginBottom: '4px' }}>✓ {label('הפרופיל אומת', 'Profile verified')}</div>
                <div style={{ color: '#8A9BB0', fontSize: '13px' }}>
                  {form.role === 'landlord'
                    ? label('עכשיו תוכל להוסיף נכס ולחשוף אותו לדיירים', 'Now you can add a property and show it to tenants')
                    : label('עכשיו תוכל להתחיל לחפש דירה מתאימה', 'Now you can start searching for a suitable home')}
                </div>
              </div>

              <button className="btn-primary" style={{ width: '100%', fontSize: '16px' }} onClick={handleFinish}>
                {form.role === 'landlord' ? label('הוסף נכס עכשיו ←', 'Add property now →') : label('התחל לחפש דירה ←', 'Start searching →')}
              </button>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#8A9BB0', fontSize: '14px' }}>
          {label('כבר רשום?', 'Already registered?')}{' '}
          <span style={{ color: '#1D5F8A', cursor: 'pointer', fontWeight: '600' }} onClick={() => onNavigate('search')}>
            {label('היכנס לחשבון', 'Sign in')}
          </span>
        </p>
      </div>
    </div>
  );
}
