import React, { useEffect, useState } from 'react';

const LANGS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'he', label: 'עברית', flag: '🇮🇱' },
];

const TESTIMONIALS = [
  { name: 'Katya M.', originHe: 'אוקראינה', originEn: 'Ukraine', textHe: 'מצאתי דירה לפני שנחתתי. לא האמנתי שזה אפשרי.', textEn: "I found a home before I landed. I couldn't believe it was possible.", avatar: 'https://i.pravatar.cc/60?img=47' },
  { name: 'Pierre D.', originHe: 'צרפת', originEn: 'France', textHe: 'בעל הדירה דיבר איתי צרפתית — הרגשתי בבית מהרגע הראשון.', textEn: 'The landlord spoke French with me — I felt at home from the first moment.', avatar: 'https://i.pravatar.cc/60?img=12' },
  { name: 'Yosef A.', originHe: 'אתיופיה', originEn: 'Ethiopia', textHe: 'בלי משפחה, בלי תרגום — עשיתי הכל לבד לראשונה.', textEn: 'Without family or translation, I did everything myself for the first time.', avatar: 'https://i.pravatar.cc/60?img=68' },
];

export default function LandingPage({ onNavigate, t, lang, contractsCount, onSetLang }) {
  const [visible, setVisible] = useState(false);
  const [displayCount, setDisplayCount] = useState(contractsCount);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  // Animate counter on mount
  useEffect(() => {
    const target = contractsCount;
    const start = Math.max(0, target - 30);
    let current = start;
    setDisplayCount(start);
    const interval = setInterval(() => {
      current += 1;
      setDisplayCount(current);
      if (current >= target) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [contractsCount]);

  const label = (he, en) => lang === 'he' ? he : en;

  const STATS = [
    { num: '12,000+', he: 'עולים מצאו דירה', en: 'Newcomers found homes' },
    { num: displayCount.toLocaleString(), he: 'חוזים שנסגרו באתר', en: 'Contracts signed on site', live: true },
    { num: '98%', he: 'שביעות רצון', en: 'Satisfaction rate' },
    { num: '6', he: 'שפות נתמכות', en: 'Supported languages' },
  ];

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
        {/* decorative blobs */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(29,95,138,0.3) 0%, transparent 70%)' }} />

        {/* Language picker before login */}
        <div style={{
          position: 'absolute', top: '24px', [lang === 'he' ? 'left' : 'right']: '24px',
          display: 'flex', gap: '8px',
          opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease',
        }}>
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => onSetLang(l.code)}
              style={{
                background: lang === l.code ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.08)',
                border: `1px solid ${lang === l.code ? 'rgba(201,168,76,0.6)' : 'rgba(255,255,255,0.2)'}`,
                color: lang === l.code ? '#F0C96B' : 'rgba(255,255,255,0.7)',
                borderRadius: '8px', padding: '6px 14px', cursor: 'pointer',
                fontSize: '13px', fontFamily: "'Heebo', sans-serif", fontWeight: '500',
                transition: 'all 0.2s',
              }}
            >
              {l.flag} {l.label}
            </button>
          ))}
        </div>

        <div style={{ textAlign: 'center', maxWidth: '720px', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '50px', padding: '8px 20px', marginBottom: '32px',
            opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#C9A84C', display: 'inline-block' }} />
            <span style={{ color: '#F0C96B', fontSize: '14px', fontWeight: '500' }}>
              {label('הפלטפורמה הרשמית של משרד העלייה והקליטה', 'The official absorption ministry platform')}
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Frank Ruhl Libre', serif", fontWeight: '700',
            fontSize: 'clamp(36px, 6vw, 64px)',
            color: '#FFFFFF', lineHeight: 1.15, marginBottom: '24px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease 0.2s',
          }}>
            {label('בית חם מחכה לך', 'A warm home is waiting for you')}
            <br />
            <span style={{ color: '#C9A84C' }}>{label('עוד לפני שנחתת', 'Even before you land')}</span>
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.75)', fontSize: '18px', lineHeight: 1.7, marginBottom: '48px',
            opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.4s',
          }}>
            {label(
              'מצא דירה בשפת האם שלך, עם בעל בית שמבין אותך,',
              'Find a home in your language, with a landlord who understands you,'
            )}
            <br />
            {label(
              'בתקציב שמשרד הקליטה אישר — בביטחון מלא.',
              'within the budget approved by the absorption ministry — with full confidence.'
            )}
          </p>

          <div style={{
            display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap',
            opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.6s',
          }}>
            <button className="btn-primary" style={{ fontSize: '17px', padding: '16px 40px' }} onClick={() => onNavigate('register')}>
              {label('מצא דירה עכשיו ←', 'Find a home now →')}
            </button>
            <button className="btn-secondary" onClick={() => onNavigate('search')}>
              {label('עיין בנכסים', 'Browse listings')}
            </button>
          </div>

          {/* Live stats */}
          <div style={{
            display: 'flex', gap: '32px', justifyContent: 'center', marginTop: '72px', flexWrap: 'wrap',
            opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.8s',
          }}>
            {STATS.map((s) => (
              <div key={s.en} style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: '34px', color: '#C9A84C', fontWeight: '700' }}>{s.num}</div>
                  {s.live && (
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27AE60', display: 'inline-block', boxShadow: '0 0 8px #27AE60' }} title="Live" />
                  )}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '4px' }}>{label(s.he, s.en)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom wave */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 80" style={{ display: 'block', fill: '#FAF7F2' }}>
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ padding: '80px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '12px', color: '#0F1B2D' }}>
          {label('הם כבר מצאו את הבית שלהם', 'They already found their home')}
        </h2>
        <p style={{ textAlign: 'center', color: '#8A9BB0', marginBottom: '48px' }}>
          {label('עולים שהשתמשו בפלטפורמה שלנו', 'Newcomers who used our platform')}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {TESTIMONIALS.map((item, i) => (
            <div key={i} className="card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                <img src={item.avatar} alt={item.name} style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                <div>
                  <div style={{ fontWeight: '600', color: '#0F1B2D' }}>{item.name}</div>
                  <div style={{ fontSize: '13px', color: '#8A9BB0' }}>{label(`עלה מ${item.originHe}`, `From ${item.originEn}`)}</div>
                </div>
              </div>
              <div style={{ color: '#2E4057', fontSize: '15px', lineHeight: 1.6, fontStyle: 'italic' }}>
                {'"' + (label(item.textHe, item.textEn)) + '"'}
              </div>
              <div style={{ marginTop: '16px', display: 'flex', gap: '2px' }}>
                {[1,2,3,4,5].map(s => <span key={s} style={{ color: '#C9A84C', fontSize: '16px' }}>★</span>)}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: '72px', textAlign: 'center',
          background: 'linear-gradient(135deg, #0F1B2D, #1D5F8A)',
          borderRadius: '24px', padding: '56px 40px',
        }}>
          <h2 style={{ color: '#FFFFFF', fontSize: '28px', marginBottom: '12px' }}>
            {label('מוכן להתחיל?', 'Ready to get started?')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px', fontSize: '16px' }}>
            {label('הרשמה חינמית. מצא דירה בשפתך בדקות.', 'Sign up is free. Find a home in your language in minutes.')}
          </p>
          <button className="btn-primary" style={{ fontSize: '16px' }} onClick={() => onNavigate('register')}>
            {label('הירשם עכשיו — בחינם', 'Register now — free')}
          </button>
        </div>
      </div>
    </div>
  );
}
