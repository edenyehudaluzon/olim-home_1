import React, { useState } from 'react';
import { LANGUAGES, COUNTRIES } from './data';

export default function RegisterPage({ onNavigate, onRegister, t, lang }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: '', birthDate: '', country: '', role: 'tenant', languages: [], phone: '', photo: null, certificate: null,
  });
  const [errors, setErrors] = useState({});

  const label = (he, en) => (lang === 'he' ? he : en);

  const toggleLanguage = (language) => {
    setForm((f) => ({
      ...f,
      languages: f.languages.includes(language)
        ? f.languages.filter((l) => l !== language)
        : [...f.languages, language],
    }));
  };

  const validate1 = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = label('שדה חובה', 'Required field');
    if (!form.birthDate) e.birthDate = label('שדה חובה', 'Required field');
    if (!form.country) e.country = label('שדה חובה', 'Required field');
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
    onNavigate(form.role === 'landlord' ? 'addProperty' : 'search');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: '540px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', color: '#0F1B2D', marginBottom: '8px' }}>{label('הצטרף לפלטפורמה', 'Join the platform')}</h1>
          <p style={{ color: '#8A9BB0' }}>{label('ההרשמה לוקחת פחות מ-3 דקות', 'Registration takes less than 3 minutes')}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', gap: '8px' }}>
          {[1, 2, 3].map((s, i) => (
            <React.Fragment key={s}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#0F1B2D' }}>{label('שם מלא *', 'Full name *')}</label>
                <input className="input-field" placeholder={label('הכנס שם מלא', 'Enter full name')} value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
                {errors.fullName && <div style={{ color: '#E74C3C', fontSize: '12px', marginTop: '4px' }}>{errors.fullName}</div>}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#0F1B2D' }}>{label('תאריך לידה *', 'Birth date *')}</label>
                <input className="input-field" type="date" value={form.birthDate} onChange={(e) => setForm((f) => ({ ...f, birthDate: e.target.value }))} />
                {errors.birthDate && <div style={{ color: '#E74C3C', fontSize: '12px', marginTop: '4px' }}>{errors.birthDate}</div>}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#0F1B2D' }}>{label('ארץ מוצא *', 'Country of origin *')}</label>
                <select className="input-field" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}>
                  <option value="">{label('בחר ארץ', 'Select country')}</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.country && <div style={{ color: '#E74C3C', fontSize: '12px', marginTop: '4px' }}>{errors.country}</div>}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#0F1B2D' }}>{label('סוג משתמש *', 'User type *')}</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="radio" name="role" value="tenant" checked={form.role === 'tenant'} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} />
                    {label('דייר', 'Tenant')}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="radio" name="role" value="landlord" checked={form.role === 'landlord'} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} />
                    {label('בעל דירה', 'Landlord')}
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#0F1B2D' }}>{label('מספר טלפון (אופציונלי)', 'Phone number (optional)')}</label>
                <input className="input-field" placeholder="+972..." value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              </div>

              <button className="btn-primary" style={{ width: '100%' }} onClick={handleNext}>
                {label('המשך ←', 'Continue ←')}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fadeUp">
              <h2 style={{ fontSize: '20px', marginBottom: '8px', color: '#0F1B2D' }}>{label('שפות ומסמכים', 'Languages & documents')}</h2>
              <p style={{ color: '#8A9BB0', fontSize: '14px', marginBottom: '28px' }}>{label('המידע הזה יעזור לנו למצוא בעלי דירות שמדברים אליך', 'This information helps us find landlords who speak your language')}</p>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500', fontSize: '14px', color: '#0F1B2D' }}>{label('שפות מדוברות *', 'Spoken languages *')}</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {LANGUAGES.map((language) => (
                    <button key={language} onClick={() => toggleLanguage(language)} style={{
                      padding: '8px 18px', borderRadius: '50px', border: '2px solid',
                      borderColor: form.languages.includes(language) ? '#1D5F8A' : '#E8EDF4',
                      background: form.languages.includes(language) ? 'rgba(29,95,138,0.1)' : '#fff',
                      color: form.languages.includes(language) ? '#1D5F8A' : '#8A9BB0',
                      fontWeight: form.languages.includes(language) ? '600' : '400',
                      cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s',
                    }}>{language}</button>
                  ))}
                </div>
                {errors.languages && <div style={{ color: '#E74C3C', fontSize: '12px', marginTop: '8px' }}>{errors.languages}</div>}
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500', fontSize: '14px', color: '#0F1B2D' }}>{label('אישור זכאות ממשרד הקליטה *', 'Absorption Ministry eligibility certificate *')}</label>
                <div style={{
                  border: '2px dashed #E8EDF4', borderRadius: '12px', padding: '32px',
                  textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s',
                  borderColor: form.certificate ? '#27AE60' : errors.certificate ? '#E74C3C' : '#E8EDF4',
                  background: form.certificate ? 'rgba(39,174,96,0.05)' : '#fff',
                }} onClick={() => setForm((f) => ({ ...f, certificate: 'uploaded' }))}>
                  {form.certificate ? (
                    <div style={{ color: '#27AE60' }}>
                      <div style={{ fontSize: '32px' }}>✓</div>
                      <div style={{ fontWeight: '600', marginTop: '8px' }}>{label('המסמך הועלה בהצלחה', 'Document uploaded successfully')}</div>
                    </div>
                  ) : (
                    <div style={{ color: '#8A9BB0' }}>
                      <div style={{ fontSize: '32px' }}>📄</div>
                      <div style={{ marginTop: '8px' }}>{label('לחץ להעלאת מסמך', 'Click to upload document')}</div>
                      <div style={{ fontSize: '12px', marginTop: '4px' }}>PDF, JPG, PNG</div>
                    </div>
                  )}
                </div>
                {errors.certificate && <div style={{ color: '#E74C3C', fontSize: '12px', marginTop: '4px' }}>{errors.certificate}</div>}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{ flex: 1, padding: '14px', borderRadius: '50px', border: '2px solid #E8EDF4', background: '#fff', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: '500' }} onClick={() => setStep(1)}>
                  {label('← חזור', '← Back')}
                </button>
                <button className="btn-primary" style={{ flex: 2 }} onClick={handleNext}>
                  {label('המשך ←', 'Continue ←')}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fadeUp" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
              <h2 style={{ fontSize: '24px', marginBottom: '12px', color: '#0F1B2D' }}>{label('ברוך הבא,', 'Welcome,')} {form.fullName.split(' ')[0]}!</h2>
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
                {form.role === 'landlord' ? label('הוסף נכס עכשיו ←', 'Add property now ←') : label('התחל לחפש דירה ←', 'Start searching for a home ←')}
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
