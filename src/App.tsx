import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignList from './pages/signList';
import FileUpload from './pages/fileUpload';
import PageLoading from './components/PageLoading';
import './sass/all.sass'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<SignList />} />
        <Route path='/upload' element={<FileUpload />} />
      </Routes>
      {/* <PageLoading /> */}
    </Router>
  );
}

export default App;
