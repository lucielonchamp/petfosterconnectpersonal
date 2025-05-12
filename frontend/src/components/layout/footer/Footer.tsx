import { Link } from "react-router";
import { Path } from "../../../interfaces/Path";
import './Footer.css';
import { Container } from "@mui/material";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Container maxWidth="xl">
      <footer id="footer">
        <nav>
          <ul>
            <li>
              <Link to={Path.CGU}>
                Conditions générales d'utilisation
              </Link>
            </li>
            <li>
              Copyright © PetFoster - {currentYear}
            </li>
            <li>
              <Link to={Path.MENTIONSLEGALES}>
                Mentions légales
              </Link>
            </li>
          </ul>
        </nav>
      </footer>
    </Container>
  );
}

export default Footer;
