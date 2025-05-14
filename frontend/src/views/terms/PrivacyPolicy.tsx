import { Container, Typography, Box, Breadcrumbs, Link } from "@mui/material";
import Footer from "../../components/layout/footer/Footer";
import Header from "../../components/layout/header/Header";
import {
    Home as HomeIcon
} from '@mui/icons-material';
import { useNavigate } from "react-router";

const PrivacyPolicy = () => {
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
                    <Typography color="text.primary">Politique de Confidentialité</Typography>
                </Breadcrumbs>
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h1" sx={{ mb: 4 }}>
                        Politique de Confidentialité
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Dernière mise à jour : [À compléter]
                    </Typography>
                </Box>

                <Box sx={{ mb: 6 }}>
                    <Typography variant="h2" sx={{ mb: 2 }}>
                        Collecte des informations
                    </Typography>
                    <Typography variant="body1">
                        Nous collectons des informations personnelles lorsque vous utilisez notre site, telles que votre nom,
                        votre adresse email, votre adresse IP et d'autres informations nécessaires au bon fonctionnement du service.
                    </Typography>
                </Box>

                <Box sx={{ mb: 6 }}>
                    <Typography variant="h2" sx={{ mb: 2 }}>
                        Utilisation des informations
                    </Typography>
                    <Typography variant="body1">
                        Les informations collectées sont utilisées pour vous fournir un service optimal, pour le suivi des statistiques
                        de visite et pour des raisons de sécurité.
                    </Typography>
                </Box>

                <Box sx={{ mb: 6 }}>
                    <Typography variant="h2" sx={{ mb: 2 }}>
                        Partage des données
                    </Typography>
                    <Typography variant="body1">
                        Vos données personnelles ne seront jamais vendues ni partagées avec des tiers sans votre consentement,
                        sauf obligation légale ou demande des autorités.
                    </Typography>
                </Box>

                <Box sx={{ mb: 6 }}>
                    <Typography variant="h2" sx={{ mb: 2 }}>
                        Droits des utilisateurs
                    </Typography>
                    <Typography variant="body1">
                        Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.
                    </Typography>
                </Box>
            </Container>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;
