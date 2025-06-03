import { Container, Typography, Box, Breadcrumbs, Link } from "@mui/material";
import Header from "../../components/layout/header/Header";
import Footer from "../../components/layout/footer/Footer";
import {
    Home as HomeIcon
} from '@mui/icons-material';
import { useNavigate } from "react-router";

const TermsOfService = () => {
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
                    <Typography color="text.primary">Condition Générales d'Utilisation</Typography>
                </Breadcrumbs>
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h1" sx={{ mb: 4 }}>
                        Conditions Générales d'Utilisation
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Dernière mise à jour : [À compléter]
                    </Typography>
                </Box>

                <Box sx={{ mb: 6 }}>
                    <Typography variant="h2" sx={{ mb: 2 }}>
                        1. Acceptation des conditions
                    </Typography>
                    <Typography variant="body1">
                        En accédant et en utilisant le site [Nom du site], vous acceptez sans réserve les présentes conditions générales
                        d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce site.
                    </Typography>
                </Box>

                <Box sx={{ mb: 6 }}>
                    <Typography variant="h2" sx={{ mb: 2 }}>
                        2. Accès au site
                    </Typography>
                    <Typography variant="body1">
                        Le site est accessible gratuitement à tout utilisateur disposant d'un accès à Internet. Les frais d'accès et
                        d'utilisation du réseau sont à la charge de l'utilisateur.
                    </Typography>
                </Box>

                <Box sx={{ mb: 6 }}>
                    <Typography variant="h2" sx={{ mb: 2 }}>
                        3. Propriété intellectuelle
                    </Typography>
                    <Typography variant="body1">
                        Le contenu du site, incluant mais non limité aux textes, images, logos, est la propriété exclusive de [Nom de l'entreprise].
                        Toute reproduction est strictement interdite sans autorisation préalable.
                    </Typography>
                </Box>

                <Box sx={{ mb: 6 }}>
                    <Typography variant="h2" sx={{ mb: 2 }}>
                        4. Limitation de responsabilité
                    </Typography>
                    <Typography variant="body1">
                        [Nom de l'entreprise] décline toute responsabilité en cas de dommages résultant de l'utilisation du site, incluant
                        des erreurs techniques ou des interruptions de service.
                    </Typography>
                </Box>

                <Box sx={{ mb: 6 }}>
                    <Typography variant="h2" sx={{ mb: 2 }}>
                        5. Modifications des CGU
                    </Typography>
                    <Typography variant="body1">
                        Les présentes CGU peuvent être modifiées à tout moment par [Nom de l'entreprise]. Les utilisateurs sont invités
                        à consulter régulièrement la dernière version disponible sur le site.
                    </Typography>
                </Box>
            </Container >
            <Footer />
        </>
    );
};

export default TermsOfService;
