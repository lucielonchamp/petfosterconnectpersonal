import Header from '../../components/layout/header/Header';
import './Home.css';
import heart from '../../assets/heart.png';
import dog from '../../assets/dog.png';
import cat from '../../assets/cat.png';
import doggi from '../../assets/doggi.png';
import corgi from '../../assets/corgi.png';
import ButtonPurple from '../../components/ui/ButtonPurple';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Typography } from '@mui/material';

function Home() {

    return (
        <>
            <Header />
            <section id="home" className="container">
                <div>
                    <div className="img-left">
                        <img src={heart} className="heart" alt="" />
                    </div>
                    <div className="title">
                        <Typography variant="h1">Découvrez votre futur compagnon</Typography>
                        <Typography className="text-bold" variant="body2">Lorem ipsum sit amet consectetur. At pellen tesque neque semper odio massa.</Typography>
                        <ButtonPurple href="/next" fontSize="18px" endIcon={<ArrowForwardIcon sx={{ backgroundColor: 'white', color: 'var(--color-purple)', fontSize: 30, borderRadius: '15px', padding: '5px' }} />}>
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
                    <img src={doggi} alt="" />
                    <div>
                        <img src={cat} className="cat" alt="" />
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home;