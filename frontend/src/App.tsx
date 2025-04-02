import { Route, Routes } from 'react-router';
import './App.css';
import Login from './views/login/Login';

function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App;