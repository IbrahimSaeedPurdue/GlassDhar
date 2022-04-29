import flaskApp from './axiosSetup';

// ------- COMPANIES -------
export const getCompanies = () => {
  return flaskApp.get('/company/all');
};

export const insertCompany = ({ name, companySite, industry, numOfEmp, description }) => {
  return flaskApp.post('/company/insert', {
    data: {
      name: name,
      company_site: companySite,
      industry: industry,
      num_of_emp: numOfEmp,
      description: description
    }
  });
};

export const deleteCompany = (companyId) => {
  return flaskApp.post('/company/delete', {
    data: {
      company_id: companyId
    }
  });
};

// ------- JOB POSTINGS -------
export const jobPostingFilterByDetails = ({ name, companyId, location, jobLevel, minSalary, skills }) => {
  return flaskApp.post('job-postings/filter', {
    data: {
      name: name,
      company_id: companyId,
      location: location,
      job_level: jobLevel,
      min_salary: minSalary,
      skills: skills
    }
  });
};
// ------- SKILLS -------
export const getSkills = () => {
  return flaskApp.get('/skills/all');
};
