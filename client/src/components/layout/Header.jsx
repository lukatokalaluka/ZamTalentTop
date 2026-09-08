import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Button from '../common/Button';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Discover', to: '/discover' },
  { label: 'Categories', to: '/categories' },
  { label: 'Marketplace', to: '/marketplace' },
  { label: 'Dashboard', to: '/dashboard' },
];

export default function Header({ theme, onToggleTheme, onShowToast }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <header className="topbar">
      <div className="container topbar__inner">
        <Link to="/" className="brand" aria-label="Zam Talent Top home">
          <span className="brand__mark">ZT</span>
          <span className="brand__text">ZAM TALENT TOP</span>
        </Link>

        <nav className="nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav__link nav__link--active' : 'nav__link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="topbar__actions">
          <button
            type="button"
            className="theme-toggle"
            aria-label="Toggle theme"
            onClick={onToggleTheme}
          >
            {theme === 'light' ? '☾' : '☀'}
          </button>

          <Button
            to="/login"
            variant="ghost"
            className="hide-mobile"
            onClick={() => onShowToast?.('Welcome back to ZAM TALENT TOP')}
          >
            Login
          </Button>

          <Button
            to="/register"
            onClick={() => onShowToast?.('Create your free talent profile')}
          >
            Join now
          </Button>

          <button
            type="button"
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            ☰
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="mobile-menu">
          <div className="container mobile-menu__content">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'mobile-menu__link mobile-menu__link--active' : 'mobile-menu__link')}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mobile-menu__actions">
              <Button to="/login" variant="ghost" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Button>
              <Button to="/register" onClick={() => setMobileMenuOpen(false)}>
                Join now
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
