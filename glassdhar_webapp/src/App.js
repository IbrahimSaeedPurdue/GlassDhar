import React from 'react';
import { Routes, Route } from 'react-router-dom';

import CompanyForm from './pages/CompanyForm.js';

function App () {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<CompanyForm />} />
      </Routes>
    </div>
  );
}

export default App;
