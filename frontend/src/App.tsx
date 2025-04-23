import { Route, Routes } from 'react-router';
import './App.css';
import ConnectedLayout from './components/layout/ConnectedLayout/ConnectedLayout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { Path } from './interfaces/Path';
import AnimalDetail from './views/animal-detail/AnimalDetail';
import Animals from './views/animals/Animals';
import Dashboard from './views/dashboard/Dashboard';
import FosterProfile from './views/foster-profile/FosterProfile';
import Home from './views/home/Home';
import Login from './views/login/Login';
import NotFound from './views/not-found/NotFound';
import Register from './views/register/Register';
import ShelterProfile from './views/shelter-profile/ShelterProfile';
import AddRequest from './views/request/AddRequest';

function App() {
  return (
    <>
      <Routes>
        <Route path={Path.HOME} element={<Home />} />
        <Route path={Path.LOGIN} element={<Login />} />
        <Route path={Path.REGISTER} element={<Register />} />
        <Route path={Path.ANIMAL_DETAIL} element={<AnimalDetail />} />
        <Route path={Path.ANIMALS} element={<Animals />} />

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
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ConnectedLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
