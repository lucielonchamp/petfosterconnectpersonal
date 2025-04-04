import { Route, Routes } from 'react-router';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Dashboard from './views/dashboard/Dashboard';
import Home from './views/home/Home';
import Login from './views/login/Login';
import Register from './views/register/Register';

function App() {

  return (
    <>
      <Routes>
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App;