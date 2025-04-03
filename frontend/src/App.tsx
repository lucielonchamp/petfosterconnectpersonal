import { Route, Routes } from 'react-router';
import './App.css';
import Home from './views/home/Home';
import Login from './views/login/Login';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App;