import { Container, Typography, Box, Breadcrumbs, Link } from "@mui/material";
import Footer from "../../components/layout/footer/Footer";
import Header from "../../components/layout/header/Header";
import {
    Home as HomeIcon
} from '@mui/icons-material';
import { useNavigate } from "react-router";

const LegalNotice = () => {
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Breadcrumbs sx={{ marginBottom: '35px' }}>
                    <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ display: 'flex', alignItems: 'center' }}>
                        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Accueil
                    </Link>
                    <Typography color="text.primary">Mentions Légales</Typography>
                </Breadcrumbs>
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h1" sx={{ mb: 4 }}>
                        Mentions Légales
                    </Typography>
                </Box>

                <Box sx={{ mb: 6 }}>
                    <Typography variant="h2" sx={{ mb: 2 }}>
                        Éditeur du site
                    </Typography>
                    <Typography variant="body1">
                        Nom de l'entreprise : [À compléter]
                        <br />
                        Adresse : [À compléter]
                        <br />
                        Téléphone : [À compléter]
                        <br />
                        Email : [À compléter]
                        <br />
                        Numéro de SIRET : [À compléter]
                    </Typography>
                </Box>

                <Box sx={{ mb: 6 }}>
                    <Typography variant="h2" sx={{ mb: 2 }}>
                        Hébergement
                    </Typography>
                    <Typography variant="body1">
                        Hébergeur : [Nom de l'hébergeur]
                        <br />
                        Adresse : [À compléter]
                        <br />
                        Téléphone : [À compléter]
                    </Typography>
                </Box>

                <Box sx={{ mb: 6 }}>
                    <Typography variant="h2" sx={{ mb: 2 }}>
                        Propriété intellectuelle
                    </Typography>
                    <Typography variant="body1">
                        Le site et son contenu sont protégés par le droit de la propriété intellectuelle. Toute reproduction,
                        représentation ou distribution sans autorisation est strictement interdite.
                    </Typography>
                </Box>
            </Container>
            <Footer />
        </>
    );
};

export default LegalNotice;
