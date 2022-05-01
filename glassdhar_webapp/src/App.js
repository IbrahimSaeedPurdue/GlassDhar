import React from 'react';
import { Routes, Route } from 'react-router-dom';

import CompanyForm from './pages/CompanyForm.js';
import JobPostings from './pages/JobPostings.js';


import CompanyEditForm from './pages/CompanyEditForm.js';
function App () {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<CompanyForm />} />
        <Route path='/job-postings' element={<JobPostings />} />
      </Routes>
    </div>
  );
}

export default App;
