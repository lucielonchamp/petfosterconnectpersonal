import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { Link } from 'react-router';
import logo from '../../../assets/logo.png';
import { useAuth } from '../../../hooks/useAuth';
import ButtonPurple from '../../ui/ButtonPurple';
import './Header.css';


function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  const { user } = useAuth();


  return (
    <header id="header" className="container">
      {/* Burger Menu */}
      <div className="menu-icon" onClick={toggleMenu}>
        <MenuIcon sx={{ color: '#5B6C97', fontSize: '30px' }} />
      </div>

      {/* Logo */}
      <div className="logo-container">
        <img src={logo} className="logo" alt="logo" />
      </div>

      {/* Navigation */}
      <nav className={menuOpen ? 'open' : ''}>
        {/* Mobile Menu Header */}
        <div className="mobile-menu-header">
          <a className="back-arrow" onClick={closeMenu}>
            <ArrowBackIosIcon sx={{ color: '#5B6C97', fontSize: '30px' }} />
          </a>
          <span className="menu-title">Menu</span>
        </div>

        <ul>
          <li>
            <Link to="/" onClick={closeMenu}>
              Accueil
            </Link>
          </li>
          <li>
            <Link to="/animals" onClick={closeMenu}>
              Animaux
            </Link>
          </li>
          <li>
            <Link to="/association" onClick={closeMenu}>
              Association
            </Link>
          </li>
        </ul>
      </nav>

      {/* Connexion ou Dashboard */}
      <div className="cta-login-container">
        {user ? (
          <ButtonPurple
            href="/dashboard"
            startIcon={<DashboardIcon />}
          >
            Dashboard
          </ButtonPurple>
        ) : (
          <ButtonPurple href="/login">
            Connexion
          </ButtonPurple>
        )}
      </div>
    </header>
  );
}

export default Header;
