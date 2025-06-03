import { Route, Routes } from 'react-router';
import './App.css';
import ConnectedLayout from './components/layout/ConnectedLayout/ConnectedLayout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { Path } from './interfaces/Path';
import AnimalDetail from './views/animal-detail/AnimalDetail';
import AnimalForm from './views/animals/AnimalForm';
import Animals from './views/animals/Animals';
import Dashboard from './views/dashboard/Dashboard';
import FosterProfile from './views/foster-profile/FosterProfile';
import Home from './views/home/Home';
import Login from './views/login/Login';
import NotFound from './views/not-found/NotFound';
import NotFoundPage from './views/not-found/NotFoundPage';
import Register from './views/register/Register';
import AddRequest from './views/request/AddRequest';
import RequestDetails from './views/request/RequestDetails';
import ShelterProfile from './views/shelter-profile/ShelterProfile';
import ShelterDetails from './views/shelter/ShelterDetails';
import ShelterList from './views/shelter/ShelterList';
import { MyAnimals } from './views/foster-profile/MyAnimals';
import TermsOfService from './views/terms/TermsOfService';
import LegalNotice from './views/terms/LegalNotice';
import PrivacyPolicy from './views/terms/PrivacyPolicy';
import { RequestList } from './views/request/RequestList';

function App() {
  return (
    <>
      <Routes>
        <Route path={Path.HOME} element={<Home />} />
        <Route path={Path.LOGIN} element={<Login />} />
        <Route path={Path.REGISTER} element={<Register />} />
        <Route path={Path.ANIMAL_DETAIL} element={<AnimalDetail />} />
        <Route path={Path.ANIMALS} element={<Animals />} />
        <Route path={Path.SHELTERS} element={<ShelterList />} />
        <Route path={Path.SHELTERBYID} element={<ShelterDetails />} />
        <Route path={Path.TERMSSERVICE} element={<TermsOfService />} />
        <Route path={Path.LEGALNOTICE} element={<LegalNotice />} />
        <Route path={Path.PRIVACYPOLICY} element={<PrivacyPolicy />} />

        <Route
          path={`${Path.DASHBOARD}/*`}
          element={
            <ProtectedRoute>
              <ConnectedLayout>
                <Routes>
                  {/* CONNECTED ROUTES (relatives à /dashboard) */}
                  <Route index element={<Dashboard />} />
                  <Route path={Path.SHELTER_PROFILE} element={<ShelterProfile />} />
                  <Route path={Path.FOSTER_PROFILE} element={<FosterProfile />} />
                  <Route path={Path.ADD_REQUEST} element={<AddRequest />} />
                  <Route path={Path.REQUEST} element={<RequestDetails />} />
                  <Route path={Path.ANIMAL_CREATE} element={<AnimalForm />} />
                  <Route path={Path.ANIMAL_EDIT} element={<AnimalForm />} />
                  <Route path={Path.ANIMALS} element={<MyAnimals />} />
                  <Route path={Path.REQUESTS} element={<RequestList />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ConnectedLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
