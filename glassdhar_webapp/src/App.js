import React from 'react';
import { Routes, Route } from 'react-router-dom';

import CompanyForm from './pages/CompanyForm.js';
import JobPostings from './pages/JobPostings.js';
import CreateJobPosting from './pages/CreateJobPosting.js';


function App () {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<CompanyForm />} />
        <Route path='/job-postings' element={<JobPostings />} />
        <Route path='/job-postings/create' element={<CreateJobPosting />} />
      </Routes>
    </div>
  );
}

export default App;
