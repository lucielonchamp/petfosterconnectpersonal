import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Container, Typography } from '@mui/material';
import cat from '../../assets/cat.webp';
import corgi from '../../assets/corgi.webp';
import dog from '../../assets/dog.webp';
import doggi from '../../assets/doggi.webp';
import heart from '../../assets/heart.webp';
import Header from '../../components/layout/header/Header';
import ButtonPurple from '../../components/ui/ButtonPurple';
import './Home.css';
import { Path } from '../../interfaces/Path';
import Footer from '../../components/layout/footer/Footer';
import SEO from '../../components/layout/seo/SEO';

function Home() {
  return (
    <>
      <SEO
        title="Accueil - PetFoster"
        description="Découvrez PetFoster, votre application pour trouver des animaux à adopter dans les refuges."
      />
      <div id="home-page">
        <Container maxWidth="xl">
          <Header />
        </Container>
        <Container maxWidth="xl" sx={{ height: 'fit-content' }}>
          <section id="home">
            <div>
              <div className="img-left">
                <img src={heart} className="heart" alt="" />
              </div>
              <div className="title">
                <Typography variant="h1">Découvrez votre futur compagnon</Typography>
                <Typography className="text-bold" variant="body2">
                  Lorem ipsum sit amet consectetur. At pellen tesque neque semper odio massa.
                </Typography>
                <ButtonPurple
                  href={Path.ANIMALS}
                  fontSize="18px"
                  endIcon={
                    <ArrowForwardIcon
                      sx={{
                        backgroundColor: 'white',
                        color: 'var(--color-purple)',
                        fontSize: 30,
                        borderRadius: '15px',
                        padding: '5px',
                      }}
                    />
                  }
                >
                  Commencez maintenant !
                </ButtonPurple>
              </div>
              <div className="img-right">
                <img src={dog} className="dog" alt="" />
              </div>
            </div>
            <div className="imgs">
              <div>
                <img src={corgi} alt="" />
              </div>
              <img src={doggi} loading="eager" alt="" />
              <div>
                <img src={cat} className="cat" alt="" />
              </div>
            </div>
          </section>
        </Container>
        <Container maxWidth="xl">
          <Footer />
        </Container>
      </div>
    </>
  );
}

export default Home;
