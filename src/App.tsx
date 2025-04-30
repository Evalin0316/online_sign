import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Provider from './provider';
import SignList from './pages/signList';
import FileUpload from './pages/fileUpload';
import AddSign from './pages/addSign';
import PageLoading from './components/PageLoading';
import './sass/all.sass'


function App() {

  return (
    <Provider>
      <Router>
        <Routes>
          <Route path='/' element={<SignList />} />
          <Route path='/upload/:id?' element={<FileUpload />} />
          <Route path='/addSign' element={<AddSign />} />
        </Routes>
        {/* <PageLoading /> */}
      </Router>
    </Provider>
  );
}

export default App;
