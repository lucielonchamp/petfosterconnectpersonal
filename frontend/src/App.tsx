import { Route, Routes } from 'react-router';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Dashboard from './views/dashboard/Dashboard';
import Home from './views/home/Home';
import Login from './views/login/Login';
import Register from './views/register/Register';
import ShelterProfile from './views/shelter-profile/ShelterProfile';
import FosterProfile from './views/foster-profile/FosterProfile';
import NotFound from './views/not-found/NotFound';

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/shelter/profile"
          element={
            <ProtectedRoute>
              <ShelterProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/foster/profile"
          element={
            <ProtectedRoute>
              <FosterProfile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
