import { Link } from 'react-router';
import { useState } from "react";
import './Header.css';
import logo from '../../../assets/logo.png';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ButtonPurple from '../../ui/ButtonPurple';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    return (
        <header id="header" className="container">
            {/* Burger Menu */}
            <div className="menu-icon" onClick={toggleMenu}>
                <MenuIcon sx={{color: '#5B6C97', fontSize: '30px'}}/>
            </div>

            {/* Logo */}
            <div className="logo-container">
                <img src={logo} className="logo" alt="logo" />
            </div>

            {/* Navigation */}
            <nav className={menuOpen ? "open" : ""}>
                {/* Mobile Menu Header */}
                <div className="mobile-menu-header">
                    <a className="back-arrow" onClick={closeMenu}>
                        <ArrowBackIosIcon sx={{color: '#5B6C97', fontSize: '30px'}} />
                    </a>
                    <span className="menu-title">Menu</span>
                </div>

                <ul>
                    <li><Link to="/" onClick={closeMenu}>Accueil</Link></li>
                    <li><Link to="#" onClick={closeMenu}>Animaux</Link></li>
                    <li><Link to="#" onClick={closeMenu}>Association</Link></li>
                </ul>
            </nav>

            {/* Connexion */}
            <div className="login-container">
                <ButtonPurple href="/login">Connexion</ButtonPurple>
            </div>

        </header>
    );
}

export default Header;
