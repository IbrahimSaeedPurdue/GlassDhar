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

export const updateCompany = ({companyId, name, companySite, industry, numOfEmp, description }) => {
  return flaskApp.post('/company/update', {
    data: {
      company_id: companyId,
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

export const insertJobPosting = ({ positionName, companyId, location, salary, jobLevel, jobDescription, skills }) => {
  return flaskApp.post('/jobposting/insert', {
    data: {
      position_name: positionName,
      company_id: companyId,
      location: location,
      salary: salary,
      job_level: jobLevel,
      job_description: jobDescription,
      skills: skills
    }
  });
};

export const insertApplication = ( applicant_id, job_posting_id ) => {
  return flaskApp.post('/application/insert', {
    data: {
      applicant_id: applicant_id,
      job_posting_id: job_posting_id
    }
  });
};


// ------- SKILLS -------
export const getSkills = () => {
  return flaskApp.get('/skills/all');
};
