import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import LandingPage from './LandingPage';
import RegisterPage from './RegisterPage';
import SearchPage from './SearchPage';
import PropertyPage from './PropertyPage';
import AddPropertyPage from './AddPropertyPage';
import ProfilePage from './ProfilePage';
import { properties as defaultProperties } from './data';

const LANGS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'he', label: 'עברית', flag: '🇮🇱' },
];

const translations = {
  he: {
    searchProperties: 'חיפוש דירות',
    addProperty: 'הוסף דירה',
    register: 'הרשמה',
    login: 'כניסה',
    logout: 'התנתק',
    landlord: 'בעל דירה',
    tenant: 'דייר',
    welcome: 'ברוך הבא ל-Olim Home',
    language: 'שפה',
    addNewProperty: 'הוספת נכס חדש',
    backToSearch: 'חזור לחיפוש',
    submitProperty: 'פרסם נכס',
    noPropertySelected: 'לא נבחר נכס',
    myProfile: 'הפרופיל שלי',
    savedProperties: 'דירות שמורות',
    contractsClosed: 'חוזים שנסגרו',
    available: 'זמין',
    unavailable: 'לא זמין',
    chat: "צ'אט",
    signContract: 'סגור חוזה',
    editProfile: 'ערוך פרופיל',
    tabuDocument: 'מסמך טאבו',
    uploadImage: 'העלה תמונה',
    notifications: 'התראות',
    propertyAvailableAgain: 'דירה שמורה פנויה שוב',
  },
  en: {
    searchProperties: 'Search Listings',
    addProperty: 'Add Property',
    register: 'Register',
    login: 'Login',
    logout: 'Logout',
    landlord: 'Landlord',
    tenant: 'Tenant',
    welcome: 'Welcome to Olim Home',
    language: 'Language',
    addNewProperty: 'Add New Property',
    backToSearch: 'Back to search',
    submitProperty: 'Publish Property',
    noPropertySelected: 'No property selected',
    myProfile: 'My Profile',
    savedProperties: 'Saved Properties',
    contractsClosed: 'Contracts Closed',
    available: 'Available',
    unavailable: 'Unavailable',
    chat: 'Chat',
    signContract: 'Sign Contract',
    editProfile: 'Edit Profile',
    tabuDocument: 'Tabu Document',
    uploadImage: 'Upload Image',
    notifications: 'Notifications',
    propertyAvailableAgain: 'A saved property is available again',
  },
};

