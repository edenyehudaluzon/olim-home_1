import React, { useState } from 'react';
import './index.css';
import LandingPage from './LandingPage';
import RegisterPage from './RegisterPage';
import SearchPage from './SearchPage';
import PropertyPage from './PropertyPage';

const LANG_FLAGS = { 'עברית':'🇮🇱','אנגלית':'🇬🇧','רוסית':'🇷🇺','אוקראינית':'🇺🇦','ספרדית':'🇪🇸','צרפתית':'🇫🇷','אמהרית':'🇪🇹','ערבית':'🇸🇦' };

export default function App() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handleRegister = (formData) => setUser(formData);

  const navigate = (p) => setPage(p);

  return (
    <div>
      {/* ניווט */}
      <nav className="nav">
        <div className="nav-logo" onClick={() => navigate('landing')}>🏠 Olim Home</div>
        <div className="nav-links">
          <span className="nav-link" onClick={() => navigate('search')}>חיפוש דירות</span>
          {!user
            ? <>
                <span className="nav-link" onClick={() => navigate('register')}>הרשמה</span>
                <button className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }} onClick={() => navigate('register')}>כניסה</button>
              </>
            : <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {user.languages?.slice(0,2).map(l => <span key={l} style={{ fontSize: '18px' }}>{LANG_FLAGS[l]}</span>)}
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #C9A84C, #F0C96B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F1B2D', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                  {user.fullName?.charAt(0) || 'U'}
                </div>
              </div>
          }
        </div>
      </nav>

      {/* דפים */}
      {page === 'landing' && <LandingPage onNavigate={navigate} />}
      {page === 'register' && <RegisterPage onNavigate={navigate} onRegister={handleRegister} />}
      {page === 'search' && <SearchPage onNavigate={navigate} onSelectProperty={setSelectedProperty} user={user} />}
      {page === 'property' && <PropertyPage property={selectedProperty} onNavigate={navigate} user={user} />}
    </div>
  );
}
