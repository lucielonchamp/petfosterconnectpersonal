import { Link } from "react-router";
import { Path } from "../../../interfaces/Path";
import './Footer.css';
import { Container, Typography } from "@mui/material";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Container maxWidth="xl">
      <footer id="footer">
        <nav>
          <ul>
            <li>
              <Link to={Path.TERMSSERVICE}>
                Conditions générales d'utilisation
              </Link>
            </li>
            <li>
              <Link to={Path.LEGALNOTICE}>
                Mentions légales
              </Link>
            </li>
            <li>
              <Link to={Path.PRIVACYPOLICY}>
                Politique de Confidentialité
              </Link>
            </li>
          </ul>
        </nav>
        <Typography sx={{ display: 'flex', justifyContent: 'center', mt: '10px', fontSize: '12px' }}>Copyright © PetFoster - {currentYear}</Typography>
      </footer>
    </Container>
  );
}

export default Footer;
