import React, { useEffect, useState } from 'react';

const STATS = [
  { num: '12,000+', label: 'עולים מצאו דירה' },
  { num: '6', label: 'שפות נתמכות' },
  { num: '98%', label: 'שביעות רצון' },
];

const TESTIMONIALS = [
  { name: 'Katya M.', origin: 'אוקראינה', text: 'מצאתי דירה לפני שנחתתי. לא האמנתי שזה אפשרי.', avatar: 'https://i.pravatar.cc/60?img=47' },
  { name: 'Pierre D.', origin: 'צרפת', text: 'בעל הדירה דיבר איתי צרפתית — הרגשתי בבית מהרגע הראשון.', avatar: 'https://i.pravatar.cc/60?img=12' },
  { name: 'Yosef A.', origin: 'אתיופיה', text: 'בלי משפחה, בלי תרגום — עשיתי הכל לבד לראשונה.', avatar: 'https://i.pravatar.cc/60?img=68' },
];

export default function LandingPage({ onNavigate }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(145deg, #0F1B2D 0%, #1A2E45 50%, #1D5F8A 100%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* רקע דקורטיבי */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '500px', height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-80px',
          width: '400px', height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(29,95,138,0.3) 0%, transparent 70%)',
        }} />

        <div style={{ textAlign: 'center', maxWidth: '700px', position: 'relative', zIndex: 1 }}>
          {/* תג */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '50px', padding: '8px 20px', marginBottom: '32px',
            opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#C9A84C', display: 'inline-block' }} />
            <span style={{ color: '#F0C96B', fontSize: '14px', fontWeight: '500' }}>הפלטפורמה הרשמית של משרד העלייה והקליטה</span>
          </div>

          {/* כותרת */}
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(36px, 6vw, 64px)',
            color: '#FFFFFF',
            lineHeight: 1.2,
            marginBottom: '24px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease 0.2s',
          }}>
            בית חם מחכה לך
            <br />
            <span style={{ color: '#C9A84C' }}>עוד לפני שנחתת</span>
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: '18px',
            lineHeight: 1.7,
            marginBottom: '48px',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease 0.4s',
          }}>
            מצא דירה בשפת האם שלך, עם בעל בית שמבין אותך,
            <br />בתקציב שמשרד הקליטה אישר — בביטחון מלא.
          </p>

          <div style={{
            display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap',
            opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.6s',
          }}>
            <button className="btn-primary" style={{ fontSize: '17px', padding: '16px 40px' }}
              onClick={() => onNavigate('register')}>
              מצא דירה עכשיו ←
            </button>
            <button className="btn-secondary" onClick={() => onNavigate('search')}>
              עיין בנכסים
            </button>
          </div>

          {/* סטטיסטיקות */}
          <div style={{
            display: 'flex', gap: '48px', justifyContent: 'center', marginTop: '72px',
            flexWrap: 'wrap',
            opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.8s',
          }}>
            {STATS.map(s => (
              <div key={s.num} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', color: '#C9A84C', fontWeight: '700' }}>{s.num}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* גל תחתון */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 80" style={{ display: 'block', fill: '#FAF7F2' }}>
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </div>

      {/* המלצות */}
      <div style={{ padding: '80px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '12px', color: '#0F1B2D' }}>
          הם כבר מצאו את הבית שלהם
        </h2>
        <p style={{ textAlign: 'center', color: '#8A9BB0', marginBottom: '48px' }}>
          עולים שהשתמשו בפלטפורמה שלנו
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                <img src={t.avatar} alt={t.name} style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                <div>
                  <div style={{ fontWeight: '600', color: '#0F1B2D' }}>{t.name}</div>
                  <div style={{ fontSize: '13px', color: '#8A9BB0' }}>עלה מ{t.origin}</div>
                </div>
              </div>
              <div style={{ color: '#2E4057', fontSize: '15px', lineHeight: 1.6, fontStyle: 'italic' }}>"{t.text}"</div>
              <div style={{ marginTop: '16px', display: 'flex', gap: '2px' }}>
                {[1,2,3,4,5].map(s => <span key={s} style={{ color: '#C9A84C', fontSize: '16px' }}>★</span>)}
              </div>
            </div>
          ))}
        </div>

        {/* CTA תחתי */}
        <div style={{
          marginTop: '72px', textAlign: 'center',
          background: 'linear-gradient(135deg, #0F1B2D, #1D5F8A)',
          borderRadius: '24px', padding: '56px 40px',
        }}>
          <h2 style={{ color: '#FFFFFF', fontSize: '28px', marginBottom: '12px' }}>
            מוכן להתחיל?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px', fontSize: '16px' }}>
            ההרשמה חינמית. מצא דירה בשפתך בדקות.
          </p>
          <button className="btn-primary" style={{ fontSize: '16px' }} onClick={() => onNavigate('register')}>
            הירשם עכשיו — בחינם
          </button>
        </div>
      </div>
    </div>
  );
}
