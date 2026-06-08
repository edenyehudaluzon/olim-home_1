import React, { useState } from 'react';
import { LANGUAGES, COUNTRIES } from './data';

export default function RegisterPage({ onNavigate, onRegister }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: '', birthDate: '', country: '', languages: [], phone: '', photo: null, certificate: null,
  });
  const [errors, setErrors] = useState({});

  const toggleLanguage = (lang) => {
    setForm(f => ({
      ...f,
      languages: f.languages.includes(lang)
        ? f.languages.filter(l => l !== lang)
        : [...f.languages, lang]
    }));
  };

  const validate1 = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'שדה חובה';
    if (!form.birthDate) e.birthDate = 'שדה חובה';
    if (!form.country) e.country = 'שדה חובה';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validate2 = () => {
    const e = {};
    if (form.languages.length === 0) e.languages = 'בחר לפחות שפה אחת';
    if (!form.certificate) e.certificate = 'נדרש אישור זכאות';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validate1()) setStep(2);
    else if (step === 2 && validate2()) setStep(3);
  };

  const handleFinish = () => {
    onRegister(form);
    onNavigate('search');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: '540px' }}>

        {/* כותרת */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', color: '#0F1B2D', marginBottom: '8px' }}>הצטרף לפלטפורמה</h1>
          <p style={{ color: '#8A9BB0' }}>ההרשמה לוקחת פחות מ-3 דקות</p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', gap: '8px' }}>
          {[1,2,3].map((s, i) => (
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
              <h2 style={{ fontSize: '20px', marginBottom: '28px', color: '#0F1B2D' }}>פרטים אישיים</h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#0F1B2D' }}>שם מלא *</label>
                <input className="input-field" placeholder="הכנס שם מלא" value={form.fullName}
                  onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
                {errors.fullName && <div style={{ color: '#E74C3C', fontSize: '12px', marginTop: '4px' }}>{errors.fullName}</div>}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#0F1B2D' }}>תאריך לידה *</label>
                <input className="input-field" type="date" value={form.birthDate}
                  onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))} />
                {errors.birthDate && <div style={{ color: '#E74C3C', fontSize: '12px', marginTop: '4px' }}>{errors.birthDate}</div>}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#0F1B2D' }}>ארץ מוצא *</label>
                <select className="input-field" value={form.country}
                  onChange={e => setForm(f => ({ ...f, country: e.target.value }))}>
                  <option value="">בחר ארץ</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.country && <div style={{ color: '#E74C3C', fontSize: '12px', marginTop: '4px' }}>{errors.country}</div>}
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#0F1B2D' }}>מספר טלפון (אופציונלי)</label>
                <input className="input-field" placeholder="+972..." value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>

              <button className="btn-primary" style={{ width: '100%' }} onClick={handleNext}>המשך ←</button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fadeUp">
              <h2 style={{ fontSize: '20px', marginBottom: '8px', color: '#0F1B2D' }}>שפות ומסמכים</h2>
              <p style={{ color: '#8A9BB0', fontSize: '14px', marginBottom: '28px' }}>המידע הזה יעזור לנו למצוא בעלי דירות שמדברים אליך</p>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500', fontSize: '14px', color: '#0F1B2D' }}>שפות מדוברות *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {LANGUAGES.map(lang => (
                    <button key={lang} onClick={() => toggleLanguage(lang)} style={{
                      padding: '8px 18px', borderRadius: '50px', border: '2px solid',
                      borderColor: form.languages.includes(lang) ? '#1D5F8A' : '#E8EDF4',
                      background: form.languages.includes(lang) ? 'rgba(29,95,138,0.1)' : '#fff',
                      color: form.languages.includes(lang) ? '#1D5F8A' : '#8A9BB0',
                      fontWeight: form.languages.includes(lang) ? '600' : '400',
                      cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s',
                    }}>{lang}</button>
                  ))}
                </div>
                {errors.languages && <div style={{ color: '#E74C3C', fontSize: '12px', marginTop: '8px' }}>{errors.languages}</div>}
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500', fontSize: '14px', color: '#0F1B2D' }}>אישור זכאות ממשרד הקליטה *</label>
                <div style={{
                  border: '2px dashed #E8EDF4', borderRadius: '12px', padding: '32px',
                  textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s',
                  borderColor: form.certificate ? '#27AE60' : errors.certificate ? '#E74C3C' : '#E8EDF4',
                  background: form.certificate ? 'rgba(39,174,96,0.05)' : '#fff',
                }}
                  onClick={() => setForm(f => ({ ...f, certificate: 'uploaded' }))}>
                  {form.certificate
                    ? <div style={{ color: '#27AE60' }}><div style={{ fontSize: '32px' }}>✓</div><div style={{ fontWeight: '600', marginTop: '8px' }}>המסמך הועלה בהצלחה</div></div>
                    : <div style={{ color: '#8A9BB0' }}><div style={{ fontSize: '32px' }}>📄</div><div style={{ marginTop: '8px' }}>לחץ להעלאת מסמך</div><div style={{ fontSize: '12px', marginTop: '4px' }}>PDF, JPG, PNG</div></div>
                  }
                </div>
                {errors.certificate && <div style={{ color: '#E74C3C', fontSize: '12px', marginTop: '4px' }}>{errors.certificate}</div>}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{ flex: 1, padding: '14px', borderRadius: '50px', border: '2px solid #E8EDF4', background: '#fff', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: '500' }}
                  onClick={() => setStep(1)}>← חזור</button>
                <button className="btn-primary" style={{ flex: 2 }} onClick={handleNext}>המשך ←</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fadeUp" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
              <h2 style={{ fontSize: '24px', marginBottom: '12px', color: '#0F1B2D' }}>ברוך הבא, {form.fullName.split(' ')[0]}!</h2>
              <p style={{ color: '#8A9BB0', lineHeight: 1.7, marginBottom: '32px' }}>
                הפרופיל שלך נוצר בהצלחה.
                <br />עכשיו אפשר להתחיל לחפש דירה בשפתך.
              </p>

              <div style={{ background: 'rgba(39,174,96,0.08)', border: '1px solid rgba(39,174,96,0.2)', borderRadius: '12px', padding: '16px', marginBottom: '32px' }}>
                <div style={{ color: '#27AE60', fontWeight: '600', marginBottom: '4px' }}>✓ הפרופיל אומת</div>
                <div style={{ color: '#8A9BB0', fontSize: '13px' }}>בעלי הדירות יוכלו לראות שאתה לקוח מוכר של משרד הקליטה</div>
              </div>

              <button className="btn-primary" style={{ width: '100%', fontSize: '16px' }} onClick={handleFinish}>
                התחל לחפש דירה ←
              </button>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#8A9BB0', fontSize: '14px' }}>
          כבר רשום?{' '}
          <span style={{ color: '#1D5F8A', cursor: 'pointer', fontWeight: '600' }} onClick={() => onNavigate('search')}>
            היכנס לחשבון
          </span>
        </p>
      </div>
    </div>
  );
}
