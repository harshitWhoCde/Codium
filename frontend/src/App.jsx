import React from 'react'
import EditorPage from './pages/EditorPage'
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import JoinRoom from './pages/JoinRoom.jsx';
import LandingPage from './pages/LandingPage.jsx';




const App = () => {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/editor/:roomId" element={<EditorPage />} />
        <Route path="/joinroom" element={<JoinRoom/>}/>
      </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;