export default function App() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem('user');
    return s && s !== 'null' ? JSON.parse(s) : null;
  });
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [properties, setProperties] = useState(() => {
    const s = localStorage.getItem('properties');
    if (s) {
      return JSON.parse(s).map(p => ({ available: true, ...p }));
    }
    return defaultProperties;
  });
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');
  const [tenants, setTenants] = useState(() => {
    const s = localStorage.getItem('tenants');
    return s ? JSON.parse(s) : [];
  });
  const [savedIds, setSavedIds] = useState(() => {
    const s = localStorage.getItem('savedIds');
    return s ? JSON.parse(s) : [];
  });
  const [contractsCount, setContractsCount] = useState(() => {
    const c = localStorage.getItem('contractsCount');
    return c ? parseInt(c, 10) : 847;
  });
  const [contractStatuses, setContractStatuses] = useState(() => {
    const s = localStorage.getItem('contractStatuses');
    return s ? JSON.parse(s) : {};
  });
  const [notifications, setNotifications] = useState([]);
  const prevPropertiesRef = useRef(null);

  const selectedProperty = properties.find(p => p.id === selectedPropertyId) || null;

  useEffect(() => { localStorage.setItem('properties', JSON.stringify(properties)); }, [properties]);
  useEffect(() => { localStorage.setItem('user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('tenants', JSON.stringify(tenants)); }, [tenants]);
  useEffect(() => { localStorage.setItem('lang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('savedIds', JSON.stringify(savedIds)); }, [savedIds]);
  useEffect(() => { localStorage.setItem('contractsCount', String(contractsCount)); }, [contractsCount]);
  useEffect(() => { localStorage.setItem('contractStatuses', JSON.stringify(contractStatuses)); }, [contractStatuses]);

  // Notify user if a saved property becomes available again
  useEffect(() => {
    if (prevPropertiesRef.current && user) {
      properties.forEach(p => {
        if (!savedIds.includes(p.id)) return;
        const prev = prevPropertiesRef.current.find(pp => pp.id === p.id);
        if (prev && !prev.available && p.available) {
          const msg = lang === 'he'
            ? `הדירה "${p.title}" פנויה שוב!`
            : `Property "${p.title}" is available again!`;
          setNotifications(n => [...n, { id: Date.now() + Math.random(), message: msg }]);
        }
      });
    }
    prevPropertiesRef.current = properties;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties]);

  const t = (key) => translations[lang][key] || key;

  const handleRegister = (formData) => {
    setUser(formData);
    setPage(formData.role === 'landlord' ? 'addProperty' : 'search');
  };

  const handleLogout = () => {
    setUser(null);
    setPage('landing');
  };

  const handleAddProperty = (property) => {
    setProperties(prev => [property, ...prev]);
    setPage('search');
  };

  const handleAddTenant = (tenant) => {
    setTenants(prev => [tenant, ...prev]);
  };

  const handleContractClose = (propertyId) => {
    setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, available: false } : p));
    setContractsCount(c => c + 1);
  };

  const handleToggleSaved = (propertyId) => {
    setSavedIds(prev =>
      prev.includes(propertyId) ? prev.filter(i => i !== propertyId) : [...prev, propertyId]
    );
  };

  const handleToggleAvailability = (propertyId, available) => {
    setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, available } : p));
  };

  const handleUpdateContractStatus = (propertyId, step) => {
    setContractStatuses(prev => ({ ...prev, [propertyId]: step }));
  };

  const dismissNotification = (id) => setNotifications(n => n.filter(x => x.id !== id));

  const navigate = (p) => setPage(p);
  const isLandlord = user?.role === 'landlord';

  return (
    <div dir={lang === 'he' ? 'rtl' : 'ltr'}>
      {/* Floating notifications */}
      {notifications.length > 0 && (
        <div style={{
          position: 'fixed',
          top: '80px',
          [lang === 'he' ? 'left' : 'right']: '20px',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {notifications.map(n => (
            <div key={n.id} style={{
              background: '#27AE60', color: '#fff', padding: '14px 20px',
              borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
              display: 'flex', gap: '12px', alignItems: 'center', maxWidth: '320px',
              animation: 'fadeIn 0.4s ease',
            }}>
              <span>🏠</span>
              <span style={{ flex: 1, fontSize: '14px', lineHeight: 1.4 }}>{n.message}</span>
              <button onClick={() => dismissNotification(n.id)} style={{
                background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '20px', lineHeight: 1,
              }}>×</button>
            </div>
          ))}
        </div>
      )}

      <nav className="nav">
        <div className="nav-logo" onClick={() => navigate('landing')}>🏠 Olim Home</div>
        <div className="nav-links">
          <span className="nav-link" onClick={() => navigate('search')}>{t('searchProperties')}</span>
          {isLandlord && (
            <span className="nav-link" onClick={() => navigate('addProperty')}>{t('addProperty')}</span>
          )}
          {!user ? (
            <>
              <span className="nav-link" onClick={() => navigate('register')}>{t('register')}</span>
              <button className="btn-primary" style={{ padding: '8px 22px', fontSize: '14px' }} onClick={() => navigate('register')}>
                {t('login')}
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {savedIds.length > 0 && (
                <span
                  onClick={() => navigate('profile')}
                  style={{ fontSize: '13px', color: '#F0C96B', cursor: 'pointer', fontWeight: '600' }}
                >
                  ❤️ {savedIds.length}
                </span>
              )}
              <div
                onClick={() => navigate('profile')}
                style={{ display: 'flex', flexDirection: 'column', alignItems: lang === 'he' ? 'flex-end' : 'flex-start', cursor: 'pointer' }}
              >
                <div style={{ fontSize: '14px', color: '#fff', fontWeight: '600' }}>{user.fullName}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{t('myProfile')}</div>
              </div>
              <button className="link-button" onClick={handleLogout}>{t('logout')}</button>
            </div>
          )}
          <select
            className="language-select"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            {LANGS.map((option) => (
              <option key={option.code} value={option.code}>
                {option.flag} {option.label}
              </option>
            ))}
          </select>
        </div>
      </nav>

      {page === 'landing' && (
        <LandingPage
          onNavigate={navigate}
          t={t}
          lang={lang}
          contractsCount={contractsCount}
          onSetLang={setLang}
        />
      )}
      {page === 'register' && (
        <RegisterPage onNavigate={navigate} onRegister={handleRegister} t={t} lang={lang} />
      )}
      {page === 'search' && (
        <SearchPage
          onNavigate={navigate}
          onSelectProperty={(id) => setSelectedPropertyId(id)}
          user={user}
          properties={properties}
          t={t}
          lang={lang}
          onAddTenant={handleAddTenant}
          savedIds={savedIds}
          onToggleSaved={handleToggleSaved}
        />
      )}
      {page === 'addProperty' && (
        <AddPropertyPage onAddProperty={handleAddProperty} user={user} t={t} lang={lang} />
      )}
      {page === 'property' && (
        <PropertyPage
          property={selectedProperty}
          onNavigate={navigate}
          user={user}
          t={t}
          lang={lang}
          savedIds={savedIds}
          onToggleSaved={handleToggleSaved}
          onContractClose={handleContractClose}
          onToggleAvailability={handleToggleAvailability}
        />
      )}
      {page === 'profile' && (
        <ProfilePage
          user={user}
          setUser={setUser}
          onNavigate={navigate}
          t={t}
          lang={lang}
          savedIds={savedIds}
          properties={properties}
          onToggleSaved={handleToggleSaved}
          onSelectProperty={(id) => { setSelectedPropertyId(id); navigate('property'); }}
          contractStatuses={contractStatuses}
          onUpdateContractStatus={handleUpdateContractStatus}
        />
      )}
    </div>
  );
}
