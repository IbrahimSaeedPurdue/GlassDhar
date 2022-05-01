import React from 'react';
import { Routes, Route } from 'react-router-dom';

import CompanyForm from './pages/CompanyForm.js';
import JobPostings from './pages/JobPostings.js';
import CompanyEditForm from './pages/CompanyEditForm.js';
import ApplicantForm from './pages/ApplicantForm.js';
function App () {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<CompanyForm />} />
        <Route path='/job-postings' element={<JobPostings />} />
        <Route path='/applicants' element={<ApplicantForm />} />
      </Routes>
    </div>
  );
}

export default App;
